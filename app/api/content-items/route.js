import { NextResponse } from "next/server";
import { getDB, query } from "@/lib/db";

// --- Slug oluşturucu, maxLength default 50 ---
function createSlug(text, maxLength = 50) {
  let slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-"); // spaces to hyphens

  if (slug.length > maxLength) slug = slug.slice(0, maxLength);
  slug = slug.replace(/-+$/g, ""); // remove trailing hyphens
  return slug;
}

// --- Slug'ın benzersiz olmasını sağlar ---
async function ensureUniqueSlug(conn, baseSlug) {
  const rows = await conn.query(
    "SELECT slug FROM content_locales WHERE slug LIKE ?",
    [`${baseSlug}%`]
  );
  const existingSlugs = rows[0].map((r) => r.slug);

  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function POST(request) {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    const { groupId, title, locale = "en" } = await request.json();

    if (!groupId || !title) {
      return NextResponse.json(
        { error: "groupId and title are required" },
        { status: 400 }
      );
    }

    // --- 1️⃣ Aynı title + locale kontrolü (transaction öncesi) ---
    const existing = await query(
      `SELECT id 
       FROM content_locales 
       WHERE title = ? 
       AND locale_id = (SELECT id FROM locales WHERE code = ?)`,
      [title, locale]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A subtitle with this title already exists." },
        { status: 400 }
      );
    }

    await conn.beginTransaction(); // 🔹 Transaction başlat

    // --- 2️⃣ Boş content oluştur ---
    const [result] = await conn.query(`INSERT INTO contents () VALUES ()`);
    const contentId = result.insertId;

    // --- 3️⃣ Slug oluştur ve content_locales tablosuna ekle ---
    const baseSlug = createSlug(title);
    const slug = await ensureUniqueSlug(conn, baseSlug);

    await conn.query(
      `
      INSERT INTO content_locales (content_id, locale_id, title, slug)
      VALUES (?, (SELECT id FROM locales WHERE code = ?), ?, ?)
      `,
      [contentId, locale, title, slug]
    );

    // --- 4️⃣ content_group_items ile ilişkilendir ---
    await conn.query(
      `
      INSERT INTO content_group_items (content_id, content_group_id)
      VALUES (?, ?)
      `,
      [contentId, groupId]
    );

    await conn.commit(); // 🔹 Başarılıysa commit

    return NextResponse.json({ success: true, contentId, slug });
  } catch (error) {
    await conn.rollback(); // 🔹 Hata olursa rollback
    console.error("POST /api/content-items error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save" },
      { status: 500 }
    );
  } finally {
    conn.release(); // 🔹 Connection'ı serbest bırak
  }
}
