import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import { join, extname } from "path";
import { createHash } from "crypto";
import { query, tx } from "@/lib/db";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image");
    const locale = formData.get("locale") || "en-GB";
    const alt_text = formData.get("alt_text") || null;
    const caption = formData.get("caption") || null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are accepted" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size cannot exceed 5MB" },
        { status: 400 }
      );
    }

    // uploads klasörü
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const checksum = createHash("sha256").update(buffer).digest("hex");

    // 1️⃣ DB'de aynı checksum var mı?
    const existing = await query(
      `SELECT id, file_path FROM media WHERE checksum = ? LIMIT 1`,
      [checksum]
    );

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        cached: true,
        media_id: existing[0].id,
        url: existing[0].file_path,
      });
    }

    // 2️⃣ Yeni dosya adı (collision-safe)
    const ext = extname(file.name);
    const fileName = `${cryptoRandom() + ext}`;
    const filePath = join(UPLOAD_DIR, fileName);
    const publicPath = `/uploads/${fileName}`;

    // 3️⃣ Dosyayı yaz
    await writeFile(filePath, buffer);

    // 4️⃣ DB INSERT (media + media_locales)
    const mediaId = await tx(async (conn) => {
      const [res] = await conn.query(
        `
        INSERT INTO media
          (file_path, file_name, mime_type, file_size, checksum)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          publicPath,
          fileName,
          file.type,
          file.size,
          checksum,
        ]
      );

      const id = res.insertId;

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
            [id, localeRow[0].id, alt_text, caption]
          );
        }
      }

      return id;
    });

    return NextResponse.json({
      success: true,
      media_id: mediaId,
      url: publicPath,
      mime_type: file.type,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload?media_id=xx
 * ⚠️ Dosya + DB birlikte silinir
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get("media_id");

    if (!mediaId) {
      return NextResponse.json(
        { error: "media_id is required" },
        { status: 400 }
      );
    }

    const rows = await query(
      `SELECT file_path FROM media WHERE id = ? LIMIT 1`,
      [mediaId]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const filePath = join(process.cwd(), "public", rows[0].file_path);

    // FK varsa bu DELETE zaten fail olur
    await query(`DELETE FROM media WHERE id = ?`, [mediaId]);

    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Media is in use or cannot be deleted" },
      { status: 409 }
    );
  }
}

/* ---------------- helpers ---------------- */

function cryptoRandom() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
