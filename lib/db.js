import "server-only";
import mysql from "mysql2/promise";

let pool = null;
let shutdownRegistered = false;

/**
 * Singleton MySQL Pool
 */
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,

      // sensible defaults
      decimalNumbers: true,
      dateStrings: true,
    });

    // warm-up (fire & forget)
    pool.query("SELECT 1").catch(() => {});

    registerGracefulShutdown(pool);
  }

  return pool;
}

/* ------------------------------------------------
 * Graceful shutdown (SAFE)
 * ------------------------------------------------ */
function registerGracefulShutdown(pool) {
  // 1️⃣ Edge / non-node guard
  if (
    typeof process === "undefined" ||
    process.env.NEXT_RUNTIME === "edge"
  ) {
    return;
  }

  // 2️⃣ Serverless ortamlar için opsiyonel
  // (Vercel serverless'ta genelde gerekmez)
  if (process.env.DB_GRACEFUL_SHUTDOWN !== "true") {
    return;
  }

  // 3️⃣ Tek sefer register et
  if (shutdownRegistered) return;
  shutdownRegistered = true;

  const shutdown = async (signal) => {
    try {
      console.log(`🛑 ${signal} received. Closing DB pool...`);
      await pool?.end();
    } catch (err) {
      console.error("Error during DB shutdown", err);
    } finally {
      process.exit(0);
    }
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

/**
 * Centralized query helper
 * - retry (transient errors only)
 */
export async function query(sql, params = []) {
  const db = getPool();
  const maxRetries = 2;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const [rows] = await db.query(sql, params);
      return rows;
    } catch (error) {
      const isTransient = isTransientError(error);
      const isLastTry = attempt === maxRetries;

      if (!isTransient || isLastTry) {
        logError(sql, params, error);
        throw new Error("Database query failed");
      }

      await sleep(200 * (attempt + 1));
    }
  }
}

/**
 * Transaction helper
 */
export async function tx(callback) {
  let conn;

  try {
    conn = await getPool().getConnection();
    await conn.beginTransaction();

    const result = await callback(conn);

    await conn.commit();
    return result;
  } catch (error) {
    if (conn) {
      try {
        await conn.rollback();
      } catch {}
    }
    throw error;
  } finally {
    if (conn) conn.release();
  }
}


/**
 * Healthcheck
 */
export async function dbHealth() {
  try {
    await query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

/* ---------------- helpers ---------------- */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isTransientError(err) {
  const code = String(err?.code || "").toUpperCase();

  return (
    code.includes("PROTOCOL_CONNECTION_LOST") ||
    code.includes("ECONNRESET") ||
    code.includes("ETIMEDOUT") ||
    err?.errno === 1205 || // lock wait timeout
    err?.errno === 1213    // deadlock
  );
}

function logError(sql, params, error) {
  const isDev = process.env.NODE_ENV !== "production";

  console.error("❌ DATABASE ERROR");

  if (isDev) {
    console.error("SQL:", sql);
    console.error("PARAMS:", params);
    console.error(error);
  }
}
