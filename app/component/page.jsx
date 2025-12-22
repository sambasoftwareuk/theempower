import ImageSliderComponent from "../_components/imageSliderComponent";
import images from "../mocks/mainSliderImages.json";
import sliderData from "../mocks/sliderData.json";
import sliderImage300 from "../mocks/slider-image-300.json";
import sliderImage600 from "../mocks/slider-image-600.json";
import { FAQSection } from "../_components/faqSection";
import faqData from "../mocks/faqSection";
import { Header1 } from "../_atoms/Headers";
import TestToast from "../_components/TestToast";

const page = () => {
  return (
    <div>
      <Header1 className="mb-4">Image Sliders</Header1>
      <code>
        {`<ImageSliderComponent images={sliderImage600} sliderData={sliderData} size={"lg"} />`}
      </code>
      <ImageSliderComponent
        images={sliderImage600}
        sliderData={sliderData}
        size={"lg"}
      />
      <div>...</div>
      <code>
        {`<ImageSliderComponent images={sliderImage600} sliderData={sliderData} size={"md"} />`}
      </code>

      <ImageSliderComponent
        images={sliderImage300}
        sliderData={sliderData}
        size={"md"}
      />
      <div>...</div>
      <code>
        {`<ImageSliderComponent images={sliderImage600} sliderData={sliderData} size={"sm"} />`}
      </code>
      <ImageSliderComponent
        images={images}
        sliderData={sliderData}
        size={"sm"}
      />

      <FAQSection faqData={faqData} />
      <TestToast />
    </div>
  );
};

export default page;
