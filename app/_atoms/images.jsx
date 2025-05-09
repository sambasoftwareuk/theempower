import Image from 'next/image'
import React from 'react'

export const SliderImage = ({ imageLink }) => {
  const src = imageLink && imageLink.trim() !== "" ? imageLink : "/generic-image.png";
  const imageSlug = imageLink ? imageLink.split('/').pop().replace(/\.[^/.]+$/, "") : "generic-image"
  console.log(src);
  
  return (
    <div className="mx-auto w-full max-w-[1350px]">
      <div className="custom:block relative h-[250px] w-full overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1350px] h-full">
          <Image
            src={src}
            alt={`slider-image-${imageSlug}`}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export const CardImage = ({ imageLink }) => {
  const src = imageLink && imageLink.trim() !== "" ? imageLink : "/generic-image.png";
  const imageSlug = imageLink ? imageLink.split('/').pop().replace(/\.[^/.]+$/, "") : "generic-image"
  console.log(src);
    return (
      <div className="mx-auto w-full max-w-[240px]">
        <div className="custom:block relative w-[240px] h-[135px] overflow-hidden rounded-t-md">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[240px] h-full">
            <Image
              src={src}
              alt={`card-image-${imageSlug}`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    )
}


export const LogoImage = ({ imageLink = "" }) => {
  const src = imageLink && imageLink.trim() !== "" ? imageLink : "/generic-image.png";
  const imageSlug = imageLink ? imageLink.split('/').pop().replace(/\.[^/.]+$/, "") : "generic-image"
  console.log(src);

  return (
    <div className='relative w-[200px] h-[80px] overflow-hidden'>
      <Image
        src={src}
        alt={`logo-image-${imageSlug}`}
        fill
        className="object-contain"
      />
    </div>
  );
};


export const ProfileImage = ({ imageLink = "" }) => {
  const src = imageLink && imageLink.trim() !== "" ? imageLink : "/generic-image.png";
  const imageSlug = imageLink ? imageLink.split('/').pop().replace(/\.[^/.]+$/, "") : "generic-image"
  console.log(src);

  return (
    <div className='relative w-[80px] h-[80px] overflow-hidden'>
      <Image
        src={src}
        alt={`profile-image-${imageSlug}`}
        fill
        className="object-contain bg-red border-2 border-black rounded-full"
      />
    </div>
  );
};


  