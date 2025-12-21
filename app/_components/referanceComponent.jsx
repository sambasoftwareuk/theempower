"use client";
import { Header3 } from "../_atoms/Headers";
import { LogoImage } from "../_atoms/images";
import { CardImage } from "../_atoms/images";
import { SambaSlider } from "../_molecules/slider";
import { useWindowSize } from "../utils/useWindowSize";

const ReferenceComponent = ({
  referenceImages,
  titleContent,
  variant = "home",
}) => {
  const { width } = useWindowSize();

  // 🔹 HOME VARIANT - Slider yapısı (mevcut, değişmeyecek)
  if (variant === "home") {
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
          {referenceImages?.map((image, index) => (
            <div key={image?.id || index} className="mt-8 p-6">
              <LogoImage
                imageLink={`/${image?.link}`}
                width={250}
                height={250}
              />
            </div>
          ))}
        </SambaSlider>
      </div>
    );
  }

  // 🔹 PAGE VARIANT - Grid yapısı (Partners sayfası için)
  if (variant === "page") {
    return (
      <div className="w-full px-4 py-8">
        {titleContent && (
          <Header3 className="text-xl font-semibold mb-6 text-center">
            {titleContent?.title}
          </Header3>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:mx-16 lg:mx-24 xl:mx-40 justify-items-start">
          {referenceImages?.map((image, index) => (
            <div
              key={image?.id || index}
              className="group bg-white w-full flex flex-col rounded-lg shadow p-6 text-center justify-center transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="overflow-hidden rounded-md my-5">
                <div className="transition-transform duration-300 ease-in-out group-hover:scale-105">
                  <CardImage
                    imageLink={`/${image?.link}`}
                    imageAlt={image?.alt || `Partner ${index + 1}`}
                    aspectRatio="aspect-[4/3]"
                    objectFit="contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default ReferenceComponent;
