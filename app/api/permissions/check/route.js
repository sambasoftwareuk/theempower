import "server-only";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkGroupPermission } from "@/lib/permissions";
import { query } from "@/lib/db";

/**
 * GET /api/permissions/check?slug=nhs-gp-registration&locale=en
 * GET /api/permissions/check?content_id=62
 *
 * Response:
 * {
 *   hasPermission: true/false,
 *   contentGroupId: 40
 * }
 */
export async function GET(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { hasPermission: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get("content_id");
    const slug = searchParams.get("slug");
    const locale = searchParams.get("locale") || "en";

    let finalContentId = null;
    let contentGroupId = null;

    // Eğer content_id direkt verilmişse kullan
    if (contentId) {
      finalContentId = parseInt(contentId, 10);
    } 
    // Eğer slug verilmişse, slug'dan content_id bul
    else if (slug) {
      const rows = await query(
        `
        SELECT c.id AS content_id
        FROM content_locales cl
        JOIN contents c ON c.id = cl.content_id
        JOIN locales l ON l.id = cl.locale_id
        WHERE cl.slug = ?
          AND l.code = ?
        LIMIT 1
        `,
        [slug, locale]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { hasPermission: false, error: "Content not found" },
          { status: 404 }
        );
      }

      finalContentId = rows[0].content_id;
    } else {
      return NextResponse.json(
        { hasPermission: false, error: "content_id or slug is required" },
        { status: 400 }
      );
    }

    // Content'in hangi group'a ait olduğunu bul
    const groupRows = await query(
      `
      SELECT content_group_id
      FROM content_group_items
      WHERE content_id = ?
      ORDER BY sort_order ASC
      LIMIT 1
      `,
      [finalContentId]
    );

    if (groupRows.length === 0) {
      return NextResponse.json(
        { hasPermission: false, error: "Content is not in any group" },
        { status: 400 }
      );
    }

    contentGroupId = groupRows[0].content_group_id;

    // Yetki kontrolü
    const hasPermission = await checkGroupPermission(userId, contentGroupId);

    return NextResponse.json({
      hasPermission,
      contentGroupId,
      contentId: finalContentId,
    });
  } catch (error) {
    console.error("GET /api/permissions/check error:", error);
    return NextResponse.json(
      { hasPermission: false, error: "Failed to check permissions" },
      { status: 500 }
    );
  }
}