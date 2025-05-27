"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "../_atoms/Icon";
import {
  OutlinedButton,
  IconOnlyButton,
  PrimaryButton,
  OutlinedButtonWithIcon,
} from "../_atoms/buttons";
import { Cart, Search, Globe, HamburgerIcon, LineXIcon } from "../_atoms/Icons";
// import { AccordionSection } from "../_molecules/accordionSection";
import {
  topLinks,
  exploreLinks,
  popularLinks,
  navLinks,
} from "../constants/hamburgerLinks";

const hamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <Image src="/1.png" alt="logo" width={70} height={70} />
        </Link>
        <div className="flex items-center gap-0">
          <IconOnlyButton icon={<Icon variant={Search} size={20} />} />
          <IconOnlyButton icon={<Icon variant={Cart} size={20} />} />
        </div>
      </div>
      {/* Slide-over menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white p-4 overflow-y-auto">
          <div className="mb-4 flex justify-end">
            <IconOnlyButton
              icon={<LineXIcon />}
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            {/* {navLinks.map((section, index) => (
              <AccordionSection
                key={index}
                title={section.title}
                links={section.links}
              />
            ))} */}
          </div>
        </div>
      )}
    </>
  );
};

export default hamburgerMenu;
