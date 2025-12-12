"use client";

import { LineXIcon } from "./Icons";
import Icon from "./Icon";

const XButton = ({ onClick, className = "", title = "Cancel" }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-white bg-red rounded-full hover:bg-red-200 transition-colors duration-200 shadow-lg ${className}`}
      title={title}
    >
      <Icon variant={LineXIcon} size={14} />
    </button>
  );
};

export default XButton;
