"use client";
import Link from "next/link";
import {
  OutlinedButton,
  IconOnlyButton,
  PrimaryButton,
  OutlinedButtonWithIcon,
  BaseButton,
} from "../_atoms/buttons";
import { InputWithIconStart } from "../_atoms/inputs";
import { Search } from "../_atoms/Icons";
import navLinks from "../constants/navLinks";
import { LogoImage } from "../_atoms/images";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useI18n, useCurrentLocale, useChangeLocale } from "@/locales/client";

const Navbar = () => {
  const pathname = usePathname();
  const t = useI18n();
  const locale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  return (
    <header className="w-full border-b bg-white shadow-sm">
      <nav className="flex items-center justify-between px-4 md:px-8 py-3 gap-2 max-w-full">
        {/* Hamburger Menu */}
        {/* <div className="flex md:hidden">
          <IconOnlyButton icon={<Icon variant={HamburgerIcon} size={25} />} />
        </div> */}

        <div className=" flex items-center flex-shrink-0 ">
          <Link href="/">
            <LogoImage imageLink="/empower-beta.png" width={200} height={40} />
          </Link>
        </div>

        {/* Icons for small screens */}
        {/* <div className="flex items-center gap-0  md:hidden">
          <IconOnlyButton icon={<Icon variant={Search} size={20} />} />
          <IconOnlyButton icon={<Icon variant={Cart} size={20} />} />
        </div> */}

        {/* Search Input for Desktop */}
        <div className="hidden md:flex flex-grow max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px] w-full px-4">
          <InputWithIconStart
            placeholder={t("searchPlaceholder")}
            icon={Search}
            className="py-1"
          />
        </div>
        {/* Right Section */}
        <div className="hidden md:flex items-center gap-2 ">
          <button
            type="button"
            onClick={() => changeLocale("en")}
            aria-label="English"
            className={
              locale === "en" ? "opacity-100 border-b-2" : "opacity-60"
            }
          >
            🇬🇧
          </button>
          <button
            type="button"
            onClick={() => changeLocale("tr")}
            aria-label="Türkçe"
            className={
              locale === "tr" ? "opacity-100 border-b-2" : "opacity-60"
            }
          >
            🇹🇷
          </button>
          {navLinks.map(({ key, href, className }) => (
            <Link
              key={key}
              href={
                key === "faq"
                  ? pathname === `/${locale}` || pathname === `/${locale}/`
                    ? "#faq"
                    : `/${locale}#faq`
                  : href === "/"
                    ? `/${locale}`
                    : `/${locale}${href}`
              }
              className={`p-3 text-xs font-medium whitespace-nowrap bg-transparent text-secondary400 hover:text-primary900 hover:bg-primary50 rounded-sm transition-colors duration-200 ${className}`}
            >
              {t(key)}
            </Link>
          ))}

          {/* Show when signed in */}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
