import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import courseDetailsData from "../../../mocks/courseDetails.json";
import potentialsData from "../../../mocks/potentials.json";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, subtitle, heroMediaId, bodyHtml } = body;

    let updated = false;

    // courseDetails.json'ı güncelle
    if (courseDetailsData[id]) {
      if (title !== undefined) {
        courseDetailsData[id].title = title;
        if (courseDetailsData[id].hero) {
          courseDetailsData[id].hero.title = title;
        }
      }
      if (subtitle !== undefined) {
        courseDetailsData[id].subtitle = subtitle;
        if (courseDetailsData[id].hero) {
          courseDetailsData[id].hero.description = subtitle;
        }
      }
      if (heroMediaId !== undefined && heroMediaId !== null) {
        // heroMediaId varsa, media'dan URL'i al ve image'i güncelle
        // Şimdilik sadece mock data'da image field'ı var, heroMediaId'yi saklamıyoruz
        // İleride gerekirse eklenebilir
        // TODO: heroMediaId'den media path'ini al ve courseDetailsData[id].image'i güncelle
      }
      if (bodyHtml !== undefined) {
        courseDetailsData[id].bodyHtml = bodyHtml;
      }

      // Dosyaya kaydet
      const courseDetailsPath = path.join(
        process.cwd(),
        "app/mocks/courseDetails.json"
      );
      fs.writeFileSync(
        courseDetailsPath,
        JSON.stringify(courseDetailsData, null, 2),
        "utf8"
      );
      updated = true;
    }

    // potentials.json'ı güncelle (title ve subtitle için)
    const potentialItem = potentialsData.find((item) => item.slug === id);
    if (potentialItem) {
      if (title !== undefined) {
        potentialItem.title = title;
        if (!potentialItem.hero) {
          potentialItem.hero = { title: "", description: "" };
        }
        potentialItem.hero.title = title;
      }
      if (subtitle !== undefined) {
        potentialItem.subtitle = subtitle;
        if (!potentialItem.hero) {
          potentialItem.hero = {
            title: potentialItem.title || "",
            description: "",
          };
        }
        potentialItem.hero.description = subtitle;
      }

      // Dosyaya kaydet
      const potentialsPath = path.join(
        process.cwd(),
        "app/mocks/potentials.json"
      );
      fs.writeFileSync(
        potentialsPath,
        JSON.stringify(potentialsData, null, 2),
        "utf8"
      );
      updated = true;
    }

    if (updated) {
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
