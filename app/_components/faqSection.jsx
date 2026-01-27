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
    <section
      id="faq"
      className="w-full py-8 bg-[#E4F6FD]"
    >
      <div className="flex text-center justify-center mb-10">
        <Header2 className="text-3xl font-bold">{titleContent?.title}</Header2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-3/5 mx-auto">
        {visibleFaqs?.map((faq, index) => {
          const links = faq?.text;
          const linkColor = "secondary400";
          const isLast = index === visibleFaqs.length - 1;

          return (
            <div
              key={faq.title}
              className={`px-6 py-4 transition-colors duration-200 hover:bg-primary hover:text-white ${
                !isLast ? "border-b border-gray-200" : ""
              }`}
            >
              <AccordionSection
                title={faq?.title}
                links={links}
                linkColor={linkColor}
              />
            </div>
          );
        })}

        <div className="text-center border-t border-gray-200 pt-6 pb-6 bg-gray-50">
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
