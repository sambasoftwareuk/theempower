import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET /api/media?scope=xxx
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") || "gallery";
    const id = searchParams.get("id");

    if (id) {
      // Get single media by ID
      const media = await prisma.media.findUnique({
        where: { id },
      });

      if (!media) {
        return NextResponse.json({ error: "Media not found" }, { status: 404 });
      }

      return NextResponse.json({ media });
    }

    // Get all media (scope filtering can be added later via ContentMedia)
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      items: media.map((item) => ({
        id: item.id,
        url: item.path,
        path: item.path,
        alt_text: item.alt,
        alt: item.alt,
        filename: item.filename,
      })),
    });
  } catch (error) {
    console.error("Media GET error:", error);
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
    console.log("Media POST request body:", body);
    const { url, alt_text, mime_type } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Check if prisma is available
    if (!prisma) {
      throw new Error("Prisma client not initialized");
    }

    // Duplicate kontrolü: Aynı URL'e sahip media var mı?
    const existing = await prisma.media.findFirst({
      where: { path: url },
    });

    if (existing) {
      console.log("Media already exists, returning existing:", existing.id);
      // Mevcut kaydı döndür
      return NextResponse.json({
        message: "media already exists",
        media: {
          id: existing.id,
          path: existing.path,
          alt: existing.alt,
        },
        id: existing.id,
      });
    }

    // Yeni kayıt oluştur
    const fileName = url.split("/").pop();
    const originalFileName = fileName;

    console.log("Creating new media record:", {
      filename: fileName,
      originalFilename: originalFileName,
      mimeType: mime_type || "image/jpeg",
      path: url,
      alt: alt_text || fileName,
    });

    const media = await prisma.media.create({
      data: {
        filename: fileName,
        originalFilename: originalFileName,
        mimeType: mime_type || "image/jpeg",
        size: 0,
        path: url,
        alt: alt_text || fileName,
      },
    });

    console.log("Media created successfully:", media.id);

    return NextResponse.json({
      message: "media created",
      media: {
        id: media.id,
        path: media.path,
        alt: media.alt,
      },
      id: media.id,
    });
  } catch (error) {
    console.error("Media POST error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
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

    // Media kaydını bul (dosya yolu için)
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Database'den sil
    await prisma.media.delete({
      where: { id },
    });

    // Fiziksel dosyayı sil
    if (media.path && media.path.startsWith("/uploads/")) {
      try {
        const { unlink } = await import("fs/promises");
        const { join } = await import("path");
        const filePath = join(process.cwd(), "public", media.path);
        const { existsSync } = await import("fs");
        if (existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (fileError) {
        console.error("Dosya silinemedi:", fileError);
        // Dosya silme hatası olsa bile database silindi, devam et
      }
    }

    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    console.error("Media DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete media", message: error.message },
      { status: 500 }
    );
  }
}
