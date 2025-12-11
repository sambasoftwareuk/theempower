"use client";

import { usePageEdit } from "../context/PageEditProvider";
import { SignedIn } from "@clerk/nextjs";
import { useState, useCallback } from "react";
import { PrimaryButton } from "../_atoms/buttons";

export default function SaveAllButton({ className = "" }) {
  const { isDirty, saveAll, saving } = usePageEdit();
  const [error, setError] = useState("");

  const handleSave = useCallback(async () => {
    if (!isDirty || saving) return;
    setError("");
    try {
      await saveAll();
    } catch (e) {
      setError(e.message || "Save failed");
    }
  }, [isDirty, saving, saveAll]);

  return (
    <SignedIn>
      <div className={`${className}`}>
        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
        <PrimaryButton
          label={saving ? "Saving..." : "Save"}
          onClick={handleSave}
          disabled={saving || !isDirty}
          className={`text-lg ${
            isDirty
              ? ""
              : "bg-secondary400 text-white cursor-not-allowed hover:bg-secondary400"
          } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      </div>
    </SignedIn>
  );
}
