import "server-only";
import { NextResponse } from "next/server";
import { query, tx } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * GET /api/content/[contentId]/comments
 * Onaylanmış yorumları döndürür. Auth gerekmez.
 */
export async function GET(request, { params }) {
  try {
    const { contentId } = await params;

    if (!contentId) {
      return NextResponse.json(
        { error: "contentId is required" },
        { status: 400 }
      );
    }

    const rows = await query(
      `
      SELECT
        cc.id,
        cc.body_text AS bodyText,
        cc.created_at AS createdAt,
        u.display_name AS displayName,
        u.avatar_url AS avatarUrl
      FROM content_comments cc
      JOIN users u ON u.id = cc.user_id
      WHERE cc.content_id = ?
        AND cc.status = 'approved'
      ORDER BY cc.created_at ASC
      `,
      [contentId]
    );

    const comments = rows.map((r) => ({
      id: r.id,
      displayName: r.displayName || "Anonymous",
      avatarUrl: r.avatarUrl || "",
      createdAt: formatDate(r.createdAt),
      bodyText: r.bodyText || "",
    }));

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("GET /api/content/[contentId]/comments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

  /**
 * POST /api/content/[contentId]/comments
 * Yeni yorum ekler. Auth gerekli. Status: pending (admin onayı bekler).
 * Body: { bodyText: string }
 */
export async function POST(request, { params }) {
    try {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      const user = await currentUser();
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
      }
  
      const { contentId } = await params;
      if (!contentId) {
        return NextResponse.json(
          { error: "contentId is required" },
          { status: 400 }
        );
      }
  
      const body = await request.json();
      const bodyText = body?.bodyText?.trim?.();
  
      if (!bodyText) {
        return NextResponse.json(
          { error: "bodyText is required and cannot be empty" },
          { status: 400 }
        );
      }
  
      const email =
        user.emailAddresses?.[0]?.emailAddress ?? user.primaryEmailAddressId ?? "";
      const displayName =
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        email ||
        "User";
      const avatarUrl = user.imageUrl || "";
  
      const result = await tx(async (conn) => {
        const [userRows] = await conn.query(
            "SELECT id FROM users WHERE clerk_user_id = ? LIMIT 1",
            [userId]
          );
        
        let dbUserId;
        
        if (userRows && userRows.length > 0) {
            dbUserId = userRows[0].id;
        } else {
            const [insertResult] = await conn.query(
                `INSERT INTO users (clerk_user_id, email, display_name, avatar_url)
             VALUES (?, ?, ?, ?)`,
            [userId, email, displayName, avatarUrl || null]
          );
          dbUserId = insertResult.insertId;
        }
  
        await conn.query(
          `INSERT INTO content_comments (content_id, user_id, body_text, status)
           VALUES (?, ?, ?, 'pending')`,
           [contentId, dbUserId, bodyText]
        );
  
        return { success: true };
      });
  
      return NextResponse.json({ success: true, message: "Comment submitted. Awaiting approval." });
    } catch (error) {
      console.error("POST /api/content/[contentId]/comments error:", error);
      return NextResponse.json(
        { error: "Failed to submit comment" },
        { status: 500 }
      );
    }
  }