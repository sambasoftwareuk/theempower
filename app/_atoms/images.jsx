import Image from 'next/image'
import React from 'react'

export const SliderImage = ({ imageLink }) => {
  return (
    <div className="mx-auto w-full max-w-[1350px]">
      <div className="custom:block relative h-[250px] w-full overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1350px] h-full">
          <Image
            src={imageLink}
            alt="slider-learner"
            fill
            className="object-cover"
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
              src={imageLink}
              alt="slider-learner"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    )
}


export const LogoImage = ({ imageLink }) => {
    return (
      <div>
        <Image imageLink={imageLink} width="100px"/>
      </div>
    );
  };