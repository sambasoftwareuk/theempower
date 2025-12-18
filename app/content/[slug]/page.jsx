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

  const content = await getContentBySlug(slug, "en");

  if (!content) {
    notFound();
  }

  const {
    title: initialTitle,
    excerpt: initialSubtitle,
    body_richtext: initialBody,
    hero,
  } = content;

  const initialHeroUrl = hero?.file_path ?? "";
  const initialHeroAlt = hero?.alt_text ?? "";
  const initialHeroMediaId = hero?.media_id ?? null;

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

      <GalleryComponent
        title="Health & Care"
        images={galleryImages.gallery}
      />

      <PhotoSlider
        title="Other Courses"
        data={otherCourses}
      />
    </div>
  );
}
