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

  return (
    <div className={className}>
      <button
        className="w-full text-left py-2 font-semibold text-[16px] flex justify-between items-center"
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
  );
};
