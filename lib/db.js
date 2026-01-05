import "server-only";
import mysql from "mysql2/promise";

let pool = null;

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

    // warm-up
    pool.query("SELECT 1").catch(() => {});

    // graceful shutdown
    if (typeof process !== "undefined") {
      const close = async () => {
        try {
          await pool?.end();
        } catch {}
      };

      process.on("SIGINT", async () => {
        await close();
        process.exit(0);
      });

      process.on("SIGTERM", async () => {
        await close();
        process.exit(0);
      });
    }
  }

  return pool;
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
  const conn = await getPool().getConnection();

  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (error) {
    try {
      await conn.rollback();
    } catch {}
    throw error;
  } finally {
    conn.release();
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
    err?.errno === 1205 ||
    err?.errno === 1213
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
