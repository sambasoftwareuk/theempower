import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MEDIA_FILE = path.join(process.cwd(), "app/mocks/mediaGallery.json");

// Helper: JSON dosyasını oku
function readMediaFile() {
  try {
    if (!fs.existsSync(MEDIA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(MEDIA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading media file:", error);
    return [];
  }
}

// Helper: JSON dosyasına yaz
function writeMediaFile(data) {
  try {
    fs.writeFileSync(MEDIA_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing media file:", error);
    return false;
  }
}

// Helper: ID oluştur
function createId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// GET /api/media?scope=xxx&id=xxx
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") || "gallery";
    const id = searchParams.get("id");

    console.log("GET /api/media - scope:", scope, "id:", id);

    const allMedia = readMediaFile();
    console.log("Total media items:", allMedia.length);

    // Eğer ID varsa, tek bir media döndür
    if (id) {
      const media = allMedia.find((item) => item.id === id);
      if (!media) {
        return NextResponse.json({ error: "Media not found" }, { status: 404 });
      }
      return NextResponse.json({ media });
    }

    // Scope'a göre filtrele
    const filtered = allMedia.filter(
      (item) => (item.scope || "gallery") === scope
    );

    console.log("Filtered items for scope", scope, ":", filtered.length);
    console.log("All scopes in file:", [...new Set(allMedia.map((item) => item.scope || "gallery"))]);

    return NextResponse.json({ items: filtered });
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
    const { url, alt_text, mime_type, scope = "gallery" } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    console.log("POST /api/media - scope:", scope, "url:", url);

    const allMedia = readMediaFile();

    // Yeni media oluştur
    const newMedia = {
      id: createId(scope),
      url,
      alt: alt_text || "Yeni görsel",
      alt_text: alt_text || null,
      mime_type: mime_type || null,
      scope: scope,
      createdAt: Date.now(),
    };

    // Başa ekle (en yeni önce)
    allMedia.unshift(newMedia);

    // Dosyaya yaz
    if (!writeMediaFile(allMedia)) {
      console.error("Failed to write media file");
      return NextResponse.json(
        { error: "Failed to save media" },
        { status: 500 }
      );
    }

    console.log("Media saved successfully. Total items:", allMedia.length);

    return NextResponse.json({
      media: {
        id: newMedia.id,
        url: newMedia.url,
        path: newMedia.url,
        alt_text: newMedia.alt_text,
        mime_type: newMedia.mime_type,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create media",
        message: error.message,
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

    const allMedia = readMediaFile();
    const beforeLength = allMedia.length;
    const filtered = allMedia.filter((item) => item.id !== id);

    if (filtered.length === beforeLength) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Dosyaya yaz
    if (!writeMediaFile(filtered)) {
      return NextResponse.json(
        { error: "Failed to delete media" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete media", message: error.message },
      { status: 500 }
    );
  }
}
