import { NextResponse } from "next/server";
import { query, tx } from "@/lib/db";

/**
 * PATCH /api/pages/[id]
 *
 * Body:
 * {
 *   title?,
 *   slug?,
 *   seo_title?,
 *   seo_description?,
 *   heroMediaId?,
 *   locale?
 * }
 */
export async function PATCH(request, { params }) {
  try {
    const pageId = await params.id;
    const body = await request.json();

    const {
      title,
      slug,
      seo_title,
      seo_description,
      heroMediaId,
      locale = "en",
    } = body;

    let updated = false;

    await tx(async (conn) => {
      // 1️⃣ Page var mı?
      const [pages] = await conn.query(
        `SELECT id FROM pages WHERE id = ? LIMIT 1`,
        [pageId]
      );

      if (!pages.length) {
        throw new Error("NOT_FOUND");
      }

      // 2️⃣ Page hero media
      if (heroMediaId !== undefined) {
        await conn.query(
          `
          UPDATE pages
          SET hero_media_id = ?
          WHERE id = ?
          `,
          [heroMediaId, pageId]
        );
        updated = true;
      }

      // 3️⃣ Locale satırı var mı?
      const [locales] = await conn.query(
        `
        SELECT pl.id
        FROM page_locales pl
        JOIN locales l ON l.id = pl.locale_id
        WHERE pl.page_id = ?
          AND l.code = ?
        LIMIT 1
        `,
        [pageId, locale]
      );

      let pageLocaleId;

      if (locales.length) {
        pageLocaleId = locales[0].id;
      } else {
        // locale yoksa oluştur
        const [localeRows] = await conn.query(
          `SELECT id FROM locales WHERE code = ? LIMIT 1`,
          [locale]
        );

        if (!localeRows.length) {
          throw new Error("LOCALE_NOT_FOUND");
        }

        const [insert] = await conn.query(
          `
          INSERT INTO page_locales
            (page_id, locale_id, title, slug)
          VALUES (?, ?, '', '')
          `,
          [pageId, localeRows[0].id]
        );

        pageLocaleId = insert.insertId;
      }

      // 4️⃣ Locale alanlarını güncelle
      if (
        title !== undefined ||
        slug !== undefined ||
        seo_title !== undefined ||
        seo_description !== undefined
      ) {
        await conn.query(
          `
          UPDATE page_locales
          SET
            title = COALESCE(?, title),
            slug = COALESCE(?, slug),
            seo_title = COALESCE(?, seo_title),
            seo_description = COALESCE(?, seo_description)
          WHERE id = ?
          `,
          [
            title ?? null,
            slug ?? null,
            seo_title ?? null,
            seo_description ?? null,
            pageLocaleId,
          ]
        );
        updated = true;
      }
    });

    return NextResponse.json({
      success: true,
      updated,
    });
  } catch (error) {
    if (error.message === "NOT_FOUND") {
      return NextResponse.json(
        { error: "Page not found" },
        { status: 404 }
      );
    }

    if (error.message === "LOCALE_NOT_FOUND") {
      return NextResponse.json(
        { error: "Locale not found" },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Save failed" },
      { status: 500 }
    );
  }
}
