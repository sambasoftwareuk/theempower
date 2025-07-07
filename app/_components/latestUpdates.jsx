import React from "react";
import latestUpdates from "../mocks/latestUpdates.json";
import { CarouselSlider, ImageSlider } from "../_molecules/slider";
import CourseCard from "../_molecules/courseCard";
import { Header2 } from "../_atoms/Headers";

const LatestUpdates = ({ titleContent }) => {
  return (
    <div className="py-10 w-4/5 mx-auto">
      <div className="flex items-center justify-center">
        <Header2>{titleContent.title}</Header2>
      </div>
      <CarouselSlider itemsPerSlide={3} showDots={true}>
        {latestUpdates?.map((update) => (
          <div key={update?.id} className="mt-8 p-6">
            <CourseCard course={update} />
          </div>
        ))}
      </CarouselSlider>
    </div>
  );
};

export default LatestUpdates;
