import "server-only";
import { NextResponse } from "next/server";
import { query, tx } from "@/lib/db";

/**
 * PATCH /api/content/by-slug/[slug]
 *
 * Body:
 * {
 *   locale: "en",
 *   title?: string,
 *   excerpt?: string,
 *   body_richtext?: string,
 *   hero_media_id?: number | null
 * }
 */
export async function PATCH(request, { params }) {
  const { slug } = await params;

  try {
    const body = await request.json();
    const {
      locale = "en",
      title,
      excerpt,
      body_richtext,
      hero_media_id,
    } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const result = await tx(async (conn) => {
      /**
       * 1) Content + locale satırını bul
       */
      const [rows] = await conn.query(
        `
        SELECT
          c.id AS content_id,
          cl.id AS content_locale_id
        FROM content_locales cl
        JOIN contents c ON c.id = cl.content_id
        JOIN locales l ON l.id = cl.locale_id
        WHERE cl.slug = ?
          AND l.code = ?
        LIMIT 1
        `,
        [slug, locale]
      );

      if (!rows.length) {
        throw new Error("CONTENT_NOT_FOUND");
      }

      const { content_id, content_locale_id } = rows[0];

      /**
       * 2) content_locales update (title / excerpt / body)
       */
      const localeFields = [];
      const localeValues = [];

      if (title !== undefined) {
        localeFields.push("title = ?");
        localeValues.push(title);
      }

      if (excerpt !== undefined) {
        localeFields.push("excerpt = ?");
        localeValues.push(excerpt);
      }

      if (body_richtext !== undefined) {
        localeFields.push("body_richtext = ?");
        localeValues.push(body_richtext);
      }

      if (localeFields.length > 0) {
        await conn.query(
          `
          UPDATE content_locales
          SET ${localeFields.join(", ")}
          WHERE id = ?
          `,
          [...localeValues, content_locale_id]
        );
      }

      /**
       * 3) contents.hero_media_id update
       */
      if (hero_media_id !== undefined) {
        await conn.query(
          `
          UPDATE contents
          SET hero_media_id = ?
          WHERE id = ?
          `,
          [hero_media_id, content_id]
        );
      }

      return { content_id };
    });

    return NextResponse.json({
      success: true,
      content_id: result.content_id,
    });
  } catch (error) {
    if (error.message === "CONTENT_NOT_FOUND") {
      return NextResponse.json(
        { error: "Content not found for given slug/locale" },
        { status: 404 }
      );
    }

    console.error("PATCH /content/by-slug error:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
