import Image from 'next/image'
import React from 'react'

const src = (imageLink) => imageLink && imageLink.trim() !== "" ? imageLink : "/generic-image.png";
const imageSlug = (imageLink) => imageLink ? imageLink.split('/').pop().replace(/\.[^/.]+$/, "") : "generic-image"

export const SliderImage = ({ imageLink }) => {
  
  return (
    <div className="mx-auto w-full max-w-[1350px]">
      <div className="custom:block relative h-[250px] w-full overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1350px] h-full">
          <Image
            src={src(imageLink)}
            alt={`slider-image-${imageSlug(imageLink)}`}
            fill
            className={src(imageLink) == "/generic-image.png" ? "object-contain bg-gray-300" : "object-cover"}
          />
        </div>
      </div>
    </div>
  )
}

export const CardImage = ({ imageLink }) => {
  
    return (
      <div className="mx-auto w-full max-w-[240px]">
        <div className="custom:block relative w-[240px] h-[135px] overflow-hidden rounded-t-md">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[240px] h-full">
            <Image
              src={src(imageLink)}
              alt={`card-image-${imageSlug(imageLink)}`}
              fill
              className={src(imageLink) == "/generic-image.png" ? "object-contain bg-gray-300" : "object-cover"}
            />
          </div>
        </div>
      </div>
    )
}


export const LogoImage = ({ imageLink = "" }) => {
  
  return (
    <div className='relative w-[200px] h-[80px] overflow-hidden '>
      <Image
        src={src(imageLink)}
        alt={`logo-image-${imageSlug(imageLink)}`}
        fill
        className={`object-contain ${src(imageLink) == "/generic-image.png" ? "bg-gray-300" : ""}`}
      />
    </div>
  );
};


export const ProfileImage = ({ imageLink = "" }) => {
  
  return (
    <div className='relative w-[80px] h-[80px] overflow-hidden'>
      <Image
        src={src(imageLink)}
        alt={`profile-image-${imageSlug(imageLink)}`}
        fill
        className="object-contain border-2 border-black rounded-full bg-gray-200"
      />
    </div>
  );
};


  