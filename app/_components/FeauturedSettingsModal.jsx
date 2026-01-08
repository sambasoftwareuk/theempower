import { useState } from "react";
import { OutlinedButton, PrimaryButton } from "../_atoms/buttons";

export const FeaturedSettingsModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl p-6 ">
        {/* Modal Header */}
        <h2 className="text-lg font-semibold mb-4">
          Which position would you like this to appear in the featured section?
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {[1, 2, 3].map((pos) => (
            <label key={pos} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="featured-position"
                value={pos}
                onChange={() => onSelect(pos)}
                className="w-5 h-5 text-blue-600 accent-blue-600"
              />
              <span className="text-gray-700">{`${pos}${
                pos === 1 ? "st" : pos === 2 ? "nd" : "rd"
              } position`}</span>
            </label>
          ))}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end gap-2">
          <PrimaryButton label="Save" />
          <OutlinedButton label=" Close" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};
