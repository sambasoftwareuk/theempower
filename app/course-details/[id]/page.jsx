import { Header1, Header2 } from "../../_atoms/Headers";
import { PrimaryButton } from "../../_atoms/buttons";
import courseDetailsData from "../../mocks/courseDetails.json";
import Image from "next/image";
import { Breadcrumb } from "../../_atoms/breadcrumb";

export default function CourseDetailPage({ params }) {
  const courseId = params.id;
  const courseData = courseDetailsData[courseId];

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-secondary">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: courseData.title, href: "#" }]} />

      <section className="bg-secondary text-white h-[33vh] flex items-center px-6">
        <div className="w-3/6 m-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Header1 className="text-white mb-4">
                {courseData.hero.title}
              </Header1>
              <p className="text-base md:text-lg lg:text-xl">
                {courseData.hero.description}
              </p>
            </div>

            <div className="relative w-2/3 aspect-[2/1] rounded-lg overflow-hidden">
              <Image
                src={courseData.image}
                alt={courseData.hero.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <Header2 className="text-primary mb-6">
                  {courseData.leftColumn.title}
                </Header2>
                <ul className="space-y-3">
                  {courseData.leftColumn.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary900 mr-3 mt-1 flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-secondary400 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Header2 className="text-primary mb-6">
                  {courseData.rightColumn.title}
                </Header2>
                <ul className="space-y-3">
                  {courseData.rightColumn.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary900 mr-3 mt-1 flex-shrink-0">
                        •
                      </span>
                      <span className="text-secondary400 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 text-center border-t border-gray-200 pt-8">
              <PrimaryButton label="Enroll Now" className="px-8 py-3 text-lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
