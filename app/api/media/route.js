import { NextResponse } from "next/server";

// GET /api/media?scope=xxx
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") || "gallery";
    const id = searchParams.get("id");

    // TODO: Implement database connection
    return NextResponse.json({ error: "Not implemented" }, { status: 501 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch media", message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/media
export async function POST(request) {
  try {
    const body = await request.json();
    const { url, alt_text, mime_type } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // TODO: Implement database connection
    return NextResponse.json({ error: "Not implemented" }, { status: 501 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create media",
        message: error.message,
        code: error.code,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/media?id=xxx
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // TODO: Implement database connection
    return NextResponse.json({ error: "Not implemented" }, { status: 501 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete media", message: error.message },
      { status: 500 }
    );
  }
}
