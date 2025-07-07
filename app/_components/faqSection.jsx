"use client";
import { useState } from "react";
import { AccordionSection } from "../_molecules/accordionSection";
import { ShowMoreButton } from "../_atoms/showMoreButton";
import { Header2 } from "../_atoms/Headers";

export const FAQSection = ({ faqData, titleContent }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleCount = 3;

  const visibleFaqs = showAll ? faqData : faqData?.slice(0, visibleCount);
  const hiddenCount = faqData?.length - visibleCount;

  return (
    <section className="w-full mx-20 py-20">
      <Header2 className="text-2xl font-bold mb-6 text-center">
        {titleContent?.title}
      </Header2>

      <div className="space-y-0 border rounded-2xl shadow-lg bg-white p-7">
        {visibleFaqs?.map((faq, index) => {
          const links = faq?.text;
          const linkColor = "black";

          return (
            <div
              key={index}
              className="border-t border-b border-gray-200 px-4 py-3"
            >
              <AccordionSection
                title={faq?.title}
                links={links}
                linkColor={linkColor}
              />
            </div>
          );
        })}

        <div className="text-center border-t border-gray-200 pt-4">
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
