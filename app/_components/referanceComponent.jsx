"use client";
import { useMemo } from "react";
import { Header3 } from "../_atoms/Headers";
import { LogoImage, CardImage } from "../_atoms/images";
import { SambaSlider } from "../_molecules/slider";
import { useWindowSize } from "../utils/useWindowSize";

const ReferenceComponent = ({
  referenceImages = [],
  titleContent,
  variant = "home",
}) => {
  const { width } = useWindowSize();

  const itemsPerSlide = useMemo(() => {
    if (width < 1024) return 3;
    if (width < 1536) return 6;
    return 8;
  }, [width]);

  const renderImages = (isSlider) =>
    referenceImages.map((img, idx) => {
      const ImageComponent = isSlider ? LogoImage : CardImage;
      const props = isSlider
        ? { imageLink: `/${img.link}`, width: 250, height: 250 }
        : {
            imageLink: `/${img.link}`,
            imageAlt: img.alt || `Partner ${idx + 1}`,
            aspectRatio: "aspect-[4/3]",
            objectFit: "contain",
          };

      return (
        <div
          key={img?.link}
          className={
            isSlider
              ? "mt-8 p-6"
              : "group bg-white w-full flex flex-col rounded-lg shadow p-6 text-center justify-center transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]"
          }
        >
          <div className={isSlider ? "" : "overflow-hidden rounded-md my-5"}>
            <div
              className={
                isSlider
                  ? ""
                  : "transition-transform duration-300 ease-in-out group-hover:scale-105"
              }
            >
              <ImageComponent {...props} />
            </div>
          </div>
        </div>
      );
    });

  if (!referenceImages.length) return null;

  // 🔹 HOME VARIANT - Slider yapısı (mevcut, değişmeyecek)
  if (variant === "home") {
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
          {renderImages(true)}
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
          {renderImages(false)}
        </div>
      </div>
    );
  }

  return null;
};

export default ReferenceComponent;
