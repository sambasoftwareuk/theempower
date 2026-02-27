export const dynamic = "force-dynamic";
import { Geist, Geist_Mono, Merriweather } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/navbar";
import HamburgerMenu from "./_components/hamburgerMenu";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { FixedAddButton } from "./_components/FixedAddButton";
import FooterDbCall from "./_components/FooterDbCall";
import Header from "./_components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"], // Burada hatayı düzelttik
});

export const metadata = {
  title: "The Empower",
  description: "Empowering People for Outreach, Welfare, Employment, and Resilience",
  icons: {
    icon:"/icon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${merriweather.variable} antialiased`}
        >
          <div className="hidden md:block">
            <Navbar />
          </div>
          <div className="block md:hidden">
            <Header />
          </div>

          <main>{children}</main>
          <FooterDbCall />
          <FixedAddButton />
          {/* 🔔 Sonner Toaster */}
          <Toaster position="top-right" richColors closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
