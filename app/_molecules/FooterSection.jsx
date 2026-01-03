"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SambaLinks } from "../_atoms/SambaLinks";
import Icon from "../_atoms/Icon";
import { Plus } from "../_atoms/Icons";
import { AccordionSection } from "../_molecules/accordionSection";
import { Header2, Header3 } from "../_atoms/Headers";
import { BaseButton, OutlinedButton, PrimaryButton } from "../_atoms/buttons";
import XButton from "../_atoms/XButton";
import { toast } from "sonner";

export default function FooterSection({
  sections,
  showPlusButtons = false,
  bgColor = "bg-gray-900",
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [value, setValue] = useState("");

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

  return (
    <div className={bgColor}>
      <div className="py-10 px-6 max-w-7xl mx-auto">
        <Header2 className="mb-6 text-white">
          Explore top skills and certifications
        </Header2>

        {/* Large screens */}
        <div className="hidden md:grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {sections.map((section) => (
            <div key={section.id}>
              <Header3 className="mb-2 tracking-wide text-[16px] text-white">
                {section.title}
              </Header3>

              <ul className="space-y-0 text-[16px]">
                {section.subtitles.map((item) => (
                  <li key={item.slug}>
                    <SambaLinks
                      href={`/content/${item.slug}`}
                      color="secondary200"
                    >
                      {item.title}
                    </SambaLinks>
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
              {open && (
                <div className="fixed inset-0  flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
                    <div className="absolute top-4 right-4">
                      <XButton onClick={() => setOpen(false)} title="Close" />
                    </div>
                    <Header2 className="text-lg font-semibold mb-4">
                      Add new subtitle
                    </Header2>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                        if (e.key === "Escape") setOpen(false);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4 text-gray-900"
                      placeholder="Subtitle title"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <OutlinedButton
                        label="Cancel"
                        onClick={() => setOpen(false)}
                      />
                      <PrimaryButton
                        label="Save"
                        onClick={handleSave}
                        className="bg-primary900 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
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
