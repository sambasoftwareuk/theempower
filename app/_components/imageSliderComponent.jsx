import React from "react";
import { ImageSlider } from "../_molecules/slider";
import { SliderImage } from "../_atoms/images";
import SliderCard from "../_molecules/sliderCard";

const ImageSliderComponent = ({ images, size, variant, sliderData = [] }) => {
  return (
    <ImageSlider size={size} variant={variant}>
      {images.map((image, index) => {
        const content = sliderData[index];

        return (
          <div
            key={index}
            className="relative w-full h-full px-4 sm:px-6 lg:px-0"
          >
            <SliderImage imageLink={`/${image.link}`} />

            {content && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="max-w-xl mx-auto pointer-events-auto">
                  <SliderCard
                    title={content?.title}
                    subtitle={content?.subtitle}
                    body={content?.body}
                    primaryLabel={content?.primaryLabel}
                    secondaryLabel={content?.secondaryLabel}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </ImageSlider>
  );
};

export default ImageSliderComponent;
