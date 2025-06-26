"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "../_atoms/Icon";
import { IconOnlyButton } from "../_atoms/buttons";
import { Cart, Search, HamburgerIcon, LineXIcon } from "../_atoms/Icons";
import { AccordionSection } from "../_molecules/accordionSection";
import links from "../constants/hamburgerLinks.json";
import { SambaLinks } from "../_atoms/SambaLinks";

const hamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { topLinks, exploreLinks, popularLinks, navLinks } = links;

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
          <div className=" flex justify-end">
            <IconOnlyButton
              icon={<LineXIcon />}
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            {topLinks.map((link, index) => (
              <SambaLinks key={index} className="hover:bg-primary50">
                {link.label}
              </SambaLinks>
            ))}
            <hr className="border-b-2 border-gray-200 my-4" />
            <div>
              <h3 className="font-bold">Most Popular </h3>
              {popularLinks.map((link, index) => (
                <AccordionSection
                  key={index}
                  title={link.title}
                  links={link.links}
                  linkColor={"black"}
                  className="hover:bg-primary50"
                />
              ))}
            </div>

            <hr className="border-b-2 border-gray-200 my-4" />
            <div>
              <h3 className="font-bold">Explore </h3>
              {navLinks.map((section, index) => (
                <AccordionSection
                  key={index}
                  title={section.title}
                  links={section.links}
                  linkColor={"black"}
                  className="hover:bg-primary50"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default hamburgerMenu;
