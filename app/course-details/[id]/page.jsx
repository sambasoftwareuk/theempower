import CourseDetailClient from "./CourseDetailClient";
import courseDetailsData from "../../mocks/courseDetails.json";

export default async function CourseDetailPage({ params }) {
  const { id } = await params;
  const courseId = id;

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
    if (courseData) {
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
        <p className="text-2xl text-secondary">Course not found</p>
      </div>
    );
  }

  return (
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
  );
}
