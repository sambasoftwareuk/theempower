"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SambaLinks } from "../_atoms/SambaLinks";
import { AccordionSection } from "../_molecules/accordionSection";
import { Header2, Header3 } from "../_atoms/Headers";
import { toast } from "sonner";
import TitleModal from "./TitleModal";
import FooterSectionCard from "./FooterSectionCard";

export default function FooterSection({
  sections,
  isPanel = false,
  bgColor = "bg-gray-900",
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [value, setValue] = useState("");

  const displaySections =
    pathname === "/panel"
      ? sections
      : sections.filter(
          (section) => section.subtitles && section.subtitles.length > 0,
        );

  async function handleSave() {
    if (!value.trim()) {
      toast.warning("Subtitle cannot be empty");
      return;
    }

    const request = fetch("/api/content-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupId: activeSection.id,
        title: value,
        locale: "en",
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }
      return res.json();
    });

    toast.promise(request, {
      loading: "Saving subtitle...",
      success: `Subtitle added to "${activeSection.title}" 🎉`,
      error: (err) => err.message || "Something went wrong ❌",
    });

    await request;
    setOpen(false);
    setActiveSection(null);
    setValue("");
    router.refresh();
  }

  // ----------------------------
  // Delete subtitle
  // ----------------------------

  async function handleDelete(subtitle) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${subtitle.title}"? This will remove all related content.`,
    );
    if (!confirmed) return;

    try {
      const request = fetch(`/api/content-items/${subtitle.id}`, {
        method: "DELETE",
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Delete failed");
        }
        return res.json();
      });

      toast.promise(request, {
        loading: "Deleting subtitle...",
        success: `"${subtitle.title}" has been deleted ✅`,
        error: (err) => err.message || "Failed to delete ❌",
      });

      await request;
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  // Panel için açık renkli tasarım
  if (isPanel) {
    return (
      <div className="bg-secondary100 min-h-screen">
        <div className="py-12 px-6 max-w-7xl mx-auto">
          <Header2 className="mb-8 text-secondary text-center">
            Explore top skills and certifications
          </Header2>

          {/* Large screens - Card Grid */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySections.map((section) => {
              return (
                <FooterSectionCard
                  key={section.id}
                  section={section}
                  variant="desktop"
                  onDelete={handleDelete}
                  onAdd={(sec) => {
                    setActiveSection(sec);
                    setOpen(true);
                  }}
                />
              );
            })}
          </div>

          {/* Small screens - Cards */}
          <div className="md:hidden space-y-4">
            {displaySections.map((section) => {
              return (
                <FooterSectionCard
                  key={section.id}
                  section={section}
                  variant="mobile"
                  onDelete={handleDelete}
                  onAdd={(sec) => {
                    setActiveSection(sec);
                    setOpen(true);
                  }}
                />
              );
            })}
          </div>

          {/* Modal - Tek bir modal tüm kartlar için */}
          <TitleModal
            isOpen={open}
            onClose={() => {
              setOpen(false);
              setActiveSection(null);
              setValue("");
            }}
            title={`Add new subtitle to "${activeSection?.title}"`}
            inputValue={value}
            onInputChange={(e) => setValue(e.target.value)}
            onSave={handleSave}
            placeholder="Subtitle title"
          />
        </div>
      </div>
    );
  }

  // Normal footer için modern grid tasarım (koyu tema)
  return (
    <div className={bgColor}>
      <div className="py-8 px-6 max-w-7xl mx-auto">
        <Header2 className="mb-6 text-white">
          Explore top skills and certifications
        </Header2>

        {/* Large screens - Modern Grid Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displaySections.map((section) => (
              <div key={section.id} className="group">
                <Header3 className="mb-1 tracking-wide text-[16px] text-white font-semibold">
                  {section.title}
                </Header3>

                <ul className="space-y-0.5">
                  {section.subtitles.map((item) => (
                    <li key={item.slug}>
                      <SambaLinks
                        href={`/content/${item.slug}`}
                        color="secondary200"
                        underline="hover"
                        className="block py-0.5 px-3 rounded-lg hover:bg-secondary400 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {item.title}
                      </SambaLinks>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Small screens - Accordion */}
        <div className="md:hidden divide-y divide-gray-700">
          {sections.map((section) => (
            <AccordionSection
              key={section.id}
              title={section.title}
              links={section.subtitles}
              variant="flat"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
