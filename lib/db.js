import "server-only";
import mysql from "mysql2/promise";

let shutdownRegistered = false;

/**
 * Singleton MySQL Pool
 */
export function getPool() {
  if (!globalThis.__MYSQL_POOL__) {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,

      decimalNumbers: true,
      dateStrings: true,
    });

    // store globally for singleton behavior
    globalThis.__MYSQL_POOL__ = pool;

    // register graceful shutdown (VPS prod-only)
    registerGracefulShutdown(pool);
  }

  return globalThis.__MYSQL_POOL__;
}

/**
 * BACKWARD COMPATIBILITY
 */
export const getDB = getPool;

/* ------------------------------------------------
 * Graceful shutdown (SAFE)
 * ------------------------------------------------ */
function registerGracefulShutdown(pool) {
  if (
    typeof process === "undefined" ||
    process.env.NEXT_RUNTIME === "edge"
  ) {
    return;
  }

  // Only if explicitly enabled (VPS scenario)
  if (process.env.DB_GRACEFUL_SHUTDOWN !== "true") {
    return;
  }

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

  if (
    process.env.NODE_ENV === "production" &&
    process.env.DB_GRACEFUL_SHUTDOWN === "true"
  ) {
    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
  }
}

/**
 * Centralized query helper
 */
export async function query(sql, params = []) {
  const db = getPool();
  const maxRetries = process.env.NODE_ENV === "production" ? 1 : 2;

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
      try { await conn.rollback(); } catch {}
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

  // retry OK → network/transient
  if (
    code.includes("PROTOCOL_CONNECTION_LOST") ||
    code.includes("ECONNRESET") ||
    code.includes("ETIMEDOUT")
  ) {
    return true;
  }

  // retry NO → lock/deadlock
  if (err?.errno === 1205 || err?.errno === 1213) {
    return false;
  }

  // retry NO → pool/queue related
  if (
    code.includes("POOL_CLOSED") ||
    code.includes("POOL_TIMEOUT") ||
    code.includes("QUEUE_FULL")
  ) {
    return false;
  }

  return false;
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
