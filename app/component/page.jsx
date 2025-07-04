import React from 'react'
import ImageSliderComponent from '../_components/imageSliderComponent'
import images from '../mocks/mainSliderImages.json'
import sliderData from '../mocks/sliderData.json'
import sliderImage300 from '../mocks/slider-image-300.json'
import sliderImage600 from '../mocks/slider-image-600.json'


const page = () => {
  return (
    <div>
        <h1 className="text-3xl font-bold mb-4">Image Sliders</h1>
        <code>
        {`<ImageSliderComponent images={sliderImage600} sliderData={sliderData} size={"lg"} />`}
        </code>
      <ImageSliderComponent images={sliderImage600} sliderData={sliderData} size={"lg"} />
      <div>...</div>
        <code>
        {`<ImageSliderComponent images={sliderImage600} sliderData={sliderData} size={"md"} />`}
        </code>

      <ImageSliderComponent images={sliderImage300} sliderData={sliderData} size={"md"} />
      <div>...</div>
        <code>
        {`<ImageSliderComponent images={sliderImage600} sliderData={sliderData} size={"sm"} />`}
        </code>
      <ImageSliderComponent images={images} sliderData={sliderData} size={"sm"} />
    </div>
  )
}

export default page