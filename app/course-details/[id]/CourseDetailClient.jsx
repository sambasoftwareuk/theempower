"use client";

import { Header1, Header2 } from "../../_atoms/Headers";
import { PrimaryButton } from "../../_atoms/buttons";
import PhotoSlider from "@/app/_molecules/PhotoSlider";
import { PageEditProvider, usePageEdit } from "../../context/PageEditProvider";
import BodyEditor from "../../_molecules/BodyEditor";
import BodySaveButton from "../../_molecules/BodySaveButton";
import HeroSaveButton from "../../_molecules/HeroSaveButton";
import TitleEditor from "../../_molecules/TitleEditor";
import SubtitleEditor from "../../_molecules/SubtitleEditor";
import DraftHeroImage from "../../_molecules/DraftHeroImage";
import { SignedIn } from "@clerk/nextjs";

function CourseContent({ courseData, allCourses }) {
  const { bodyHtml } = usePageEdit();
  const displayBodyHtml = bodyHtml || courseData.bodyHtml || "";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-secondary text-white h-[33vh] flex items-center px-6 relative">
        <div className="w-4/6 m-auto">
          <div className="flex items-center justify-around">
            <div className="w-2/6">
              <TitleEditor initialTitle={courseData.hero.title} />
              <SubtitleEditor initialSubtitle={courseData.hero.description} />
            </div>

            <DraftHeroImage
              initialUrl={courseData.image}
              initialAlt={courseData.hero.title}
              width={640}
              height={320}
              className="rounded-lg object-cover w-full aspect-[2/1]"
            />
          </div>
        </div>
        <div className="absolute bottom-4 left-1/4">
          <HeroSaveButton />
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-8 px-6 bg-gray-50">
        <div className="w-3/5 mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 md:p-12">
            {/* Body Content with Editor */}
            <div className="relative">
              <div className="flex items-start gap-2">
                {displayBodyHtml &&
                typeof displayBodyHtml === "object" &&
                displayBodyHtml.leftColumn ? (
                  // Object yapısı (leftColumn + rightColumn) - İki sütun grid
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 flex-1">
                    <div>
                      <Header2 className="text-primary mb-6">
                        {displayBodyHtml.leftColumn.title}
                      </Header2>
                      <ul className="space-y-3">
                        {displayBodyHtml.leftColumn.items.map((item, index) => (
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
                        {displayBodyHtml.rightColumn.title}
                      </Header2>
                      <ul className="space-y-3">
                        {displayBodyHtml.rightColumn.items.map(
                          (item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary900 mr-3 mt-1 flex-shrink-0">
                                •
                              </span>
                              <span className="text-secondary400 leading-relaxed">
                                {item}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                ) : typeof displayBodyHtml === "string" ? (
                  // HTML string yapısı (Tiptap'ten gelen)
                  <div
                    className="body-html-content flex-1"
                    dangerouslySetInnerHTML={{ __html: displayBodyHtml }}
                  />
                ) : (
                  // Fallback
                  <p className="flex-1 text-gray-500">
                    İçerik henüz eklenmedi. Düzenlemek için edit butonuna
                    tıklayın.
                  </p>
                )}
                <SignedIn>
                  <BodyEditor className="sticky top-4" />
                </SignedIn>
              </div>
            </div>

            {/* Save All Button (Body değişikliklerini kaydet) */}
            <div className="mt-12 text-center border-t border-gray-200 pt-8">
              <BodySaveButton />
            </div>
          </div>
        </div>

        <PhotoSlider
          title="Other Courses"
          data={allCourses.filter((c) => c.id !== courseData.id)}
        />
      </section>
    </div>
  );
}

export default function CourseDetailClient({ courseData, allCourses }) {
  // bodyHtml yoksa leftColumn ve rightColumn'dan oluştur
  const getInitialBodyHtml = () => {
    if (courseData.bodyHtml) {
      return courseData.bodyHtml;
    }
    // Eğer leftColumn ve rightColumn varsa, object olarak döndür
    // BodyEditor bunu convertBodyDataToHtml ile HTML'e çevirecek
    if (courseData.leftColumn && courseData.rightColumn) {
      return {
        leftColumn: courseData.leftColumn,
        rightColumn: courseData.rightColumn,
      };
    }
    return "";
  };

  return (
    <PageEditProvider
      initialBodyHtml={getInitialBodyHtml()}
      initialHeroUrl={courseData.image}
      initialHeroAlt={courseData.hero.title}
      initialTitle={courseData.hero.title}
      initialSubtitle={courseData.hero.description}
      pageId={courseData.id}
      pageSlug={courseData.id}
    >
      <CourseContent courseData={courseData} allCourses={allCourses} />
    </PageEditProvider>
  );
}
