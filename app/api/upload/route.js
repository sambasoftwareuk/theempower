import { NextResponse } from "next/server";
import { writeFile, mkdir, readdir, readFile, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { createHash } from "crypto";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image");

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Dosya tipini kontrol et
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are accepted" },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size cannot exceed 5MB" },
        { status: 400 }
      );
    }

    // Uploads klasörünü oluştur
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Dosya içeriğini oku
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya hash'i oluştur (duplicate kontrolü için)
    const fileHash = createHash("md5").update(buffer).digest("hex");
    const fileExtension = file.name.split(".").pop();

    // Mevcut dosyaları kontrol et
    const existingFiles = await readdir(uploadsDir).catch(() => []);

    // Aynı hash'e sahip dosya var mı kontrol et
    for (const existingFile of existingFiles) {
      try {
        const existingFilePath = join(uploadsDir, existingFile);
        const existingBuffer = await readFile(existingFilePath);
        const existingHash = createHash("md5")
          .update(existingBuffer)
          .digest("hex");

        if (existingHash === fileHash) {
          const imageUrl = `/uploads/${existingFile}`;
          return NextResponse.json({
            success: true,
            url: imageUrl,
            fileName: existingFile,
            cached: true,
            mime_type: file.type,
          });
        }
      } catch (e) {
        // Dosya okunamazsa devam et
        continue;
      }
    }

    // Sıralı numaralandırma için sayaç bul
    const theempowerImageFiles = existingFiles.filter((f) =>
      f.startsWith("theempowerImage")
    );
    const counter = theempowerImageFiles.length + 1;

    const fileName = `theempowerImage${counter
      .toString()
      .padStart(3, "0")}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Dosyayı kaydet
    await writeFile(filePath, buffer);

    // URL'i döndür
    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      fileName: fileName,
      mime_type: file.type,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error uploading image", message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("file");

    if (!fileName) {
      return NextResponse.json(
        { error: "File name is required" },
        { status: 400 }
      );
    }

    // Güvenlik: Sadece theempowerImage ile başlayan dosyalar silinebilir
    if (!fileName.startsWith("theempowerImage")) {
      return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
    }

    const uploadsDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadsDir, fileName);

    // Dosya var mı kontrol et
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Dosyayı sil
    await unlink(filePath);

    return NextResponse.json({
      success: true,
      message: `File ${fileName} deleted successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting file", message: error.message },
      { status: 500 }
    );
  }
}
