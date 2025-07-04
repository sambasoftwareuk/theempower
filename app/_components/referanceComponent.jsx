import React from 'react'
import { Header3 } from '../_atoms/Headers'
import { LogoImage } from '../_atoms/images'
import { CarouselSlider } from '../_molecules/slider'

const ReferenceComponent = ({ referenceImages, titleContent }) => {
  return (
    <div className="flex flex-col items-center text-center my-4">
        <Header3 className="text-xl font-semibold mb-4">
          {titleContent.title}
        </Header3>

        <CarouselSlider itemsPerSlide={8} showDots={true}>
        {referenceImages?.map((image) => (
          <div key={image?.id} className="mt-8 p-6">
            <LogoImage key={image?.id} imageLink={`/${image.link}`} width={250} height={250} />
          </div>
        ))}
      </CarouselSlider>
      </div>
  )
}

export default ReferenceComponent