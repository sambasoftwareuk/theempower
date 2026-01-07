import FooterSection from "../_molecules/FooterSection";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAllSections } from "@/lib/queries";

export default async function Panel() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const sections = await getAllSections("en");

  return (
    <FooterSection
      sections={sections}
      isPanel={true}
      bgColor="bg-panel"
      textColor="#0C1B33"
    />
  );
}
