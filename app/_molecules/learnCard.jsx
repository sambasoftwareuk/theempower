import React from "react";
import learnItems from "../constants/learnCard";
import { Header2 } from "../_atoms/Headers";

export const LearnCard = () => {
  const { leftItems, rightItems } = learnItems;
  return (
    <div className="border p-6 rounded-md max-w-4xl mx-auto mt-10">
      <Header2 className="mb-6 text-secondary">
        What you"ll learn
      </Header2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-gray-800">
        {leftItems.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span>✓</span>
            <p>{item}</p>
          </div>
        ))}
        {rightItems.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span>✓</span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
