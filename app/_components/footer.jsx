"use client";

import { usePathname } from "next/navigation";
import Icon from "../_atoms/Icon";
import { Globe } from "../_atoms/Icons";
import { LogoImage } from "../_atoms/images";
import { SambaLinks } from "../_atoms/SambaLinks";
import FooterSection from "../_molecules/FooterSection";
import QuestionsSection from "../_molecules/QuestionsSection";

export function Footer({ sections }) {
  const pathname = usePathname();

  if (pathname === "/panel") {
    return null;
  }

  return (
    <footer className="text-white text-[16px]">
      <div className="bg-gray-800 text-[16px] text-gray-300 py-4 px-6 text-center border-b border-gray-700">
        <span className="font-semibold text-white">Choose </span>
        <SambaLinks color="sunshine" className="font-semibold">
          The Empower
        </SambaLinks>{" "}
        build your future without borders.
      </div>

      <FooterSection sections={sections} isPanel={false} />
      <QuestionsSection />

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
