"use client";
import { useRef } from "react";
import aboutSections from "../mocks/aboutdata.json";
import { Header1, Header2 } from "../_atoms/Headers";
import SideMenu from "../_molecules/SideMenu";
import useActiveSection from "../hooks/useActiveSection";

export default function AboutPage() {
  const sectionRefs = useRef({});
  const activeSection = useActiveSection(sectionRefs);

  const handleMenuClick = (id) => {
    sectionRefs.current[id].scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mb-10">
      <Header1 className="text-4xl font-bold mt-10 mb-12 text-center">
        About Us
      </Header1>

      <div className="flex gap-10">
        {/* LEFT MENU */}
        <SideMenu
          title="About Us"
          sections={aboutSections}
          activeSection={activeSection}
          onClick={handleMenuClick}
        />

        {/* CONTENT */}
        <div className="flex-1 space-y-24">
          {aboutSections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className="scroll-mt-24"
            >
              <Header2>{section.title}</Header2>
              <p className="text-gray-700 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
