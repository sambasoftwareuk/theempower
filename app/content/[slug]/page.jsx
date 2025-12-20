import { notFound } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";

import courseDetailsData from "../../mocks/courseDetails.json";
import potentialsData from "../../mocks/potentials.json";
import galleryImages from "../../mocks/nhsPhoto.json";

import PhotoSlider from "@/app/_molecules/PhotoSlider";
import GalleryComponent from "@/app/_components/GalleryComponent";

export default async function Content({ params }) {
  const { slug } = await params;
  const courseId = slug;

  // First, search in potentialsData array (for top section: title, subtitle, image, hero)
  const potentialCourse = potentialsData.find((item) => item.slug === slug);

  if (!potentialCourse) {
    notFound();
  }

  // Then, search in courseDetailsData (for bottom section: bodyHtml, leftColumn, rightColumn)
  const detailedData = courseDetailsData[slug];

  // Combine data: top from potentials, bottom from courseDetails
  const courseData = {
    id: potentialCourse.slug,
    // Top section from potentials.json
    title: potentialCourse.title,
    subtitle: potentialCourse.subtitle || "",
    image: potentialCourse.image,
    hero: potentialCourse.hero || {
      title: potentialCourse.title,
      description: "",
    },
    // Bottom section from courseDetails.json (if exists)
    bodyHtml: detailedData?.bodyHtml || "",
    leftColumn: detailedData?.leftColumn,
    rightColumn: detailedData?.rightColumn,
  };

  const initialTitle = courseData.title;
  const initialSubtitle = courseData.subtitle || "";
  const initialBody = courseData.bodyHtml || "";
  const initialHeroUrl = courseData.image || "";
  const initialHeroAlt = courseData.hero?.title || "";
  const initialHeroMediaId = null;
  const leftColumn = courseData.leftColumn;
  const rightColumn = courseData.rightColumn;

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
        leftColumn={leftColumn}
        rightColumn={rightColumn}
        locale="en"
      />

      <GalleryComponent title="Health & Care" images={galleryImages.gallery} />

      <PhotoSlider title="Other Courses" data={otherCourses} />
    </div>
  );
}
