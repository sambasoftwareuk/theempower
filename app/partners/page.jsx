import React from "react";
import referenceImages from "../mocks/referenceImages.json";
import ReferenceComponent from "../_components/referanceComponent";
import { Header1 } from "../_atoms/Headers";
import { Breadcrumb } from "../_atoms/breadcrumb";

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-center py-12 px-4">
      <Breadcrumb items={[{ label: "Partners", href: "#" }]} />
      <Header1 className="text-3xl font-bold mb-10">Partners</Header1>

      <ReferenceComponent
        referenceImages={referenceImages}
        variant="page"
        titleContent={null}
      />
    </div>
  );
}

