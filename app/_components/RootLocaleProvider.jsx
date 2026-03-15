"use client";

import { usePathname } from "next/navigation";
import { I18nProviderClient } from "@/locales/client";

const LOCALES = ["en", "tr"];
const DEFAULT_LOCALE = "en";

export default function RootLocaleProvider({ children }) {
  const pathname = usePathname();
  const segment = pathname?.split("/")[1];
  const locale = segment && LOCALES.includes(segment) ? segment : DEFAULT_LOCALE;

  return (
    <I18nProviderClient locale={locale} fallback={null}>
      {children}
    </I18nProviderClient>
  );
}