import React from "react";
import { CarouselSlider } from "../_molecules/slider";
import CourseCard from "../_molecules/courseCard";
import { Header2 } from "../_atoms/Headers";

const CarouselSliderComponent = ({ titleContent, data, itemsPerSlide }) => {
  return (
    <div className="py-10 w-4/5 mx-auto">
      <div className="flex items-center justify-center">
        <Header2>{titleContent?.title}</Header2>
      </div>
      <CarouselSlider itemsPerSlide={itemsPerSlide} showDots={true}>
        {data?.map((item) => (
          <div key={item?.id} className="mt-8 p-6">
            <CourseCard course={item} />
          </div>
        ))}
      </CarouselSlider>
    </div>
  );
};

export default CarouselSliderComponent;
