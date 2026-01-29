export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { query, tx } from "@/lib/db";
import fs from "fs";
import path from "path";

/**
 * GET /api/media?locale=xx&id=xx
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const locale = searchParams.get("locale") || "en";

    // Single media
    if (id) {
      const rows = await query(
        `
        SELECT 
          m.id,
          m.file_path AS url,
          m.file_name,
          m.mime_type,
          m.width,
          m.height,
          COALESCE(ml_req.alt_text, ml_en.alt_text) AS alt_text,
          COALESCE(ml_req.caption, ml_en.caption) AS caption
        FROM media m
        LEFT JOIN media_locales ml_req
          ON ml_req.media_id = m.id
          AND ml_req.locale_id = (
            SELECT id FROM locales WHERE code = ?
          )
        LEFT JOIN media_locales ml_en
          ON ml_en.media_id = m.id
          AND ml_en.locale_id = 1
        WHERE m.id = ?
        LIMIT 1
        `,
        [locale, id]
      );

      if (!rows.length) {
        return NextResponse.json({ error: "Media not found" }, { status: 404 });
      }

      return NextResponse.json({ media: rows[0] });
    }

    // Media list
    const items = await query(
      `
      SELECT 
        m.id,
        m.file_path AS url,
        m.file_name,
        m.mime_type,
        m.width,
        m.height,
        COALESCE(ml_req.alt_text, ml_en.alt_text) AS alt_text,
        COALESCE(ml_req.caption, ml_en.caption) AS caption
      FROM media m
      LEFT JOIN media_locales ml_req
        ON ml_req.media_id = m.id
        AND ml_req.locale_id = (
          SELECT id FROM locales WHERE code = ?
        )
      LEFT JOIN media_locales ml_en
        ON ml_en.media_id = m.id
        AND ml_en.locale_id = 1
      ORDER BY m.created_at DESC
      `,
      [locale]
    );

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/media
 */

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      file_path,
      file_name,
      mime_type,
      width,
      height,
      file_size,
      checksum,
      alt_text,
      caption,
      locale = "en", // default locale code
    } = body;

    // 1️⃣ Validate required fields
    if (!file_path || !file_name || !mime_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2️⃣ Normalize alt/caption
    const normalizedAlt = alt_text?.trim() || null;
    const normalizedCaption = caption?.trim() || null;

    // 3️⃣ Transaction: Insert media + media_locales
    const mediaId = await tx(async (conn) => {
      // Check if media already exists
      const [existingRows] = await conn.query(
        `SELECT id FROM media WHERE file_path = ? LIMIT 1`,
        [file_path]
      );

      if (existingRows.length) {
        return existingRows[0].id;
      }

      // Insert new media
      const [mediaResult] = await conn.query(
        `
        INSERT INTO media
          (file_path, file_name, mime_type, width, height, file_size, checksum)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          file_path,
          file_name,
          mime_type,
          width ?? null,
          height ?? null,
          file_size ?? null,
          checksum ?? null,
        ]
      );

      const id = mediaResult.insertId;
      console.log("[MEDIA INSERT] ID:", id);

      // -----------------------------
      // media_locales insert (basitleştirilmiş)
      // -----------------------------
      const [localeRows] = await conn.query(
        `SELECT id FROM locales WHERE code = ? LIMIT 1`,
        [locale]
      );
      const localeId = localeRows.length ? localeRows[0].id : 1;

      console.log(
        "[MEDIA_LOCALES] Inserting for media_id:",
        id,
        "locale_id:",
        localeId
      );

      await conn.query(
        `
        INSERT INTO media_locales
          (media_id, locale_id, alt_text, caption)
        VALUES (?, ?, ?, ?)
        `,
        [id, localeId, normalizedAlt, normalizedCaption]
      );

      console.log("[MEDIA_LOCALES] Inserted successfully");

      return id;
    });

    return NextResponse.json({
      success: true,
      media_id: mediaId,
    });
  } catch (error) {
    console.error("Media POST error:", error);
    return NextResponse.json(
      { error: "Failed to create media" },
      { status: 500 }
    );
  }
}
