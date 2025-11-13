"use client";
import React from "react";
import { CarouselSlider } from "../_molecules/slider";
import CourseCard from "../_molecules/courseCard";
import { Header2 } from "../_atoms/Headers";
import { useWindowSize } from "../utils/useWindowSize";

const CarouselSliderComponent = ({ titleContent, data, itemsPerSlide = 4 }) => {
  const { width } = useWindowSize();

  // 🔹 Ekran genişliğine göre slide başına eleman sayısını belirle
  const getResponsiveItems = () => {
    if (width < 640) return 1; // Mobil
    if (width < 768) return 2; // Küçük tablet
    if (width < 1024) return 3; // Tablet
    return itemsPerSlide; // Desktop (varsayılan: 4)
  };

  const responsiveItems = getResponsiveItems();

  return (
    <div className="py-10 w-4/5 mx-auto">
      <div className="flex items-center justify-center">
        <Header2>{titleContent?.title}</Header2>
      </div>

      {/* 🔹 Artık dinamik olarak itemsPerSlide değişiyor */}
      <CarouselSlider itemsPerSlide={responsiveItems} showDots={true}>
        {data?.map((item) => (
          <div key={item?.id} className="mt-8 p-4 mx-9">
            <CourseCard course={item} />
          </div>
        ))}
      </CarouselSlider>
    </div>
  );
};

export default CarouselSliderComponent;
