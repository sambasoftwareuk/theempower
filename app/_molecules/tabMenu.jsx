"use client";
import { useState } from "react";
import { TabButton } from "../_atoms/buttons";

const TabMenu = ({ tabs, orientation = "horizontal", onTabChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const isVertical = orientation === "vertical";

  const handleTabClick = (index) => {
    setActiveIndex(index);
    if (onTabChange) {
      onTabChange(tabs[index]);
    }
  };

  return (
    <div className={`w-full ${isVertical ? "flex gap-4" : ""}`}>
      {tabs?.length > 0 ? (
        <>
          <div
            className={`${
              isVertical
                ? "flex flex-col w-1/4"
                : "flex flex-wrap gap-2 justify-center mb-4"
            }`}
          >
            {tabs.map((tab, index) => (
              <TabButton
                key={index}
                label={tab.title}
                onClick={() => handleTabClick(index)}
                className={`px-4 py-2 text-sm border-b-2 transition-colors duration-300 ${
                  activeIndex === index
                    ? "border-primary text-black font-bold"
                    : "border-transparent text-gray-500"
                }`}
              />
            ))}
          </div>

          <div className={`${isVertical ? "w-3/4" : "mt-4"}`}>
            {tabs[activeIndex].content}
          </div>
        </>
      ) : (
        <div className="text-gray-500 text-sm text-center">
          No tabs available
        </div>
      )}
    </div>
  );
};


export default TabMenu;
