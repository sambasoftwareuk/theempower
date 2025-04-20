import React from "react";
import Icon from "./Icon";
export const InputBasic = ({ className = "", ...props }) => (
  <input
    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${className}`}
    {...props}
  />
);
export const InputBasicWithIcon = ({
  icon: Icon,
  className = "",
  ...props
}) => (
  <div
    className={`flex items-center w-full border rounded-md px-4 py-2 text-base focus-within:ring-2 focus-within:ring-purple-400 ${className}`}
  >
    <input className="flex-1 border-none bg-transparent focus:outline-none text-base placeholder:text-gray-400" />
    {Icon && <Icon size={20} />}
  </div>
);

export const InputWithClickableIcon = ({
  icon,
  onIconClick,
  className = "",
  ...props
}) => (
  <div
    className={`flex items-center border rounded-full pr-1 py-0.5 focus-within:ring-2 focus-within:ring-purple-400 ${className}`}
  >
    <input
      className="flex-1 border-none px-4 py-2 text-sm focus:outline-none rounded-full"
      {...props}
    />
    {icon && (
      <button
        type="button"
        onClick={onIconClick}
        className="p-1.5 cursor-pointer bg-purple-100 rounded-full transition"
      >
        <Icon variant={icon} color="#fff" />
      </button>
    )}
  </div>
);
export const InputWithIconStart = ({ icon, className = "", ...props }) => (
  <div
    className={`flex items-center border ring-#9396AD rounded-full px-2 focus-within:ring-2 focus-within:ring-purple-400 ${className}`}
  >
    {icon && <Icon variant={icon} color="#A0A0A7" size={16} />}
    <input
      className="flex-1 border-none  px-3 py-2 text-sm focus:outline-none rounded-full"
      {...props}
    />
  </div>
);
