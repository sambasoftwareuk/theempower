import { NextResponse } from "next/server";
import { query } from "@/lib/db";

function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-"); // spaces to hyphens
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

    const slug = createSlug(title);

    // 1️⃣ create empty content
    const result = await query(`INSERT INTO contents () VALUES ()`);
    const contentId = result.insertId;

    // 2️⃣ add to content_locales
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

    // 3️⃣ link content to group
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
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
