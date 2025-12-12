import { Header1, Header2 } from "../../_atoms/Headers";
import { PrimaryButton } from "../../_atoms/buttons";
import { Breadcrumb } from "../../_atoms/breadcrumb";
import { notFound } from 'next/navigation';
import Image from "next/image";
import PhotoSlider from "@/app/_molecules/PhotoSlider";
import courseDetailsData from "../../mocks/courseDetails.json";
import { getContentBySlug } from '@/lib/queries';


export default async function Content({ params }) {
  const courseId = params?.slug;
  const courseData = courseDetailsData[courseId];
  const content = await getContentBySlug(params?.slug, 'en');
  console.log("C:", content);
  
  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-secondary">
          {notFound()}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: content?.title, href: "#" }]} />

      <section className="bg-secondary text-white h-[33vh] flex items-center px-6">
        <div className="w-3/6 m-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Header1 className="text-white mb-4">
                {content?.title}
              </Header1>
              <p className="text-base md:text-lg lg:text-xl">
                {content?.excerpt}
              </p>
            </div>

            <div className="relative w-2/3 aspect-[2/1] rounded-lg overflow-hidden">
              <Image
                src={content?.hero?.file_path}
                alt={content?.hero?.alt_text}
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
            <div className="grid grid-cols-1 gap-8 md:gap-12">
              <div>
                {content?.body_richtext}
              </div>
            </div>
          </div>
        </div>
        <PhotoSlider
          title="Other Courses"
          data={Object.values(courseDetailsData).filter(
            (id) => id !== courseId
          )}
        />
      </section>
    </div>
  );
}
