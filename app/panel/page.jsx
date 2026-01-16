import FooterSection from "../_molecules/FooterSection";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAllSections } from "@/lib/queries";
import { getUserContentGroups } from "@/lib/permissions";

export default async function Panel() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const sections = await getAllSections("en");
  const allowedGroupIds = await getUserContentGroups(userId);

  const filteredSections = sections.filter(section => 
    allowedGroupIds.includes(section.id)
  );

  return (
    <FooterSection
      sections={filteredSections}
      isPanel={true}
      bgColor="bg-secondary100"
    />
  );
}
