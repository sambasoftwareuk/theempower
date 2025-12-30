import { notFound } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";
import courseDetailsData from "../../mocks/courseDetails.json";
import galleryImages from "../../mocks/nhsPhoto.json";
import PhotoSlider from "@/app/_molecules/PhotoSlider";
import GalleryComponent from "@/app/_components/GalleryComponent";

import { getContentBySlug } from "@/lib/queries";

export default async function Content({ params }) {
  const { slug } = await params;
  const courseId = slug;

  // First, search in potentialsData array (for top section: title, subtitle, image, hero)
  const content = await getContentBySlug(slug, "en");
  
  if (!content) {
    notFound();
  }

  // Then, search in courseDetailsData (for bottom section: bodyHtml, leftColumn, rightColumn)
  // const detailedData = courseDetailsData[slug];

  // Combine data: top from potentials, bottom from courseDetails
  const courseData = {
    id: content?.id,
    // Top section from potentials.json
    title: content?.title,
    subtitle: content?.excerpt || "",
    image: content?.hero?.file_path,
    hero: content?.hero || {
      title: content?.title,
      description: content?.title,
    },
    bodyHtml: content?.body_richtext || "",
  };

  const initialTitle = courseData.title;
  const initialSubtitle = courseData.subtitle || "";
  const initialBody = courseData.bodyHtml || "";
  const initialHeroUrl = courseData.hero?.file_path || "";
  const initialHeroAlt = courseData.hero?.title || "";
  const initialHeroMediaId = null;

  //burada diğer courseları çağıralım
  const otherCourses = Object.values(courseDetailsData).filter(
    (course) => course.id !== courseId
  );

  return (
    <div>
      <CourseDetailClient
        courseId={courseId}
        initialTitle={initialTitle}
        initialSubtitle={initialSubtitle}
        initialBody={initialBody}
        initialHeroUrl={initialHeroUrl}
        initialHeroAlt={initialHeroAlt}
        initialHeroMediaId={initialHeroMediaId}
        locale="en"
      />

      <GalleryComponent title="Health & Care" images={galleryImages.gallery} />

      <PhotoSlider title="Other Courses" data={content?.related} />
    </div>
  );
}
