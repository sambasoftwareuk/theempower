import { SambaLinks } from "../_atoms/SambaLinks";
import Icon from "../_atoms/Icon";
import { Globe, Plus } from "../_atoms/Icons";
import { LogoImage } from "../_atoms/images";
import { AccordionSection } from "../_molecules/accordionSection";
import { Header2, Header3 } from "../_atoms/Headers";
import { BaseButton } from "../_atoms/buttons";
import { getAllSections } from "@/lib/queries";

export async function Footer() {
  const sections = await getAllSections("en");

  return (
    <footer className="text-white text-[16px]">
      <div className="bg-gray-800 text-[16px] text-gray-300 py-4 px-6 text-center border-b border-gray-700">
        <span className="font-semibold text-white">Choose </span>
        <SambaLinks color="sunshine" className="font-semibold">
          The Empower
        </SambaLinks>{" "}
        build your future without borders.
      </div>

      <div className="bg-gray-900">
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

      <div className="bg-gray-950 border-t border-gray-700 py-6 px-6">
        <ul className="space-y-1">
          {[
            "Frequently asked questions",
            "Events",
            "Latest Updates & News",
            "Success Stories",
            "Application Guide & Documents",
            "Useful Sources & Links",
            "Guides & Tools",
            "Workshops & Support Sessions",
            "Contact us",
            "Blog",
            "Investors",
          ].map((text, i) => (
            <li key={i}>
              <SambaLinks color="white" underline="hover">
                {text}
              </SambaLinks>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-white w-full" />

      <div className="bg-gray-950 w-full text-sm text-white py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <LogoImage imageLink="/logo.jpg" />
            <span>
              © {new Date().getFullYear()} The Empower, Inc. All rights
              reserved.
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon variant={Globe} size={12} color="text-white" />
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
