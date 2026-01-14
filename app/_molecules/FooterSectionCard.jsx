"use client";

import { SambaLinks } from "../_atoms/SambaLinks";
import Icon from "../_atoms/Icon";
import { Plus, Trash } from "../_atoms/Icons";
import { Header3 } from "../_atoms/Headers";
import { BaseButton } from "../_atoms/buttons";

export default function FooterSectionCard({
  section,
  variant = "desktop", // "desktop" | "mobile"
  onDelete,
  onAdd,
}) {
  const isDesktop = variant === "desktop";

  const containerClassName = isDesktop
    ? "bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
    : "bg-white rounded-2xl p-6 shadow-md";

  const listClassName = isDesktop
    ? "space-y-2 text-[15px] flex-1 mb-4"
    : "space-y-2 text-[15px] mb-4";

  const deleteButtonClassName = isDesktop
    ? "group-hover:opacity-100 text-gray-400 hover:text-ruby transition-opacity duration-200 flex-shrink-0"
    : "opacity-0 group-hover:opacity-100 text-gray-400 hover:text-ruby transition-opacity duration-200 flex-shrink-0";

  const addWrapperClassName = isDesktop
    ? "flex justify-center mt-auto pt-4"
    : "flex justify-center pt-4 border-t border-gray-100";

  return (
    <div className={containerClassName}>
      <Header3 className="text-secondary font-semibold text-lg mb-4">
        {section.title}
      </Header3>

      <ul className={listClassName}>
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
              onClick={() => onDelete(item)}
              className={deleteButtonClassName}
              aria-label={`Delete ${item.title}`}
            >
              <Icon variant={Trash} size={16} />
            </button>
          </li>
        ))}
      </ul>

      <div className={addWrapperClassName}>
        <BaseButton
          onClick={() => onAdd(section)}
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
}
