"use client";
import React from "react";
import { PrimaryButton } from "../_atoms/buttons";

export default function SliderCard({
  title,
  subtitle,
  primaryLabel,
  onPrimaryClick,
  secondaryLabel,
  onSecondaryClick,
}) {
  return (
    <div className="rounded-4xl shadow-lg bg-white p-6 max-w-md w-full flex flex-col justify-between h-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-700 text-base">{subtitle}</p>
      </div>

      {(primaryLabel || secondaryLabel) && (
        <div className="mt-6 flex justify-between gap-4">
          {primaryLabel && (
            <PrimaryButton
              label={primaryLabel}
              onClick={onPrimaryClick}
              className="w-1/2"
            />
          )}
          {secondaryLabel && (
            <PrimaryButton
              label={secondaryLabel}
              onClick={onSecondaryClick}
              className="w-1/2"
            />
          )}
        </div>
      )}
    </div>
  );
}
