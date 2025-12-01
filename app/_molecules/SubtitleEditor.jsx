"use client";

import { useEffect, useState } from "react";
import { usePageEdit } from "../context/PageEditProvider";
import EditButton from "../_atoms/EditButton";
import XButton from "../_atoms/XButton";
import { SignedIn } from "@clerk/nextjs";
import { PrimaryButton, OutlinedButton } from "../_atoms/buttons";
import { Header2 } from "../_atoms/Headers";

export default function SubtitleEditor({
  initialSubtitle = "",
  className = "",
}) {
  const { subtitle, setSubtitle, resetSubtitle } = usePageEdit();
  const [isOpen, setIsOpen] = useState(false);
  const [editValue, setEditValue] = useState(initialSubtitle);

  useEffect(() => {
    setEditValue(subtitle || initialSubtitle);
  }, [subtitle, initialSubtitle]);

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

  const handleCancel = () => {
    setEditValue(subtitle || initialSubtitle);
    setIsOpen(false);
  };

  const displaySubtitle = subtitle || initialSubtitle;

  return (
    <>
      <div className="flex gap-2 items-center">
        <p className={`text-base md:text-lg lg:text-xl ${className}`}>
          {displaySubtitle}
        </p>
        <SignedIn>
          <div className="flex gap-1 self-start">
            <EditButton onClick={handleOpen} size="small" />
            <XButton onClick={resetSubtitle} title="Subtitle değişikliklerini geri al" />
          </div>
        </SignedIn>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <Header2 className="text-lg font-semibold mb-4">
              Alt Başlığı Düzenle
            </Header2>

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
              <OutlinedButton label="Vazgeç" onClick={handleCancel} />
              <PrimaryButton
                label="Kaydet"
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


