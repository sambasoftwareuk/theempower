"use client";

import { usePageEdit } from "../context/PageEditProvider";
import { SignedIn } from "@clerk/nextjs";
import { useState } from "react";

export default function SaveAllButton({ className = "" }) {
  const { isDirty, saveAll, saving } = usePageEdit();
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!isDirty) return;
    setError("");
    try {
      await saveAll();
    } catch (e) {
      setError(e.message || "Kaydetme başarısız");
    }
  };

  return (
    <SignedIn>
      <div className={`${className}`}>
        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
        <button
          onClick={handleSave}
          disabled={saving || !isDirty}
          className={`px-4 py-2 text-lg rounded focus:outline-none transition-colors ${
            isDirty
              ? "bg-primary hover:bg-primary900 text-white"
              : "bg-secondary400 text-white cursor-not-allowed"
          } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {saving ? "Kaydediliyor..." : "Save All"}
        </button>
      </div>
    </SignedIn>
  );
}
