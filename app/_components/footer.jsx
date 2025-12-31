"use client";

import FooterSection from "../_molecules/FooterSection";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export function Footer() {
  return (
    <footer className="text-white text-[16px]">
      <SignedOut>
        <FooterSection bgColor="bg-gray-900" />
      </SignedOut>
      <SignedIn>
        <FooterSection bgColor="bg-secondary400" />
      </SignedIn>
    </footer>
  );
}
