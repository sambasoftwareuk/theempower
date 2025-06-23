"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CourseTagButton } from "../_atoms/buttons";
import { CarouselSlider, ImageSlider } from "../_molecules/slider";
import { mockCourses, tabs, tagMap } from "../mocks/courses.json";
import TabMenu from "../_molecules/tabMenu";
import CourseCard from "../_molecules/courseCard";

const SkillsSection = ({ courses }) => {
  const [activeTabName, setActiveTabName] = useState("Data Science");
  const [activeTag, setActiveTag] = useState(tagMap["Data Science"][0]);

  useEffect(() => {
    if (tagMap[activeTabName]?.[0]) {
      setActiveTag(tagMap[activeTabName][0]);
    } else {
      setActiveTag("");
    }
  }, [activeTabName]);

  const filteredCourses = useMemo(() => {
    return courses?.filter(
      (course) =>
        course?.category === activeTabName &&
        course?.tags
          .map((t) => t.toLowerCase())
          .includes(activeTag.toLowerCase())
    );
  }, [activeTabName, activeTag]);

  const tabItems = tabs.map((tab) => ({ title: tab }));

  return (
    <div className="py-10 w-4/5 mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">
          All the skills you need in one place
        </h2>
        <p className="text-muted-foreground mt-2">
          From critical skills to technical topics, Samba supports your
          professional development
        </p>
      </div>

      {/* Tab Menu */}
      <TabMenu
        tabs={tabItems}
        onTabChange={(tab) => setActiveTabName(tab.title)}
        orientation="horizontal"
        responsiveVerticalBreakpoint={670}
      />

      {/* Tags */}
      <CarouselSlider variant="scroll" showArrows={true} showDots={false}>
        {tagMap[activeTabName].map((tag) => (
          <CourseTagButton
            key={tag}
            label={tag}
            active={tag === activeTag}
            onClick={() => setActiveTag(tag)}
          />
        ))}
      </CarouselSlider>

      {/* Courses */}
      {filteredCourses && filteredCourses.length === 0 ? (
        <div className="text-center w-full py-10 text-gray-500">
          No course found
        </div>
      ) : (
        <CarouselSlider itemsPerSlide={3} showDots={true}>
          {filteredCourses?.map((course) => (
            <div key={course?.id} className="mt-8">
              <CourseCard course={course} />
            </div>
          ))}
        </CarouselSlider>
      )}
    </div>
  );
};

export default SkillsSection;
