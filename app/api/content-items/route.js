import { NextResponse } from "next/server";
import { query, tx } from "@/lib/db";

// --- Slug oluşturucu ---
function createSlug(text, maxLength = 50) {
  let slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  if (slug.length > maxLength) slug = slug.slice(0, maxLength);
  slug = slug.replace(/-+$/g, "");

  return slug;
}

// --- Slug benzersizliği ---
async function ensureUniqueSlug(conn, baseSlug) {
  const [rows] = await conn.query(
    "SELECT slug FROM content_locales WHERE slug LIKE ?",
    [`${baseSlug}%`]
  );

  const existing = rows.map((r) => r.slug);

  let slug = baseSlug;
  let counter = 1;

  while (existing.includes(slug)) {
    slug = `${baseSlug}-${counter++}`;
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

    /* ------------------------------------------------
     * 1️⃣ Aynı title + locale var mı? (transaction öncesi)
     * ------------------------------------------------ */
    const existing = await query(
      `
      SELECT id
      FROM content_locales
      WHERE title = ?
        AND locale_id = (SELECT id FROM locales WHERE code = ?)
      `,
      [title, locale]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A subtitle with this title already exists." },
        { status: 400 }
      );
    }

    /* ------------------------------------------------
     * 2️⃣ Transaction
     * ------------------------------------------------ */
    const result = await tx(async (conn) => {
      // boş content
      const [insertContent] = await conn.query(
        "INSERT INTO contents () VALUES ()"
      );
      const contentId = insertContent.insertId;

      // slug
      const baseSlug = createSlug(title);
      const slug = await ensureUniqueSlug(conn, baseSlug);

      // locale
      await conn.query(
        `
        INSERT INTO content_locales (content_id, locale_id, title, slug)
        VALUES (?, (SELECT id FROM locales WHERE code = ?), ?, ?)
        `,
        [contentId, locale, title, slug]
      );

      // group relation
      await conn.query(
        `
        INSERT INTO content_group_items (content_id, content_group_id)
        VALUES (?, ?)
        `,
        [contentId, groupId]
      );

      return { contentId, slug };
    });

    return NextResponse.json({
      success: true,
      contentId: result.contentId,
      slug: result.slug,
    });
  } catch (error) {
    console.error("POST /api/content-items error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to save" },
      { status: 500 }
    );
  }
}
