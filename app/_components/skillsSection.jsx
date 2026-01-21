"use client";

import { useState, useEffect } from "react";
import { CourseTagButton } from "../_atoms/buttons";
import coursesFromMock from "../mocks/empowerTabs.json";
import TabMenu from "../_molecules/tabMenu";
import { SambaSlider } from "../_molecules/slider";
import ReactMarkdown from "react-markdown";
import { Header2 } from "../_atoms/Headers";
import { useWindowSize } from "../utils/useWindowSize";
import ProductCardWithImage from "../_molecules/ProductCardWithImage";

const SkillsSection = ({ titleContent, itemsPerSlide = 4 }) => {
  const { width } = useWindowSize();

  // 🔹 Ekran genişliğine göre slide başına eleman sayısını belirle
  const getResponsiveItems = () => {
    if (width < 640) return 1; // mobile
    if (width < 1025) return 3; // sm
    if (width < 1900) return 5; // md
    return itemsPerSlide; // lg ve üstü
  };
  const responsiveItems = getResponsiveItems();
  const { tabs, tagMap } = coursesFromMock;
  const [activeTabName, setActiveTabName] = useState(tabs[0]);
  const [activeTag, setActiveTag] = useState(tagMap[tabs[0]]?.[0] || "");

  useEffect(() => {
    setActiveTag(tagMap[activeTabName]?.[0] || "");
  }, [activeTabName]);

  const tabItems = tabs?.map((tab) => ({ title: tab }));

  return (
    <div className="bg-secondary200 w-full">

    <div className="py-10 w-4/6 mx-auto">
      <div className="text-center mb-6">
        <Header2 className="text-3xl font-bold">{titleContent?.title}</Header2>
        <ReactMarkdown>{titleContent?.subtitle}</ReactMarkdown>
      </div>

      <TabMenu
        tabs={tabItems}
        onTabChange={(tab) => setActiveTabName(tab.title)}
        orientation="horizontal"
        responsiveVerticalBreakpoint={670}
        />

      <div className="flex gap-4 mt-4 flex-wrap ">
        <SambaSlider
          variant="scroll"
          showArrows={true}
          itemsPerSlide={responsiveItems}
        >
          {(tagMap[activeTabName] || []).map((tag) => (
            <CourseTagButton
              key={tag?.title}
              label={tag?.title}
              active={tag?.title === activeTag?.title}
              onClick={() => setActiveTag(tag)}
            />
          ))}
        </SambaSlider>
      </div>

      {activeTag && (
        <div className="mt-10 flex justify-center items-center w-full">
          <SambaSlider
            variant="scroll"
            showArrows={false}
            itemsPerSlide={responsiveItems}
          >
            <div className="w-[250px] bg-white rounded-lg shadow-sm p-2 ">
              <ProductCardWithImage
                title={activeTag?.title}
                imageLink={
                  activeTag?.image && activeTag?.image.trim() !== ""
                    ? activeTag?.image
                    : "/photo-16.jpg"
                }
                variant={2}
                button={false}
              />
            </div>
          </SambaSlider>
        </div>
      )}
    </div>
                  </div>
  );
};

export default SkillsSection;
