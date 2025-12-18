import "server-only";
import mysql from "mysql2/promise";

let pool;

/**
 * Singleton MySQL Pool
 */
export function getDB() {
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

      // 🔒 Güvenli varsayılanlar
      namedPlaceholders: false,
      decimalNumbers: true,
    });
  }

  return pool;
}

/**
 * Centralized DB query helper
 * Tüm SQL hataları burada yakalanır
 */
export async function query(sql, params = []) {
  const db = getDB();

  try {
    const [rows] = await db.query(sql, params);
    return rows;
  } catch (error) {
    const isDev = process.env.NODE_ENV !== "production";

    console.error("❌ DATABASE QUERY FAILED");

    if (isDev) {
      console.error("SQL:", sql);
      console.error("PARAMS:", params);
      console.error(error);
    }

    /**
     * Üst katmanda (queries / pages) anlamlı yönetilebilsin diye
     * kontrollü hata fırlatıyoruz
     */
    throw new Error("Database query failed");
  }
}
