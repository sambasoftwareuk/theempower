import React from "react";
import events from "../mocks/events.json";
import { CarouselSlider, ImageSlider } from "../_molecules/slider";
import CourseCard from "../_molecules/courseCard";
import { Header2 } from "../_atoms/Headers";

const Events = ({ titleContent }) => {
  return (
    <div className="py-10 w-4/5 mx-auto">
      <div className="flex items-center justify-center">
        <Header2>{titleContent?.title}</Header2>
      </div>
      <CarouselSlider itemsPerSlide={3} showDots={true}>
        {events?.map((event) => (
          <div key={event?.id} className="mt-8 p-6">
            <CourseCard course={event} />
          </div>
        ))}
      </CarouselSlider>
    </div>
  );
};

export default Events;
