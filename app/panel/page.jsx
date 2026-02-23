import FooterSection from "../_molecules/FooterSection";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAllSections } from "@/lib/queries";
import { getUserContentGroups } from "@/lib/permissions";
import { canAccessPanel, isAdmin } from "@/lib/roleUtils";
import Link from "next/link";
import { BaseButton } from "../_atoms/buttons";

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
    <div>
      <div className="flex justify-center items-center m-4">

      {isAdmin(orgRole) && <Link href="/panel/comments">
      <BaseButton className="bg-primary900 text-white hover:bg-primary shadow-lg rounded-2xl">
        <span className="p-6 text-lg">Moderate comments</span>
      </BaseButton>
    </Link>}
      </div>
    <FooterSection
      sections={filteredSections}
      isPanel={true}
      bgColor="bg-secondary100"
      />
      </div>
  );
}
