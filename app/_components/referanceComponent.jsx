"use client";
import React from "react";
import { Header3 } from "../_atoms/Headers";
import { LogoImage } from "../_atoms/images";
import { SambaSlider } from "../_molecules/slider";
import { useWindowSize } from "../utils/useWindowSize";

const ReferenceComponent = ({ referenceImages, titleContent }) => {
  const { width } = useWindowSize();
  // 🔹 Dinamik itemsPerSlide hesaplama
  const getItemsPerSlide = () => {
    if (width < 1024) return 3; // sm
    if (width < 1536) return 6; // md
    if (width < 1900) return 8;
    return 8; // lg ve üstü
  };

  const itemsPerSlide = getItemsPerSlide();

  return (
    <div className="hidden md:flex flex-col items-center text-center my-4 mx-auto max-w-[1650px] w-full">
      <Header3 className="text-xl font-semibold mb-4 ">
        {titleContent?.title}
      </Header3>

      <SambaSlider
        itemsPerSlide={itemsPerSlide}
        showDots={true}
        showArrows={false}
      >
        {referenceImages?.map((image) => (
          <div key={image?.id} className="mt-8 p-6">
            <LogoImage
              key={image?.id}
              imageLink={`/${image?.link}`}
              width={250}
              height={250}
            />
          </div>
        ))}
      </SambaSlider>
    </div>
  );
};

export default ReferenceComponent;
