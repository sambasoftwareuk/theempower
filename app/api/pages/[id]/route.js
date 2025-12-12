import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import courseDetailsData from "../../../mocks/courseDetails.json";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, subtitle, heroMediaId } = body;

    // Mock data'yı güncelle
    if (courseDetailsData[id]) {
      if (title !== undefined) {
        courseDetailsData[id].title = title;
        courseDetailsData[id].hero.title = title;
      }
      if (subtitle !== undefined) {
        courseDetailsData[id].subtitle = subtitle;
        courseDetailsData[id].hero.description = subtitle;
      }
      if (heroMediaId !== undefined && heroMediaId !== null) {
        // heroMediaId varsa, media'dan URL'i al ve image'i güncelle
        // Şimdilik sadece mock data'da image field'ı var, heroMediaId'yi saklamıyoruz
        // İleride gerekirse eklenebilir
        // TODO: heroMediaId'den media path'ini al ve courseDetailsData[id].image'i güncelle
      }

      // Dosyaya kaydet
      const filePath = path.join(process.cwd(), "app/mocks/courseDetails.json");
      fs.writeFileSync(
        filePath,
        JSON.stringify(courseDetailsData, null, 2),
        "utf8"
      );

      return NextResponse.json({
        success: true,
        message: "Mock data updated",
      });
    } else {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Save failed" },
      { status: 500 }
    );
  }
}
