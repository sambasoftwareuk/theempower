import React from "react";
import { SambaLinks } from "../_atoms/SambaLinks";
import Icon from "../_atoms/Icon";
import { Globe } from "../_atoms/Icons";

const footerData = [
  {
    title: "In-demand Careers",
    links: [
      "Data Scientist",
      "Full Stack Web Developer",
      "Cloud Engineer",
      "Project Manager",
      "Game Developer",
      "See all Career Paths",
    ],
  },
  {
    title: "Web Development",
    links: ["Web Development", "JavaScript", "React JS", "Angular", "Java"],
  },
  {
    title: "IT Certifications",
    links: [
      "Amazon AWS",
      "AWS Certified Cloud Practitioner",
      "Azure Fundamentals (AZ-900)",
      "AWS Solutions Architect - Associate",
      "Kubernetes",
    ],
  },
  {
    title: "Leadership",
    links: [
      "Leadership",
      "Management Skills",
      "Project Management",
      "Personal Productivity",
      "Emotional Intelligence",
    ],
  },
  {
    title: "Certifications by Skill",
    links: [
      "Cybersecurity Certification",
      "Project Management Certification",
      "Cloud Certification",
      "Data Analytics Certification",
      "HR Management Certification",
      "See all Certifications",
    ],
  },
  {
    title: "Data Science",
    links: [
      "Data Science",
      "Python",
      "Machine Learning",
      "ChatGPT",
      "Deep Learning",
    ],
  },
  {
    title: "Communication",
    links: [
      "Communication Skills",
      "Presentation Skills",
      "Public Speaking",
      "Writing",
      "PowerPoint",
    ],
  },
  {
    title: "Business Analytics & Intelligence",
    links: [
      "Microsoft Excel",
      "SQL",
      "Microsoft Power BI",
      "Data Analysis",
      "Business Analysis",
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="bg-gray-800 text-[10px] text-gray-300 py-3 px-4 text-center border-b border-gray-700">
        <span className="font-semibold text-white">Top companies</span> choose{" "}
        <SambaLinks color="sunshine" className="font-semibold">
          Samba Business
        </SambaLinks>{" "}
        to build in-demand career skills.
      </div>

      <div className="py-10 px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {footerData.map((section, i) => (
            <div key={i}>
              <h3 className="text-[10px] font-semibold mb-2 tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-1 text-[9px]">
                {section.links.map((text, j) => (
                  <li key={j}>
                    <SambaLinks
                      color="white"
                      underline="hover"
                      className="text-[9px]"
                    >
                      {text}
                    </SambaLinks>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 px-4 flex items-center justify-between text-[9px] text-white max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Samba Logo" className="h-4" />
            <span>© {new Date().getFullYear()} SambaAcademy, Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <Icon variant={Globe} size={12} color="text-white" />
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}