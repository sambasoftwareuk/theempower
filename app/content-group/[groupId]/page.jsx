import { notFound } from "next/navigation";
import { getSectionByGroupId } from "@/lib/queries";
import { Breadcrumb } from "@/app/_atoms/breadcrumb";
import { Header1 } from "@/app/_atoms/Headers";
import { CareerCard } from "@/app/_molecules/careerCard";

export default async function ContentGroupPage({ params }) {
  const { groupId } = await params;
  const locale = "en";
  const section = await getSectionByGroupId(groupId, locale);

  if (!section) notFound();

  return (
    <div className="px-4 py-10 mx-auto max-w-7xl">
      <Breadcrumb items={[{ label: section.title, href: "#" }]} />
      <div className="text-center mb-10">
        <Header1>{section.title}</Header1>
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-content-center justify-items-center items-stretch"
      >
        {section.subtitles.map((item) => (
          <CareerCard
            key={item.id}
            slug={item.slug}
            title={item.title}
          />
        ))}
      </div>
    </div>
  );
}