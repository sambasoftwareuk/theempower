import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = "D:/coding/theempower_uploads_test";

export const runtime = "nodejs";

export async function GET(req, context) {
  try {
    const { path } = await context.params; 

    const filePath = join(UPLOAD_DIR, ...path);

    await stat(filePath);

    const stream = createReadStream(filePath);

    return new Response(stream);
  } catch (err) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}