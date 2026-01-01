import FooterSection from "../_molecules/FooterSection";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAllSections } from "@/lib/queries";

export default async function FooterPanel() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const sections = await getAllSections("en");

  return <FooterSection sections={sections} showPlusButtons={true} bgColor="bg-secondary400" />;
}
