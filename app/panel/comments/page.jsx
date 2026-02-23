import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/roleUtils";
import { PendingCommentsList } from "./PendingCommentsList";
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
        <PendingCommentsList />
    </div>
 }