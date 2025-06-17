import React from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "../_atoms/Icon";
import {
  OutlinedButton,
  IconOnlyButton,
  PrimaryButton,
  OutlinedButtonWithIcon,
} from "../_atoms/buttons";
import { InputWithIconStart } from "../_atoms/inputs";
import { Cart, Search, Globe, HamburgerIcon } from "../_atoms/Icons";
import navLinks from "../constants/navLinks";
import { LogoImage } from "../_atoms/images";

const Navbar = () => {
  return (
    <header className="w-full border-b bg-white shadow-sm">
      <nav className="flex items-center justify-between px-4 md:px-8 py-3 gap-2 max-w-full">
        {/* Hamburger Menu */}
        {/* <div className="flex md:hidden">
          <IconOnlyButton icon={<Icon variant={HamburgerIcon} size={25} />} />
        </div> */}

        <div className=" flex items-center flex-shrink-0 ">
          <Link href="/">
            <LogoImage imageLink="/empower-logo.png" width={200} height={40} />
          </Link>

          {/* Desktop  */}
          <OutlinedButton
            label="Explore"
            className="hidden lg:flex border-0 text-xs text-secondary400 hover:text-primary900  transition-colors duration-200"
          />
        </div>

        {/* Icons for small screens */}
        {/* <div className="flex items-center gap-0  md:hidden">
          <IconOnlyButton icon={<Icon variant={Search} size={20} />} />
          <IconOnlyButton icon={<Icon variant={Cart} size={20} />} />
        </div> */}

        {/* Search Input for Desktop */}
        <div className="hidden md:flex flex-grow max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px] w-full px-4">
          <InputWithIconStart
            placeholder="Search..."
            icon={Search}
            className="py-1"
          />
        </div>
        {/* Right Section */}
        <div className="hidden md:flex items-center gap-2 ">
          {navLinks.map(({ label, href, className }) => (
            <Link
              key={label}
              href={href}
              className={`p-3 text-xs font-medium whitespace-nowrap bg-transparent text-secondary400 hover:text-primary900 hover:bg-primary50 rounded-sm transition-colors duration-200 ${className}`}
            >
              {label}
            </Link>
          ))}
          <IconOnlyButton icon={<Icon variant={Cart} size={20} />} />
          <PrimaryButton label="Login" />
          <OutlinedButton
            className="whitespace-nowrap text-primary900"
            label="Sign Up"
          />
          <OutlinedButtonWithIcon
            className="py-2.5 px-1.5 "
            icon={<Icon variant={Globe} size={20} color="text-secondary " />}
          />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
