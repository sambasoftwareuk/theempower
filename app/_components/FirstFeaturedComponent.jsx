import { getFeaturedSlotWithContents } from '@/lib/queries';
import React from 'react'
import LearningPathwayComponent from './learningPathwayComponent';



export default async function  FirstFeaturedComponent () {
    const firstFeaturedData = await getFeaturedSlotWithContents(1, "en", {
        limit: 3,
      });
  return (
    <LearningPathwayComponent
        careers={firstFeaturedData?.items ?? []}
        titleContent={{
          title: firstFeaturedData?.title ?? [],
          subtitle: firstFeaturedData?.subtitle ?? [],
          buttonText: firstFeaturedData?.cta_label ?? []
        }}
        link={firstFeaturedData?.cta_link ?? []}
      />
  )
}

