"use client";
import { useState } from "react";
import { OutlinedButton } from "../_atoms/buttons";

export const AccordionSection = ({ title, childrenData = [], linkColor = "black" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasNested = Array.isArray(childrenData) && childrenData[0]?.question;

  return (
    <div className="border rounded-lg w-full">
  <OutlinedButton
    onClick={() => setIsOpen(!isOpen)}
    className="w-full text-left px-6 py-4 font-semibold bg-gray-100 hover:bg-gray-200"
    label={title}
  />
  {isOpen && (
    <div className="px-6 py-4 bg-white w-full">
      {hasNested ? (
        childrenData.map((item, idx) => (
          <div key={idx} className="border-t py-2">
            <details>
              <summary className="cursor-pointer font-medium text-gray-800">
                {item.question}
              </summary>
              <p className="mt-1 text-sm text-gray-600">{item.answer}</p>
            </details>
          </div>
        ))
      ) : (
        childrenData.map((answer, idx) => (
          <p key={idx} className={`text-${linkColor} py-1`}>{answer}</p>
        ))
      )}
    </div>
  )}
</div>

  );
};
