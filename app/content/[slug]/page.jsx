import { Header1, Header2 } from "../../_atoms/Headers";
import { PrimaryButton } from "../../_atoms/buttons";
import { Breadcrumb } from "../../_atoms/breadcrumb";
import { notFound } from 'next/navigation';
import Image from "next/image";
import CourseDetailClient from "./CourseDetailClient";
import courseDetailsData from "../../mocks/courseDetails.json";
import galleryImages from "../../mocks/nhsPhoto.json";
import Image from "next/image";
import PhotoSlider from "@/app/_molecules/PhotoSlider";
import courseDetailsData from "../../mocks/courseDetails.json";
import { getContentBySlug } from '@/lib/queries';

import GalleryComponent from "@/app/_components/GalleryComponent";

export default async async function Content({ params }) {
  const {slug} = await params;
  const courseId = params?.slug;

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
  const content = await getContentBySlug(params?.slug, 'en');
  console.log("C:", content);
      if (content) {
      initialTitle = courseData.hero.title;
      initialSubtitle = courseData.hero.description;
      initialHeroUrl = courseData.image;
      initialHeroAlt = courseData.hero.title;
      initialBody = `${
        courseData.leftColumn.title
      }: ${courseData.leftColumn.items.join(", ")}`;
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
}

