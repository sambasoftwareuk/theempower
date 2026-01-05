"use client";

import { useEffect, useState } from "react";
import { usePageEdit } from "../context/PageEditProvider";
import EditButton from "../_atoms/EditButton";
import XButton from "../_atoms/XButton";
import { SignedIn } from "@clerk/nextjs";
import { Header1, Header2 } from "../_atoms/Headers";
import { PrimaryButton, OutlinedButton } from "../_atoms/buttons";
import TitleModal from "./TitleModal";

export default function TitleEditor({ initialTitle = "", className = "" }) {
  const { title, setTitle, resetTitle } = usePageEdit();
  const [isOpen, setIsOpen] = useState(false);
  const [editValue, setEditValue] = useState(initialTitle);

  useEffect(() => {
    setEditValue(title || initialTitle);
  }, [title, initialTitle]);

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
    const currentValue = title || initialTitle;
    setEditValue(currentValue);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      setTitle(editValue.trim());
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditValue(title || initialTitle);
    setIsOpen(false);
  };

  const displayTitle = title || initialTitle;

  return (
    <>
      <div className="flex gap-2 items-center">
        <Header1 className={`text-white mb-4 ${className}`}>
          {displayTitle}
        </Header1>
        <SignedIn>
          <div className="flex self-start gap-1">
            <EditButton onClick={handleOpen} size="small" />
            <XButton onClick={resetTitle} title="Revert title changes" />
          </div>
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
            <Header2 className="text-lg font-semibold mb-4">Edit Title</Header2>

            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4 text-gray-900"
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
      {/* <TitleModal
        isOpen={isOpen}
        onClose={handleCancel}
        title="Edit Title"
        initialValue={title || initialTitle}
        inputValue={editValue}
        onInputChange={(e) => setEditValue(e.target.value)}
        onSave={handleSave}
        saveLabel="Save"
        cancelLabel="Cancel"
        placeholder="Enter new title"
      /> */}
    </>
  );
}
