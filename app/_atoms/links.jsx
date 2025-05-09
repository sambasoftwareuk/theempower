import React from "react";
import clsx from "clsx";

export function Links({
  children,
  href = "#",
  className = "",
  color = "primary900",
  underline = "hover", // "always" | "hover" | "none"
  ...props
}) {
  const baseColor = {
    white: "text-white hover:text-gray-200",
    black: "text-black hover:text-gray-800",
    primary900: "text-primary900 hover:text-primary",
    secondary: "text-secondary hover:text-secondary400",
    sunshine: "text-sunshine hover:text-sunshine100",
  };

  const underlineStyle = {
    always: "underline",
    hover: "hover:underline",
    none: "",
  };

  return (
    <a
      href={href}
      className={clsx(
        "transition-colors cursor-pointer",
        baseColor[color],
        underlineStyle[underline],
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
