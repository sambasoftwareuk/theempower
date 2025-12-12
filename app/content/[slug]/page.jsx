import { notFound } from 'next/navigation';
import CourseDetailClient from "./CourseDetailClient";
import courseDetailsData from "../../mocks/courseDetails.json";
import galleryImages from "../../mocks/nhsPhoto.json";
import PhotoSlider from "@/app/_molecules/PhotoSlider";
import { getContentBySlug } from '@/lib/queries';

import GalleryComponent from "@/app/_components/GalleryComponent";

export default async function Content({ params }) {

  const { slug } = await params;
  const courseId = slug; // Assuming slug corresponds to courseId for mock data

  // TODO: Get from database
  let initialTitle = "";
  let initialSubtitle = "";
  let initialBody = "";
  let initialHeroUrl = "";
  let initialHeroAlt = "";
  let initialHeroMediaId = null;

  // Use mock data for now
  if (!initialTitle) {
    const courseData = courseDetailsData[courseId];
  const content = await getContentBySlug(slug, 'en');
  console.log("C:", content);
      if (content) {
      initialTitle = content?.title;
      initialSubtitle = content?.excerpt;
      initialHeroUrl = content?.hero.file_path;
      initialHeroAlt = content?.hero.alt_text;
      initialBody = content?.body_richtext;
    }
  }

  if (!initialTitle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-secondary">
          {notFound()}
        </p>
      </div>
    );
  }

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
          data={Object.values(courseDetailsData).filter(
            (course) => course.id !== courseId
          )}
        />
</div>
  );
};

