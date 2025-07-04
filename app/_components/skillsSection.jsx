"use client";

import React, { useState, useEffect } from "react";
import { CourseTagButton } from "../_atoms/buttons";
import coursesFromMock from "../mocks/empowerTabs.json";
import TabMenu from "../_molecules/tabMenu";
import SimpleCard from "../_molecules/simpleCard";
import { CarouselSlider } from "../_molecules/slider";

const SkillsSection = () => {
  const { tabs, tagMap } = coursesFromMock;
  const [activeTabName, setActiveTabName] = useState(tabs[0]);
  const [activeTag, setActiveTag] = useState(tagMap[tabs[0]]?.[0] || "");

  useEffect(() => {
    setActiveTag(tagMap[activeTabName]?.[0] || "");
  }, [activeTabName]);

  const tabItems = tabs.map((tab) => ({ title: tab }));

  return (
    <div className="py-10 w-4/5 mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">
          Integrate into UK with Confidence and Ease
        </h2>
        <p className="text-muted-foreground mt-2">
          Access everything you need
          <br />
          from housing to healthcare, schools to social life
          <br />
          and start building your new life
          <strong> faster, easier and smarter</strong>
        </p>
      </div>

      <TabMenu
        tabs={tabItems}
        onTabChange={(tab) => setActiveTabName(tab.title)}
        orientation="horizontal"
        responsiveVerticalBreakpoint={670}
      />

      <div className="flex gap-2 mt-4 flex-wrap">
       <CarouselSlider variant="scroll" showArrows={true}>
          {(tagMap[activeTabName] || []).map((tag) => (
            <CourseTagButton
              key={tag.title}
              label={tag.title}
              active={tag.title === activeTag.title}
              onClick={() => setActiveTag(tag)}
            />
          ))}
        </CarouselSlider>
      </div>

      {activeTag && (
        <div className="mt-10 flex justify-center items-center w-full">
          <CarouselSlider variant="scroll" showArrows={false}>
            <div className="w-[250px]">
              <SimpleCard
                id={activeTag.title.toLowerCase().replace(/\s+/g, "-")}
                title={activeTag.title}
                image={
                  activeTag.image && activeTag.image.trim() !== ""
                    ? activeTag.image
                    : "/photo-16.jpg"
                }
              />
            </div>
          </CarouselSlider>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
