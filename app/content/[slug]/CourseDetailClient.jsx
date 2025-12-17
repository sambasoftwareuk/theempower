"use client";

import { Header2 } from "../../_atoms/Headers";
import { PrimaryButton } from "../../_atoms/buttons";
import { Breadcrumb } from "../../_atoms/breadcrumb";
import { PageEditProvider, usePageEdit } from "../../context/PageEditProvider";
import DraftHeroImage from "../../_molecules/DraftHeroImage";
import TitleEditor from "../../_molecules/TitleEditor";
import SubtitleEditor from "../../_molecules/SubtitleEditor";
import SaveAllButton from "../../_molecules/SaveAllButton";

function CourseDetailContent({
  initialTitle,
  initialSubtitle,
  initialBody,
  initialHeroUrl,
  initialHeroAlt,
}) {
  const { title } = usePageEdit();
  const displayTitle = title || initialTitle;

  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: displayTitle, href: "#" }]} />

      <section className="bg-secondary text-white h-[33vh] flex items-center px-6 relative">
        <div className="w-3/6 m-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <TitleEditor initialTitle={initialTitle} />
              <SubtitleEditor initialSubtitle={initialSubtitle} />
            </div>

            <DraftHeroImage
              initialUrl={initialHeroUrl || "/generic-image.png"}
              initialAlt={initialHeroAlt || initialTitle}
              width={640}
              height={320}
              className="rounded-lg object-cover w-full aspect-[2/1]"
            />
          </div>
        </div>
        <div className="absolute bottom-4 left-1/4">
          <SaveAllButton />
        </div>
      </section>

      <section className="py-8 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <Header2 className="text-primary mb-6">Course Details</Header2>
                <p className="text-secondary400 leading-relaxed">
                  {initialBody}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CourseDetailClient({
  courseId,
  initialTitle,
  initialSubtitle,
  initialBody,
  initialHeroUrl,
  initialHeroAlt,
  initialHeroMediaId,
  locale = "en",
}) {
  return (
    <PageEditProvider
      initialHeroUrl={initialHeroUrl}
      initialHeroAlt={initialHeroAlt}
      initialHeroMediaId={initialHeroMediaId}
      initialTitle={initialTitle}
      initialSubtitle={initialSubtitle}
      pageId={courseId}
      locale={locale}
      pageSlug={courseId}
    >
      <CourseDetailContent
        initialTitle={initialTitle}
        initialSubtitle={initialSubtitle}
        initialBody={initialBody}
        initialHeroUrl={initialHeroUrl}
        initialHeroAlt={initialHeroAlt}
      />
    </PageEditProvider>
  );
}
