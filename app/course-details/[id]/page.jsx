import CourseDetailClient from "./CourseDetailClient";
import courseDetailsData from "../../mocks/courseDetails.json";
import prisma from "../../../lib/prisma";

export default async function CourseDetailPage({ params }) {
  const { id } = await params;
  const courseId = id;

  // Try to get from database first, fallback to mock data
  let initialTitle = "";
  let initialSubtitle = "";
  let initialBody = "";
  let initialHeroUrl = "";
  let initialHeroAlt = "";
  let initialHeroMediaId = null;

  try {
    const content = await prisma.content.findUnique({
      where: { slug: courseId },
      include: {
        translations: {
          where: { language: "en" },
          take: 1,
        },
        heroMedia: true,
      },
    });

    if (content) {
      const translation = content.translations[0];
      initialTitle = translation?.title || "";
      initialSubtitle = translation?.subtitle || "";
      initialBody = translation?.body || "";
      initialHeroUrl = content.heroMedia?.path || "";
      initialHeroAlt = content.heroMedia?.alt || "";
      initialHeroMediaId = content.heroMediaId;
    }
  } 
  catch (error) {
    // Database connection error - silently fallback to mock data
    if (process.env.NODE_ENV === "development") {
      console.log("Database not available, using mock data");
    }
  }

  // Fallback to mock data
  if (!initialTitle) {
    const courseData = courseDetailsData[courseId];
    if (courseData) {
      initialTitle = courseData.hero.title;
      initialSubtitle = courseData.hero.description;
      initialHeroUrl = courseData.image;
      initialHeroAlt = courseData.hero.title;
      initialBody = `${courseData.leftColumn.title}: ${courseData.leftColumn.items.join(", ")}`;
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
