import { auth, clerkClient } from "@clerk/nextjs/server";
import { query } from "@/lib/db";
import { isAdmin } from "@/lib/roleUtils";
import { NextResponse } from "next/server";

export async function GET() {
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
      m.organization?.slug?.startsWith("theempower"),
  );
  const role = empower?.role ?? null;
  if (!isAdmin(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const rows = await query(
    `SELECT cc.id, cc.body_text AS bodyText, cc.created_at AS createdAt, u.display_name AS displayName, u.avatar_url AS avatarUrl, cl.title AS contentTitle
    FROM content_comments cc
    JOIN users u ON u.id = cc.user_id
    JOIN content_locales cl ON cl.content_id = cc.content_id
    JOIN locales l ON l.id = cl.locale_id AND l.code = 'en'
    WHERE cc.status = 'pending'
    ORDER BY cc.created_at ASC
    `,
  );
  const comments = rows.map((r) => ({
    id: r.id,
    bodyText: r.bodyText || "",
    createdAt: formatDate(r.createdAt),
    displayName: r.displayName || "Anonymous",
    contentTitle: r.contentTitle || "",
  }));
  return NextResponse.json({ comments });
} catch (error) {
  console.error("GET /api/admin/comments/pending error:", error);
  return NextResponse.json({ error: "Failed to fetch pending comments" }, { status: 500 });
}
}
function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
