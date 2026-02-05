import FooterSection from "../_molecules/FooterSection";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAllSections } from "@/lib/queries";
import { getUserContentGroups } from "@/lib/permissions";
import { canAccessPanel } from "@/lib/roleUtils";

export default async function Panel() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
  const client = await clerkClient();
  const membershipsResponse = await client.users.getOrganizationMembershipList({ userId: user.id });
  const empowerMembership = membershipsResponse.data?.find(
    (m) => m.organization?.name === "theempower" || m.organization?.slug?.startsWith("theempower")
  );
  const orgRole = empowerMembership?.role ?? null;
  if (!canAccessPanel(orgRole)) {
    redirect("/");
  }

  const sections = await getAllSections("en");
  const allowedGroupIds = await getUserContentGroups(user.id);

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
