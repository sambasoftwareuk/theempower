"use client";

import { I18nProviderClient } from "@/locales/client";

export default function LocaleProvider({ locale, children }) {
  return (
    <I18nProviderClient locale={locale} fallback={null}>
      {children}
    </I18nProviderClient>
  );
}