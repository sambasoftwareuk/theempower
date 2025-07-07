"use client";
import { useState } from "react";
import { AccordionSection } from "./accordionSection";
import { ShowMoreButton } from "../_atoms/showMoreButton";

export const FAQSection = ({ faqData, titleContent }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleCount = 3;

  const visibleFaqs = showAll ? faqData : faqData?.slice(0, visibleCount);
  const hiddenCount = faqData?.length - visibleCount;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-10">
  <h2 className="text-3xl font-bold mb-6 text-center">
    {titleContent?.title}
  </h2>

  <div className="space-y-4 w-full">
    {visibleFaqs?.map((category, index) => (
      <AccordionSection
        key={index}
        title={category?.title}
        childrenData={category?.questions}
      />
    ))}

    <div className="text-center">
      {hiddenCount > 0 && (
        <ShowMoreButton
          showAll={showAll}
          hiddenCount={hiddenCount}
          onClick={() => setShowAll(!showAll)}
        />
      )}
    </div>
  </div>
</section>

  );
};
