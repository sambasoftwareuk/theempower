import { auth, clerkClient } from "@clerk/nextjs/server";
import { query } from "@/lib/db";
import { isAdmin } from "@/lib/roleUtils";
import { NextResponse } from "next/server";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const client = await clerkClient();
    const membershipsResponse = await client.users.getOrganizationMembershipList({ userId });
    const memberships = membershipsResponse?.data;
    const empower = memberships?.find(
      (m) =>
        m.organization?.name === "theempower" ||
        m.organization?.slug?.startsWith("theempower")
    );
    const role = empower?.role ?? null;
    if (!isAdmin(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get("content_id");
    if (!contentId) {
      return NextResponse.json(
        { error: "content_id is required" },
        { status: 400 }
      );
    }

    const rows = await query(
      `SELECT cc.id, cc.body_text AS bodyText, cc.created_at AS createdAt,
        u.display_name AS displayName, u.avatar_url AS avatarUrl
       FROM content_comments cc
       JOIN users u ON u.id = cc.user_id
       WHERE cc.status = 'pending' AND cc.content_id = ?
       ORDER BY cc.created_at ASC`,
      [contentId]
    );

    const comments = rows.map((r) => ({
      id: r.id,
      bodyText: r.bodyText || "",
      createdAt: formatDate(r.createdAt),
      displayName: r.displayName || "Anonymous",
      avatarUrl: r.avatarUrl || "",
    }));

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("GET /api/admin/comments/pending-by-content error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending comments" },
      { status: 500 }
    );
  }
}