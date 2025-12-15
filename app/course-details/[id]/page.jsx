import courseDetailsData from "../../mocks/courseDetails.json";
import { Breadcrumb } from "../../_atoms/breadcrumb";
import CourseDetailClient from "./CourseDetailClient";

export default async function CourseDetailPage({ params }) {
  const { id: courseId } = await params;
  const courseData = courseDetailsData[courseId];

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-secondary">Course not found</p>
      </div>
    );
  }

  const allCourses = Object.values(courseDetailsData);

  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: courseData.title, href: "#" }]} />
      <CourseDetailClient courseData={courseData} allCourses={allCourses} />
    </div>
  );
}
