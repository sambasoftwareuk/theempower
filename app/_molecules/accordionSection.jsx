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
}) => {
  const [open, setOpen] = useState(false);

  const isNested = links?.length > 0 && typeof links[0] === "object";

  return (
    <div className={className}>
      <button
        className="w-full text-left py-2 font-semibold text-[16px] flex justify-between items-center transition-colors duration-200 hover:text-sunshine"
        onClick={() => setOpen((prev) => !prev)}
      >
        {title}
        <span>
          {open ? (
            <Icon variant={UpArrowIcon} size={24} />
          ) : (
            <Icon variant={DownArrowIcon} size={24} />
          )}
        </span>
      </button>

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
            <ul className="space-y-1 text-[16px]">
              {links.map((text, i) => (
                <li key={i}>
                  <SambaLinks underline="hover" color={linkColor}>
                    {text}
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

const NestedAccordion = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-gray-200 py-2">
      <button
        className="w-full text-left text-[15px] font-medium flex justify-between items-center hover:text-sunshine"
        onClick={() => setOpen(!open)}
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
