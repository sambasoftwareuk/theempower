import { NextResponse } from "next/server";
import { query } from "@/lib/db";

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
async function ensureUniqueSlug(baseSlug) {
  const rows = await query(
    "SELECT slug FROM content_locales WHERE slug LIKE ?",
    [`${baseSlug}%`]
  );

  const existingSlugs = rows.map((r) => r.slug);
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function POST(request) {
  try {
    const { groupId, title, locale = "en" } = await request.json();

    if (!groupId || !title) {
      return NextResponse.json(
        { error: "groupId and title are required" },
        { status: 400 }
      );
    }

    // --- 1️⃣ Aynı title + locale kontrolü ---
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

    // --- 2️⃣ Slug oluştur ve benzersiz yap ---
    const baseSlug = createSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);

    // --- 3️⃣ Boş content oluştur ---
    const result = await query(`INSERT INTO contents () VALUES ()`);
    const contentId = result.insertId;

    // --- 4️⃣ content_locales tablosuna ekle ---
    await query(
      `
      INSERT INTO content_locales (content_id, locale_id, title, slug)
      VALUES (
        ?,
        (SELECT id FROM locales WHERE code = ?),
        ?,
        ?
      )
      `,
      [contentId, locale, title, slug]
    );

    // --- 5️⃣ content_group_items ile ilişkilendir ---
    await query(
      `
      INSERT INTO content_group_items (content_id, content_group_id)
      VALUES (?, ?)
      `,
      [contentId, groupId]
    );

    return NextResponse.json({ success: true, contentId, slug });
  } catch (error) {
    console.error("POST /api/content-items error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save" },
      { status: 500 }
    );
  }
}
