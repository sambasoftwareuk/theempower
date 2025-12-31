import { SambaLinks } from "../_atoms/SambaLinks";
import Icon from "../_atoms/Icon";
import { Globe } from "../_atoms/Icons";
import footerData from "../mocks/footerData";
import { LogoImage } from "../_atoms/images";
import { AccordionSection } from "../_molecules/accordionSection";
import { Header2, Header3 } from "../_atoms/Headers";

const FooterSection = () => {
  return (
    <div>
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

          <div className="hidden md:grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {footerData.map((section, i) => (
              <div key={i}>
                <Header3 className="mb-2 tracking-wide text-[16px] text-white">
                  {section?.title}
                </Header3>
                <ul className="space-y-0 text-[16px]">
                  {section?.subTitles?.map((text, j) => (
                    <li key={j}>
                      <SambaLinks color="white" underline="hover">
                        {text}
                      </SambaLinks>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="md:hidden divide-y divide-gray-700">
            {footerData.map((section, i) => (
              <AccordionSection
                key={i}
                title={section?.title}
                links={section?.links}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-950 border-t border-gray-700 py-6 px-6">
        <div>
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
    </div>
  )
}

export default FooterSection