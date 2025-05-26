"use client";
import { useState } from "react";
import { SambaLinks } from "../_atoms/SambaLinks";

export const AccordionSection = ({ title, links = [], linkColor = "white" }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="w-full text-left py-2 font-semibold text-[16px] flex justify-between items-center"
        onClick={() => setOpen((prev) => !prev)}
      >
        {title}
        <span className="text-lg">{open ? "˄" : "˅"}</span>
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