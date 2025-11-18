"use client";
import React from "react";
import { CarouselSlider, SambaSlider } from "../_molecules/slider";
import CourseCard from "../_molecules/courseCard";
import { Header1 } from "../_atoms/Headers";
import { useWindowSize } from "../utils/useWindowSize";

const CarouselSliderComponent = ({ titleContent, data, itemsPerSlide = 4 }) => {
  const { width } = useWindowSize();

  // 🔹 Ekran genişliğine göre slide başına eleman sayısını belirle
  const getResponsiveItems = () => {
    if (width < 640) return 1; // mobile
    if (width < 1025) return 2; // sm
    if (width < 1900) return 3; // md
    return itemsPerSlide; // lg ve üstü
  };

  const responsiveItems = getResponsiveItems();

  return (
    <div className="mt-2 my-12 w-[90%] md:w-[85%] lg:w-[80%] xl:w-[80%] mx-auto  ">
      {titleContent && (
        <div className="flex justify-center text-center my-2 ">
          <Header1>{titleContent.title}</Header1>
        </div>
      )}

      {/* 🔹 Artık dinamik olarak itemsPerSlide değişiyor */}
      <SambaSlider
        variant="slide"
        showDots={false}
        showArrows={true}
        isAutoSlide={false}
        itemsPerSlide={responsiveItems}
        size="lg"
      >
        {data?.map((item) => (
          <div
            key={item?.id}
            className="px-12 py-4 flex h-full justify-center "
          >
            <CourseCard course={item} />
          </div>
        ))}
      </SambaSlider>
    </div>
  );
};

export default CarouselSliderComponent;
