"use client";
import { useState } from "react";

const ToggleButton = ({ initial = false, onChange }) => {
  const [enabled, setEnabled] = useState(initial);

  const handleToggle = () => {
    setEnabled(!enabled);
    if (onChange) onChange(!enabled);
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-20 h-10 flex items-center rounded-full p-1 transition-colors duration-300 ${
        enabled ? "bg-primary" : "bg-gray-300"
      } `}
    >
      <div
        className={`bg-white w-8 h-8 rounded-full shadow-md transform transition-transform duration-300
            ${enabled ? "translate-x-10" : "translate-x-0"}
            `}
      />
    </button>
  );
};

export default ToggleButton;
