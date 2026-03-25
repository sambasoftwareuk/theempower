import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/roleUtils";
import { PendingCommentsList } from "./PendingCommentsList";
import { Breadcrumb } from "@/app/_atoms/breadcrumb";
export default async function PanelCommentsPage() { 
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
    if (!isAdmin(orgRole)) {
        redirect("/");
    }
    return <div className="p-8">
<Breadcrumb items={[{ label: "Admin Panel", href: "/adminpanel" }, { label: "Moderate comments", href: "#" }]} />

        <PendingCommentsList />
    </div>
 }