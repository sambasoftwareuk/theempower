import React from 'react'
import ImageSliderComponent from './imageSliderComponent'
import { getMainSliderSlides } from '@/lib/queries';

export default async function ImageSliderBeComponent() {
    const slidesData = await getMainSliderSlides("main_page_slider", "en");
    
  const mainSliderImages = slidesData.map((slide) => ({
    alt: slide.image_alt || "",
    link: slide.image_link.replace("/", ""),
  }));

  const sliderData = slidesData.map((slide) => ({
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    body: slide.description || "",
    primaryLabel: null,
    secondaryLabel: null,
  }));
  return (
    <ImageSliderComponent
        images={mainSliderImages}
        sliderData={sliderData}
        size={"lg"}
      />
  )
}