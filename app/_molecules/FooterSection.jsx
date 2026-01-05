"use client";
import { useState } from "react";
import { useRouter ,usePathname  } from "next/navigation";
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
  showPlusButtons = false,
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

                    <button
                      onClick={() => handleDelete(item)}
                      className="ml-2 text-[#ef4444]  hover:text-[#b91c1c]"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Icon variant={Trash} size={25} />
                    </button>
                  </li>
                ))}
              </ul>

              {showPlusButtons && (
                <div className="flex justify-center mt-6 w-1/2">
                  <BaseButton
                    onClick={() => {
                      setActiveSection(section);
                      setOpen(true);
                    }}
                    className="
                        w-20 h-20
                        flex items-center justify-center
                        rounded-full
                        bg-gradient-to-br from-primary to-primary500
                        text-black
                        shadow-lg
                        hover:scale-110
                        hover:shadow-2xl
                        transition-transform duration-300 ease-in-out
                      "
                    aria-label={`Add new item to ${section.title}`}
                  >
                    <Icon variant={Plus} size={40} className="animate-pulse" />
                  </BaseButton>
                </div>
              )}

              <TitleModal
                isOpen={open}
                onClose={() => setOpen(false)}
                title={`Add new subtitle to "${activeSection?.title}"`}
                inputValue={value}
                onInputChange={(e) => setValue(e.target.value)}
                onSave={handleSave}
                placeholder="Subtitle title"
              />
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
