"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/locales/client";
import { BaseButton } from "../_atoms/buttons";
import { SignedIn, useUser } from "@clerk/nextjs";
import { canAccessPanel } from "@/lib/roleUtils";

export function FixedAddButton() {
  const pathname = usePathname();
  const t = useI18n();
  const { user, isLoaded } = useUser();
  const empowerMembership = user?.organizationMemberships?.find(membership => membership.organization.name === "theempower" || membership.organization.slug.startsWith("theempower"));

  const orgRole = empowerMembership?.role;

  if (pathname === "/panel") {
    return null;
  }
  if (!isLoaded) {
    return null;
  }
  if (!canAccessPanel(orgRole)){
    return null;
  }
  return (
    <SignedIn>
      <div className="fixed bottom-16 right-16 z-50">
        <Link href="/panel">
          <BaseButton className="bg-primary900 text-white hover:bg-primary shadow-lg rounded-2xl">
            <span className="p-6 text-lg">{t("createNewContent")}</span>
          </BaseButton>
        </Link>
      </div>
    </SignedIn>
  );
}
