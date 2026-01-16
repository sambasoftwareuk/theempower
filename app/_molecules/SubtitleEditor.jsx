"use client";

import { useEffect, useState, useCallback } from "react";
import { usePageEdit } from "../context/PageEditProvider";
import EditButton from "../_atoms/EditButton";
import { XButton } from "../_atoms/buttons";
import { SignedIn } from "@clerk/nextjs";
import { PrimaryButton, OutlinedButton } from "../_atoms/buttons";
import { Header2 } from "../_atoms/Headers";

export default function SubtitleEditor({
  initialSubtitle = "",
  className = "",
}) {
  const {
    subtitle,
    setSubtitle,
    resetSubtitle,
    hasPermission,
    permissionLoaded,
  } = usePageEdit();
  const [isOpen, setIsOpen] = useState(false);
  const [editValue, setEditValue] = useState(initialSubtitle);

  // Body scroll lock - modal açıkken body'yi kilitle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup: component unmount olduğunda veya modal kapandığında geri al
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOpen = () => {
    const currentValue = subtitle || initialSubtitle;
    setEditValue(currentValue);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      setSubtitle(editValue.trim());
    }
    setIsOpen(false);
  };

  const handleCancel = useCallback(() => {
    setEditValue(subtitle || initialSubtitle);
    setIsOpen(false);
  }, [subtitle, initialSubtitle]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleCancel]
  );

  const displaySubtitle = subtitle || initialSubtitle;

  // Yetkiler yüklenene kadar hiçbir şey gösterme (flicker önlemek için)
  if (!permissionLoaded) {
    return (
      <div className="flex gap-2 items-center">
        <p className={`text-base md:text-lg lg:text-xl ${className}`}>
          {displaySubtitle}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2 items-center">
        <p className={`text-base md:text-lg lg:text-xl ${className}`}>
          {displaySubtitle}
        </p>
        <SignedIn>
          {hasPermission && (
            <div className="flex gap-1 self-start">
              <EditButton onClick={handleOpen} size="small" />
              <XButton
                onClick={resetSubtitle}
                title="Revert subtitle changes"
              />
            </div>
          )}
        </SignedIn>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={handleCancel}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4">
              <XButton onClick={handleCancel} title="Close" />
            </div>
            <Header2 className="text-lg font-semibold mb-4">
              Edit Subtitle
            </Header2>

            <textarea
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4 text-gray-900 h-auto transition-none resize-none overflow-hidden"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <OutlinedButton label="Cancel" onClick={handleCancel} />
              <PrimaryButton
                label="Save"
                onClick={handleSave}
                className="bg-primary900 text-white"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
