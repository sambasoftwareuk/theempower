"use client";

import React, { useState, useEffect } from "react";
import { CourseTagButton } from "../_atoms/buttons";
import { ImageSlider } from "../_molecules/slider";
import { mockCourses, tabs, tagMap } from "../mocks/courses";
import TabMenu from "../_molecules/tabMenu";
import CourseCard from "../_molecules/courseCard";

const groupItems = (items, itemsPerGroup) => {
  const groups = [];
  for (let i = 0; i < items.length; i += itemsPerGroup) {
    groups.push(items.slice(i, i + itemsPerGroup));
  }
  return groups;
};

const SkillsSection = () => {
  const [activeTabName, setActiveTabName] = useState("Data Science");
  const [activeTag, setActiveTag] = useState(tagMap["Data Science"][0]);

  useEffect(() => {
    setActiveTag(tagMap[activeTabName][0]);
  }, [activeTabName]);

  const filteredCourses = mockCourses.filter(
    (course) =>
      course.category === activeTabName &&
      course.tags.map((t) => t.toLowerCase()).includes(activeTag.toLowerCase())
  );

  const tabItems = tabs.map((tab) => ({ title: tab }));

  return (
    <div className="py-10 w-4/5 m-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">
          All the skills you need in one place
        </h2>
        <p className="text-muted-foreground mt-2">
          From critical skills to technical topics, Samba supports your
          professional development
        </p>
      </div>

      <TabMenu
        tabs={tabItems}
        onTabChange={(tab) => setActiveTabName(tab.title)}
      />

      <ImageSlider showDots={false} showArrows={true}>
        {groupItems(tagMap[activeTabName],6).map((group, i) => (
          <div key={i} className="flex gap-2 justify-center mb-10">
            {group.map((tag) => (
              <CourseTagButton
                key={tag}
                label={tag}
                active={tag === activeTag}
                onClick={() => setActiveTag(tag)}
              />
            ))}
          </div>
        ))}
      </ImageSlider>

      <ImageSlider>
        {filteredCourses.length === 0 ? (
          <div className="text-center w-full py-10">No course found</div>
        ) : (
          groupItems(filteredCourses, 3).map((group, i) => (
            <div
              key={i}
              className="flex justify-center gap-20"
            >
              {group.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  author={course.author}
                  rating={course.rating}
                  reviews={course.reviews}
                  price={course.price}
                  oldPrice={course.oldPrice}
                  badge={course.badge}
                  image={course.image}
                />
              ))}
            </div>
          ))
        )}
      </ImageSlider>
    </div>
  );
};

export default SkillsSection;
