"use client";
import { useEffect, useState } from "react";
import coursesFromMock from "../mocks/empowerTabs.json";
import mentors from "../mocks/mentors.json";
import { Breadcrumb } from "../_atoms/breadcrumb";
import TabMenu from "../_molecules/tabMenu";
import CourseCard from "../_molecules/courseCard";
import { Header1 } from "../_atoms/Headers";
import Image from "next/image";

const mentorPage = () => {
  const { tabs, tagMap } = coursesFromMock;
  const [activeTabName, setActiveTabName] = useState(tabs[0]);
  const [activeTag, setActiveTag] = useState(tagMap[tabs[0]]?.[0] || "");

  useEffect(() => {
    setActiveTag(tagMap[activeTabName]?.[0] || "");
  }, [activeTabName]);
  const tabItems = tabs?.map((tab) => ({ title: tab }));
  return (
    <div className="gap-10">
      <Breadcrumb items={[{ label: "Mentors", href: "#" }]} />

      {/* 🔥 HERO IMAGE */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] ">
        <Image
          src="/photo-2.jpg"
          alt="Mentors"
          fill
          priority
          className="object-cover"
        />
      </div>
      {/* overlay */}
      <div className="my-10">
        <TabMenu
          tabs={tabItems}
          onTabChange={(tab) => setActiveTabName(tab.title)}
          orientation="horizontal"
          responsiveVerticalBreakpoint={670}
        />
      </div>

      <div className="flex justify-center my-8">
        <Header1>Mentors</Header1>
      </div>

      <div className="flex justify-center overflow-hidden px-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols gap-8 justify-items-center max-w-7xl">
          {mentors?.map((item) => (
            <CourseCard
              key={item.id}
              course={item}
              disableHover
              label="Book An Appointment"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default mentorPage;
