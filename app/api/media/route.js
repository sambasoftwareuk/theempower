import { NextResponse } from "next/server";
import { query, tx } from "@/lib/db";

/**
 * GET /api/media?locale=xx&id=xx
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const locale = searchParams.get("locale");

    // Tek media
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
          ml.alt_text,
          ml.caption
        FROM media m
        LEFT JOIN media_locales ml ON ml.media_id = m.id
        LEFT JOIN locales l ON l.id = ml.locale_id
        WHERE m.id = ?
          ${locale ? "AND l.code = ?" : ""}
        LIMIT 1
        `,
        locale ? [id, locale] : [id]
      );

      if (!rows.length) {
        return NextResponse.json(
          { error: "Media not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ media: rows[0] });
    }

    // Liste
    const items = await query(
      `
      SELECT 
        m.id,
        m.file_path AS url,
        m.file_name,
        m.mime_type,
        m.width,
        m.height,
        ml.alt_text,
        ml.caption
      FROM media m
      LEFT JOIN media_locales ml ON ml.media_id = m.id
      LEFT JOIN locales l ON l.id = ml.locale_id
      ${locale ? "WHERE l.code = ?" : ""}
      ORDER BY m.created_at DESC
      `,
      locale ? [locale] : []
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
      locale = "en-GB",
    } = body;

    if (!file_path || !file_name || !mime_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const mediaId = await tx(async (conn) => {
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
          width || null,
          height || null,
          file_size || null,
          checksum || null,
        ]
      );

      const id = mediaResult.insertId;

      if (alt_text || caption) {
        const [localeRow] = await conn.query(
          `SELECT id FROM locales WHERE code = ? LIMIT 1`,
          [locale]
        );

        if (localeRow.length) {
          await conn.query(
            `
            INSERT INTO media_locales
              (media_id, locale_id, alt_text, caption)
            VALUES (?, ?, ?, ?)
            `,
            [id, localeRow[0].id, alt_text || null, caption || null]
          );
        }
      }

      return id;
    });

    return NextResponse.json({ id: mediaId });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create media" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/media?id=xx
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const result = await query(
      `DELETE FROM media WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Media not found or in use" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // FK RESTRICT
    return NextResponse.json(
      { error: "Media is in use and cannot be deleted" },
      { status: 409 }
    );
  }
}
