"use client";
import { useState } from "react";
import { SambaLinks } from "../_atoms/SambaLinks";
import { DownArrowIcon, UpArrowIcon } from "../_atoms/Icons";
import Icon from "../_atoms/Icon";

export const AccordionSection = ({
  title,
  links = [],
  linkColor = "white",
  className = "",
  variant = "nested", // default nested, flat list için parent'ta "flat" gönder
  onLinkClick,
}) => {
  const [open, setOpen] = useState(false);

  // Nested mi yoksa flat list mi render edilecek
  const isNested =
    variant === "nested" ||
    (variant === "auto" &&
      links?.length > 0 &&
      typeof links[0] === "object" &&
      "question" in links[0] &&
      "answer" in links[0]);

  return (
    <div className={className}>
      {/* HEADER */}
      <button
        className="w-full text-left py-2 font-semibold text-[16px] flex justify-between items-center text-black"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {title}
        <Icon variant={open ? UpArrowIcon : DownArrowIcon} size={20} />
      </button>

      {/* CONTENT */}
      {open && (
        <div className="mt-2">
          {isNested ? (
            // Nested Accordion
            links.map((item, i) => (
              <NestedAccordion
                key={i}
                question={item.question}
                answer={item.answer}
              />
            ))
          ) : (
            // Flat List
            <ul className="space-y-0.5 pl-2">
              {links.map((item, i) => (
                <li key={item.slug ?? i}>
                  <SambaLinks
                    href={item.slug ? `/content/${item.slug}` : "#"}
                    underline="hover"
                    color={linkColor}
                    className="block py-0.5 px-3 rounded-lg text-sm"
                    onClick={() => {
                      onLinkClick?.();
                    }}
                  >
                    {typeof item === "string"
                      ? item
                      : item.title || item.name || item.label || ""}
                  </SambaLinks>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

// Nested Accordion component (eski kullanım için)
const NestedAccordion = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-gray-200 py-2">
      <button
        className="w-full text-left text-[15px] font-medium flex justify-between items-center"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {question}
        <Icon variant={open ? UpArrowIcon : DownArrowIcon} size={20} />
      </button>

      {open && (
        <div className="mt-2 pl-2 text-[15px] text-gray-700">{answer}</div>
      )}
    </div>
  );
};
