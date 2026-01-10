"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SambaLinks } from "../_atoms/SambaLinks";
import Icon from "../_atoms/Icon";
import { Plus, Trash } from "../_atoms/Icons";
import { AccordionSection } from "../_molecules/accordionSection";
import { Header2, Header3 } from "../_atoms/Headers";
import { BaseButton } from "../_atoms/buttons";
import { toast } from "sonner";
import TitleModal from "./TitleModal";

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
          (section) => section.subtitles && section.subtitles.length > 0
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
      `Are you sure you want to delete "${subtitle.title}"? This will remove all related content.`
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
                <div
                  key={section.id}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  {/* Başlık */}
                  <Header3 className="text-secondary font-semibold text-lg mb-4">
                    {section.title}
                  </Header3>

                  {/* Subtitle Listesi */}
                  <ul className="space-y-2 text-[15px] flex-1 mb-4">
                    {section.subtitles.map((item) => (
                      <li
                        key={item.slug}
                        className="flex items-start justify-between gap-2 group"
                      >
                        <SambaLinks
                          href={`/content/${item.slug}`}
                          color="secondary400"
                          className="text-gray-600 hover:text-primary transition-colors flex-1"
                        >
                          {item.title}
                        </SambaLinks>
                        <button
                          onClick={() => handleDelete(item)}
                          className="group-hover:opacity-100 text-gray-400 hover:text-ruby transition-opacity duration-200 flex-shrink-0"
                          aria-label={`Delete ${item.title}`}
                        >
                          <Icon variant={Trash} size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Add Button */}
                  <div className="flex justify-center mt-auto pt-4">
                    <BaseButton
                      onClick={() => {
                        setActiveSection(section);
                        setOpen(true);
                      }}
                      className="
                        w-full max-w-[200px]
                        h-10
                        flex items-center justify-center
                        rounded-full
                        bg-gradient-to-r from-primary to-primary500
                        text-white
                        shadow-md
                        hover:shadow-lg
                        hover:scale-[1.02]
                        transition-all duration-300 ease-in-out
                        font-medium
                      "
                      aria-label={`Add new item to ${section.title}`}
                    >
                      <Icon variant={Plus} size={20} className="mr-1" />
                      <span className="text-sm">Add</span>
                    </BaseButton>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Small screens - Cards */}
          <div className="md:hidden space-y-4">
            {displaySections.map((section) => {
              return (
                <div
                  key={section.id}
                  className="bg-white rounded-2xl p-6 shadow-md"
                >
                  {/* Başlık */}
                  <Header3 className="text-secondary font-semibold text-lg mb-4">
                    {section.title}
                  </Header3>

                  {/* Subtitle Listesi */}
                  <ul className="space-y-2 text-[15px] mb-4">
                    {section.subtitles.map((item) => (
                      <li
                        key={item.slug}
                        className="flex items-start justify-between gap-2 group"
                      >
                        <SambaLinks
                          href={`/content/${item.slug}`}
                          color="secondary400"
                          className="text-gray-600 hover:text-primary transition-colors flex-1"
                        >
                          {item.title}
                        </SambaLinks>
                        <button
                          onClick={() => handleDelete(item)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-ruby transition-opacity duration-200 flex-shrink-0"
                          aria-label={`Delete ${item.title}`}
                        >
                          <Icon variant={Trash} size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Add Button */}
                  <div className="flex justify-center pt-4 border-t border-gray-100">
                    <BaseButton
                      onClick={() => {
                        setActiveSection(section);
                        setOpen(true);
                      }}
                      className="
                        w-full max-w-[200px]
                        h-10
                        flex items-center justify-center
                        rounded-full
                        bg-gradient-to-r from-primary to-primary500
                        text-white
                        shadow-md
                        hover:shadow-lg
                        hover:scale-[1.02]
                        transition-all duration-300 ease-in-out
                        font-medium
                      "
                      aria-label={`Add new item to ${section.title}`}
                    >
                      <Icon variant={Plus} size={20} className="mr-1" />
                      <span className="text-sm">Add</span>
                    </BaseButton>
                  </div>
                </div>
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

  // Normal footer için eski tasarım (koyu tema)
  return (
    <div className={bgColor}>
      <div className="py-10 px-6 max-w-7xl mx-auto">
        <Header2 className="mb-6 text-white">
          Explore top skills and certifications
        </Header2>

        {/* Large screens */}
        <div className="hidden md:grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {displaySections.map((section) => (
            <div key={section.id}>
              <Header3 className="mb-2 tracking-wide text-[16px] text-white">
                {section.title}
              </Header3>

              <ul className="space-y-0 text-[16px]">
                {section.subtitles.map((item) => (
                  <li
                    key={item.slug}
                    className="flex jsutify-between items-center gap-4"
                  >
                    <SambaLinks
                      href={`/content/${item.slug}`}
                      color="secondary200"
                    >
                      {item.title}
                    </SambaLinks>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Small screens - Accordion */}
        <div className="md:hidden divide-y divide-gray-700">
          {sections.map((section) => (
            <AccordionSection
              key={section.id}
              title={section.title}
              links={section.subtitles.map((item) => item.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
