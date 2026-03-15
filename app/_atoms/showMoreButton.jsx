"use client";

import { useI18n } from "@/locales/client";

export const ShowMoreButton = ({ showAll, hiddenCount, onClick }) => {
  const t = useI18n();
  if (hiddenCount <= 0) return null;

  return (
    <button
      onClick={onClick}
      className="text-primary hover:underline py-3"
    >
      {showAll ? t("showLess") : t("showMore", { count: hiddenCount })}
    </button>
  );
};
