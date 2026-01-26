"use client";

import { useEffect, useState } from "react";
import { usePageEdit } from "../context/PageEditProvider";
import EditButton from "../_atoms/EditButton";
import { XButton } from "../_atoms/buttons";
import { SignedIn } from "@clerk/nextjs";
import { Header1, Header2 } from "../_atoms/Headers";
import { PrimaryButton, OutlinedButton } from "../_atoms/buttons";
import TitleModal from "./TitleModal";

export default function TitleEditor({ initialTitle = "", className = "" }) {
  const { title, setTitle, resetTitle, hasPermission, permissionLoaded } =
    usePageEdit();
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
  // Yetkiler yüklenene kadar hiçbir şey gösterme (flicker önlemek için)
  if (!permissionLoaded) {
    return (
      <div className="flex gap-2 items-center">
        <Header1 className={`text-white mb-4 ${className}`}>
          {displayTitle}
        </Header1>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2 items-center">
        <Header1 className={`text-white text-lg lg:text-3xl mb-4 ${className}`}>
          {displayTitle}
        </Header1>
        <SignedIn>
          {hasPermission && (
            <div className="flex self-start gap-1">
              <EditButton onClick={handleOpen} size="small" />
              <XButton onClick={resetTitle} title="Revert title changes" />
            </div>
          )}
        </SignedIn>
      </div>

      <TitleModal
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
      />
    </>
  );
}
