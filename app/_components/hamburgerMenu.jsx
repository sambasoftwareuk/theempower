"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "../_atoms/Icon";
import { IconOnlyButton } from "../_atoms/buttons";
import { Search, HamburgerIcon, LineXIcon } from "../_atoms/Icons";
import { AccordionSection } from "../_molecules/accordionSection";
import navLinks from "../constants/navLinks.json";
import { SambaLinks } from "../_atoms/SambaLinks";
import { LogoImage } from "../_atoms/images";
import { SignedIn, UserButton } from "@clerk/nextjs";

const hamburgerMenu = ({ sections }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filteredSections = sections.filter(
    (section) => section.subtitles && section.subtitles.length > 0
  );

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between  py-3 gap-2">
        <div>
          <IconOnlyButton
            onClick={() => setIsOpen((prev) => !prev)}
            icon={<Icon variant={HamburgerIcon} size={25} />}
          />
        </div>
        <Link href="/">
          <LogoImage imageLink="/empower-logo.png" width={120} />
        </Link>
        <div className="flex items-center gap-0">
          <IconOnlyButton icon={<Icon variant={Search} size={20} />} />
        </div>
      </div>
      {/* Slide-over menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white p-4 overflow-y-auto">
          <div className=" flex justify-end">
            <IconOnlyButton
              icon={<LineXIcon />}
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            {navLinks.map((link, index) => (
              <SambaLinks
                key={index}
                href={link.href}
                className="hover:bg-primary50"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </SambaLinks>
            ))}

            {/* Auth Section */}
            <SignedIn>
              <div className="py-4 flex justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <hr className="border-b-2 border-gray-200 my-4" />
            <div>
              {filteredSections.map((link, index) => (
                <AccordionSection
                  key={index}
                  title={link?.title}
                  links={link?.subtitles}
                  linkColor={"black"}
                  variant="flat"
                  onLinkClick={() => setIsOpen(false)}
                />
              ))}
            </div>

            <hr className="border-b-2 border-gray-200 my-4" />
          </div>
        </div>
      )}
    </>
  );
};

export default hamburgerMenu;
