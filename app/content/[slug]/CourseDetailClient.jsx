"use client";
import { useState } from "react";
import { Header2, Header3 } from "../../_atoms/Headers";
import { Breadcrumb } from "../../_atoms/breadcrumb";
import { PageEditProvider, usePageEdit } from "../../context/PageEditProvider";
import BodyEditor from "../../_molecules/BodyEditor";
import BodySaveButton from "../../_molecules/BodySaveButton";
import HeroSaveButton from "../../_molecules/HeroSaveButton";
import DraftHeroImage from "../../_molecules/DraftHeroImage";
import TitleEditor from "../../_molecules/TitleEditor";
import SubtitleEditor from "../../_molecules/SubtitleEditor";
import { SignedIn } from "@clerk/nextjs";
import Icon from "@/app/_atoms/Icon";
import { Settings } from "@/app/_atoms/Icons";
import { IconOnlyButton, PrimaryButton } from "@/app/_atoms/buttons";
import { FeaturedSettingsModal } from "@/app/_components/FeaturedSettingsModal";
import SideMenu from "@/app/_molecules/SideMenu";
import { CommentsSectionContainer } from "../../_molecules/CommentsSectionContainer";

function CourseDetailContent({
  initialTitle,
  initialSubtitle,
  initialBody,
  initialHeroUrl,
  initialHeroAlt,
  slug,
  sideMenuData,
  courseId,
}) {
  const { title, bodyHtml } = usePageEdit();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const displayTitle = title || initialTitle;

  // bodyHtml state'ten geliyorsa onu kullan, yoksa initialBody'yi kullan
  const displayBodyHtml = bodyHtml !== undefined ? bodyHtml : initialBody || "";

  const handleFeaturedSave = (pos) => {
    // Şimdilik sadece UI amaçlı
    console.log("Featured position saved:", pos);

    // İleride burası API call olacak
    // await updateFeaturedPosition(courseId, pos);
  };

  const togglePosition = (pos) => {
    setSelectedPositions((prev) => {
      if (prev.includes(pos)) {
        return prev.filter((p) => p !== pos);
      }

      return [...prev, pos];
    });
  };

  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: displayTitle, href: "#" }]} />

      <section className="bg-secondary text-white px-6 py-8 relative min-h-[380px] md:min-h-[450px] lg:min-h-[380px]">
        {/* Mobile + MD Layout (flex column) */}
        <div className="flex flex-col gap-6 md:hidden w-full mx-auto">
          {/* Hero Image */}
          <DraftHeroImage
            initialUrl={initialHeroUrl || "/generic-image.png"}
            initialAlt={initialHeroAlt || initialTitle}
            width={640}
            height={320}
            className="w-full rounded-lg aspect-[2/1]"
          />

          {/* Title + Subtitle */}
          <div className="flex flex-col gap-2 ">
            <TitleEditor initialTitle={initialTitle} />
            <SubtitleEditor initialSubtitle={initialSubtitle} />
          </div>

          {/* Hero Button */}
          <div className="mt-4 ">
            <HeroSaveButton />
          </div>
        </div>

        {/* LG+ Layout (grid 2 columns) */}
        <div className="hidden md:grid grid-cols-2 gap-8 lg:gap-24 items-center w-full mx-auto px-4 lg:px-16 py-20 relative ">
          {/* Left Column: Title + Subtitle */}
          <div>
            <TitleEditor initialTitle={initialTitle} />
            <SubtitleEditor initialSubtitle={initialSubtitle} />
          </div>

          {/* Right Column: Hero Image */}

          <DraftHeroImage
            initialUrl={initialHeroUrl || "/generic-image.png"}
            initialAlt={initialHeroAlt || initialTitle}
            width={640}
            height={320}
            className="w-full rounded-lg object-cover aspect-[2/1]"
          />

          {/* Hero Button absolute */}
          <div className="absolute bottom-2 w-full flex justify-start lg:justify-start px-4 lg:px-16 ">
            <HeroSaveButton />
          </div>
        </div>
      </section>
      {/* Mobile: BodyEditor altında Settings butonu ve yazısı */}
      <SignedIn>
        <div className="flex lg:hidden items-center justify-center  gap-2 mt-10 mx-6">
          <PrimaryButton
            label="Settings"
            icon={<Icon variant={Settings} size={32} />}
            onClick={() => setIsModalOpen(true)}
            className="w-full"
          />
        </div>
      </SignedIn>

      <section className="py-8 px-6 bg-gray-50">
        <div className="w-full  mx-auto">
          <div className="flex   items-start   gap-8">
            <SideMenu
              title={sideMenuData.title}
              items={sideMenuData.items}
              currentSlug={slug}
            />

            <SignedIn>
              <div className="hidden lg:flex">
                <IconOnlyButton
                  icon={
                    <Icon variant={Settings} size={36} color="text-gray-600" />
                  }
                  className="flex-shrink-0 cursor-pointer self-center ml-0"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </SignedIn>

            <div
              className="bg-white
             rounded-lg shadow-lg border border-gray-200 p-8 md:p-12 flex-1"
            >
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
                          {displayBodyHtml.leftColumn.items.map(
                            (item, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-primary900 mr-3 mt-1 flex-shrink-0">
                                  ✓
                                </span>
                                <span className="text-secondary400 leading-relaxed">
                                  {item}
                                </span>
                              </li>
                            ),
                          )}
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
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                  ) : typeof displayBodyHtml === "string" && displayBodyHtml ? (
                    // HTML string yapısı (Tiptap'ten gelen)
                    <div
                      className="body-html-content flex-1"
                      dangerouslySetInnerHTML={{ __html: displayBodyHtml }}
                    />
                  ) : (
                    // Fallback
                    <p className="flex-1 text-gray-500">
                      Content not available yet. Click the edit button to add
                      content.
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

              {/* Comments */}
              {courseId && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <CommentsSectionContainer contentId={courseId} />
                </div>
              )}
            </div>
          </div>

          {/* Settings Modal */}
          <FeaturedSettingsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedPositions={selectedPositions}
            onToggle={togglePosition}
            onSave={handleFeaturedSave}
          />
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
  leftColumn,
  rightColumn,
  locale = "en",
  slug,
  sideMenuData,
}) {
  // bodyHtml yoksa leftColumn ve rightColumn'dan oluştur
  const getInitialBodyHtml = () => {
    if (initialBody) {
      return initialBody;
    }
    // Eğer leftColumn ve rightColumn varsa, object olarak döndür
    // BodyEditor bunu convertBodyDataToHtml ile HTML'e çevirecek
    if (leftColumn && rightColumn) {
      return {
        leftColumn: leftColumn,
        rightColumn: rightColumn,
      };
    }
    return "";
  };

  return (
    <PageEditProvider
      initialBodyHtml={getInitialBodyHtml()}
      initialHeroUrl={initialHeroUrl}
      initialHeroAlt={initialHeroAlt}
      initialHeroMediaId={initialHeroMediaId}
      initialTitle={initialTitle}
      initialSubtitle={initialSubtitle}
      pageId={courseId}
      locale={locale}
      pageSlug={slug}
    >
      <CourseDetailContent
        initialTitle={initialTitle}
        initialSubtitle={initialSubtitle}
        initialBody={initialBody}
        initialHeroUrl={initialHeroUrl}
        initialHeroAlt={initialHeroAlt}
        leftColumn={leftColumn}
        rightColumn={rightColumn}
        slug={slug}
        sideMenuData={sideMenuData}
        courseId={courseId}
      />
    </PageEditProvider>
  );
}
