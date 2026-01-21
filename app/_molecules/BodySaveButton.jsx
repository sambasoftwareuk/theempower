"use client";

import { usePageEdit } from "../context/PageEditProvider";
import { PrimaryButton } from "../_atoms/buttons";
import { SignedIn } from "@clerk/nextjs";

export default function BodySaveButton() {
  const { isBodyDirty, saveBody, savingBody, hasPermission, permissionLoaded } = usePageEdit();

  // Yetkiler yüklenene kadar veya yetkisi yoksa hiçbir şey gösterme
  if (!permissionLoaded || !hasPermission) {
    return null;
  }

  return (
    <SignedIn>
      <PrimaryButton
        label={savingBody ? "Saving..." : "Save"}
        onClick={saveBody}
        disabled={savingBody || !isBodyDirty}
        className={`px-8 py-3 text-lg transition-all ${
          isBodyDirty
            ? "bg-primary900 hover:bg-primary800 text-white"
            : "bg-secondary400 text-gray-600 cursor-not-allowed opacity-60"
        }`}
      />
    </SignedIn>
  );
}
