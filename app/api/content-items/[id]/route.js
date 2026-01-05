import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Subtitle id is required" },
        { status: 400 }
      );
    }

    // 1️⃣ content_locales sil
    await query(`DELETE FROM content_locales WHERE id = ?`, [id]);

    // ⚠️ Eğer foreign key varsa ve CASCADE yoksa:
    // await query(`DELETE FROM content_group_items WHERE content_id = (...)`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/content-items/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete subtitle" },
      { status: 500 }
    );
  }
}
