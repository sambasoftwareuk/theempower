import { clerkMiddleware } from "@clerk/nextjs/server";
import { createI18nMiddleware } from "next-international/middleware";
import { NextResponse } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "tr"],
  defaultLocale: "en",
});

export default clerkMiddleware(async (_auth, req) => {
  if (!req.nextUrl.pathname.startsWith("/api")) {
    const i18nResponse = I18nMiddleware(req);
    if (i18nResponse) return i18nResponse;
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/api(.*)",
  ],
};