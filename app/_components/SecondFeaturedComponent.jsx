import { getFeaturedSlotWithContents } from '@/lib/queries';
import React from 'react'
import LearningPathwayComponent from './learningPathwayComponent';

export default async function SecondFeaturedComponent () {
  const secondFeaturedData = await getFeaturedSlotWithContents(2, "en", {
    limit: 3,
  });
    return (
    <LearningPathwayComponent
        careers={secondFeaturedData?.items ?? []}
        titleContent={{
          title: secondFeaturedData?.title ?? "",
          subtitle: secondFeaturedData?.subtitle ?? "",
          buttonText: secondFeaturedData?.cta_label ?? ""
        }}
        link={secondFeaturedData?.cta_link ?? ""}
      />
  )
}

