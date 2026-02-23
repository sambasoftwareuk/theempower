import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { isAdmin } from "@/lib/roleUtils";

export async function POST(request) {
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
  const body = await request.json();
  const commentId = body?.commentId;
  if (!commentId) {
    return NextResponse.json({ error: "commentId is required" }, { status: 400 });
  }
  const result = await query("UPDATE content_comments SET status = 'approved' WHERE id = ? AND status = 'pending'", [commentId]);
    return NextResponse.json({ success: true });
 }