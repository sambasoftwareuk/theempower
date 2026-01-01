import { SambaLinks } from "../_atoms/SambaLinks";
import Icon from "../_atoms/Icon";
import { Plus } from "../_atoms/Icons";
import footerData from "../mocks/footerData";
import { AccordionSection } from "../_molecules/accordionSection";
import { Header2, Header3 } from "../_atoms/Headers";
import { BaseButton } from "../_atoms/buttons";

const FooterSection = ({ showPlusButtons = false }) => {
  return (
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

              {showPlusButtons && (
                <div className="flex justify-center mt-6 w-1/2">
                  <BaseButton
                    className="
                                 w-20 h-20
                                 flex items-center justify-center
                                 bg-gradient-to-br from-primary to-primary500
                                 rounded-full
                                 text-white
                                 shadow-lg
                                 hover:scale-110
                                 hover:shadow-2xl
                                 transition-transform duration-300 ease-in-out
                               "
                    aria-label={`Add new item to ${section?.subTitles}`}
                  >
                    <Icon variant={Plus} size={36} className="animate-pulse" />
                  </BaseButton>
                </div>
              )}
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
  );
};

export default FooterSection;
