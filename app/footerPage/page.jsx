import FooterSection from "../_molecules/FooterSection";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function FooterPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <FooterSection showPlusButtons={true} />;
}
