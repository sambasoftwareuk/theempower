import Image from "next/image";
import React, { useMemo } from "react";

const getSrc = (imageLink) =>
  imageLink && imageLink.trim() !== "" ? imageLink : "/generic-image.png";
const getImageSlug = (imageLink) =>
  imageLink
    ? imageLink
        .split("/")
        .pop()
        .replace(/\.[^/.]+$/, "")
    : "generic-image";

export const SliderImage = ({ imageLink, imageAlt }) => {
  const src = useMemo(() => getSrc(imageLink), [imageLink]);
  const randomImageAlt = useMemo(() => getImageSlug(imageLink), [imageLink]);
  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="custom:block relative h-[600px] w-full overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-full">
          <Image
            src={src}
            alt={`slider-image-${imageAlt ? imageAlt : randomImageAlt}`}
            fill
            className={
              src == "/generic-image.png"
                ? "object-contain bg-gray-300"
                : "object-cover"
            }
          />
        </div>
      </div>
    </div>
  );
};

export const CardImage = ({
  imageLink,
  imageAlt,
  aspectRatio = "aspect-[16/9]",
}) => {
  const src = useMemo(() => getSrc(imageLink), [imageLink]);
  const randomImageAlt = useMemo(() => getImageSlug(imageLink), [imageLink]);
  return (
    <div className="mx-auto w-full">
      <div
        className={`relative w-full  overflow-hidden rounded-t-m ${aspectRatio}`}
      >
        <Image
          src={src}
          alt={`slider-image-${imageAlt ? imageAlt : randomImageAlt}`}
          fill
          className={
            src == "/generic-image.png"
              ? "object-contain bg-gray-300"
              : "object-cover"
          }
        />
      </div>
    </div>
  );
};

export const LogoImage = ({
  imageLink = "",
  width = 50,
  height = 20,
  imageAlt,
}) => {
  const src = useMemo(() => getSrc(imageLink), [imageLink]);
  const randomImageAlt = useMemo(() => getImageSlug(imageLink), [imageLink]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: `200px`,
        maxHeight: `80px`,
      }}
    >
      <Image
        src={src}
        alt={`slider-image-${imageAlt ? imageAlt : randomImageAlt}`}
        fill
        className={`object-contain ${
          src === "/generic-image.png" ? "bg-gray-300" : ""
        }`}
      />
    </div>
  );
};

export const ProfileImage = ({ imageLink = "", imageAlt }) => {
  const src = useMemo(() => getSrc(imageLink), [imageLink]);
  const randomImageAlt = useMemo(() => getImageSlug(imageLink), [imageLink]);
  return (
    <div className="relative w-[45px] h-[45px] md:w-[60px] md:h-[60px] overflow-hidden">
      <Image
        src={src}
        alt={`slider-image-${imageAlt ? imageAlt : randomImageAlt}`}
        fill
        className="object-contain border-2 border-black rounded-full bg-gray-200 p-1"
      />
    </div>
  );
};

// --- ZOOMABLE IMAGE ---
export const ZoomableImage = ({ imageLink, alt = "zoomable" }) => {
  const [zoomed, setZoomed] = useState(false);

  const toggleZoom = (e) => {
    e.stopPropagation();
    setZoomed((z) => !z);
  };

  const src = getSrc(imageLink);

  return (
    <Image
      src={src}
      width={800}
      height={600}
      alt={alt}
      onClick={toggleZoom}
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") toggleZoom(e);
      }}
      className={`object-contain transition-transform duration-300 cursor-zoom-in ${
        zoomed ? "scale-[1.5]" : "scale-100"
      }`}
    />
  );
};
