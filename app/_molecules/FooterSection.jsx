"use client";

import { SambaLinks } from "../_atoms/SambaLinks";
import Icon from "../_atoms/Icon";
import { Plus } from "../_atoms/Icons";
import { AccordionSection } from "../_molecules/accordionSection";
import { Header2, Header3 } from "../_atoms/Headers";
import { BaseButton } from "../_atoms/buttons";

export default function FooterSection({ sections, showPlusButtons = false, bgColor = "bg-gray-900" }) {
  return (
    <div className={bgColor}>
      <div className="py-10 px-6 max-w-7xl mx-auto">
        <Header2 className="mb-6 text-white">
          Explore top skills and certifications
        </Header2>

        {/* Large screens */}
        <div className="hidden md:grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {sections.map((section) => (
            <div key={section.id}>
              <Header3 className="mb-2 tracking-wide text-[16px] text-white">
                {section.title}
              </Header3>

              <ul className="space-y-0 text-[16px]">
                {section.subtitles.map((item) => (
                  <li key={item.slug}>
                    <SambaLinks
                      href={`/content/${item.slug}`}
                      color="secondary200"
                    >
                      {item.title}
                    </SambaLinks>
                  </li>
                ))}
              </ul>

              {showPlusButtons && (
                <div className="flex justify-center mt-6 w-1/2">
                  <BaseButton
                    className="
                        w-20 h-20
                        flex items-center justify-center
                        rounded-full
                        bg-gradient-to-br from-primary to-primary500
                        text-black
                        shadow-lg
                        hover:scale-110
                        hover:shadow-2xl
                        transition-transform duration-300 ease-in-out
                      "
                    aria-label={`Add new item to ${section.title}`}
                  >
                    <Icon variant={Plus} size={40} className="animate-pulse" />
                  </BaseButton>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Small screens - Accordion */}
        <div className="md:hidden divide-y divide-gray-700">
          {sections.map((section) => (
            <AccordionSection
              key={section.id}
              title={section.title}
              links={section.subtitles.map((item) => item.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
