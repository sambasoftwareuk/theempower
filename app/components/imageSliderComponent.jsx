import React from "react";
import { ImageSlider } from "../_molecules/slider";
import { SliderImage } from "../_atoms/images";

const ImageSliderComponent = ({ images }) => {
  return (
    <ImageSlider variant="autoSlide">
      {images.map((image, index) => (
        <SliderImage key={index} imageLink={`/${image.link}`} />
      ))}
    </ImageSlider>
  );
};

export default ImageSliderComponent;
