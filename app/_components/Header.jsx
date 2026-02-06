// app/components/Header.tsx (SERVER component)
import { getAllSections } from "@/lib/queries";
import HamburgerMenu from "./hamburgerMenu";

export default async function Header() {
  const sections = await getAllSections("en");

  return <HamburgerMenu sections={sections} />;
}
