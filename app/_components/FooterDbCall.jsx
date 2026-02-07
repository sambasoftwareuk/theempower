import { getAllSections } from "@/lib/queries";
import React from "react";
import { Footer } from "./footer";

export default async function FooterDbCall() {
  const sections = await getAllSections("en");

  return <Footer sections={sections} />;
}
