"use client";
import React, { useState } from "react";
import { SambaLinks } from "../_atoms/SambaLinks";
import Icon from "../_atoms/Icon";
import { Globe } from "../_atoms/Icons";
import { footerData } from "../mocks/footerData";
import { LogoImage } from "../_atoms/images";

export function Footer() {
  const [openIndexes, setOpenIndexes] = useState({});
  const toggle = (index) => {
    setOpenIndexes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <footer className="text-white text-[16px]">
      <div className="bg-gray-800 text-[16px] text-gray-300 py-4 px-6 text-center border-b border-gray-700">
        <span className="font-semibold text-white">Top companies</span> choose{" "}
        <SambaLinks color="sunshine" className="font-semibold">
          Samba Business
        </SambaLinks>{" "}
        to build in-demand career skills.
      </div>

      <div className="bg-gray-900">
        <div className="py-10 px-6 max-w-7xl mx-auto">
          <h2 className="text-base font-semibold mb-6">
            Explore top skills and certifications
          </h2>

          <div className="hidden md:grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {footerData.map((section, i) => (
              <div key={i}>
                <h3 className="font-semibold mb-2 tracking-wide text-[16px]">
                  {section.title}
                </h3>
                <ul className="space-y-1 text-[16px]">
                  {section.links.map((text, j) => (
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
              <div key={i}>
                <button
                  className="w-full text-left py-2 font-semibold text-[16px] flex justify-between items-center"
                  onClick={() => toggle(i)}
                >
                  {section.title}
                  <span className="text-lg">{openIndexes[i] ? "˄" : "˅"}</span>
                </button>

                {openIndexes[i] && (
                  <ul className="space-y-1 text-[16px] pb-4">
                    {section.links.map((text, j) => (
                      <li key={j}>
                        <SambaLinks color="white" underline="hover">
                          {text}
                        </SambaLinks>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-950 border-t border-gray-700 py-6 px-6">
        <div>
          <h3 className="font-semibold mb-2">About</h3>
          <ul className="space-y-1">
            {["About us", "Careers", "Contact us", "Blog", "Investors"].map(
              (text, i) => (
                <li key={i}>
                  <SambaLinks color="white" underline="hover">
                    {text}
                  </SambaLinks>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white w-full" />

      <div className="bg-gray-950 w-full text-sm text-white py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <LogoImage imageLink="/logo.jpg" width={50} height={20} />
            <span>
              © {new Date().getFullYear()} SambaAcademy, Inc. All rights
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
