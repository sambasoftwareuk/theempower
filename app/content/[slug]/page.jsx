import { notFound } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";
import PhotoSlider from "@/app/_molecules/PhotoSlider";
import GalleryComponent from "@/app/_components/GalleryComponent";

import { getContentBySlug } from "@/lib/queries";

export default async function Content({ params }) {
  const { slug } = await params;

  console.log(params);
  
  const locale = "en";

  // ✅ Tek source of truth
  const content = await getContentBySlug(slug, locale);

  if (!content) {
    notFound();
  }

  // DB → UI mapping
  const initialTitle = content.title;
  const initialSubtitle = content.excerpt || "";
  const initialBody = content.body_richtext || "";

  const initialHeroUrl = content.hero?.file_path || "";
  const initialHeroAlt = content.hero?.alt_text || content.title || "";
  const initialHeroMediaId = content.hero?.media_id || null;

  return (
    <div>
      <CourseDetailClient
        courseId={content.id}              // ✅ gerçek ID
        initialTitle={initialTitle}
        initialSubtitle={initialSubtitle}
        initialBody={initialBody}
        initialHeroUrl={initialHeroUrl}
        initialHeroAlt={initialHeroAlt}
        initialHeroMediaId={initialHeroMediaId}
        locale={locale}
        slug={slug}
      />

      {/* 
        ⚠️ Gallery henüz DB’ye taşınmadıysa:
        - ya kaldır
        - ya da geçici static bırak
      */}
      <GalleryComponent title="Health & Care" />

      {/* ✅ Related content DB’den geliyor */}
      {content.related?.length > 0 && (
        <PhotoSlider
          title="Other Courses"
          data={content.related}
        />
      )}
    </div>
  );
}
