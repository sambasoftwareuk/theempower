"use client";

import { useEffect, useState, useCallback } from "react";
import { usePageEdit } from "../context/PageEditProvider";
import EditButton from "../_atoms/EditButton";
import {
  XButton,
  PrimaryButton,
  OutlinedButton,
  RevertButton,
} from "../_atoms/buttons";
import { SignedIn } from "@clerk/nextjs";
import { Header2 } from "../_atoms/Headers";
import { toast } from "sonner";
import { Plus } from "../_atoms/Icons";

export default function SubtitleEditor({ className = "" }) {
  const {
    subtitle,
    setSubtitle,
    resetSubtitle,
    revertSubtitle,
    saveHero,
    hasPermission,
    permissionLoaded,
  } = usePageEdit();

  const [isOpen, setIsOpen] = useState(false);
  const [editValue, setEditValue] = useState(subtitle || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOpen = () => {
    setEditValue(subtitle || ""); // subtitle boşsa editValue de boş olacak
    setIsOpen(true);
  };

  const handleSave = async () => {
    setSubtitle(editValue); // empty string allowed
    await saveHero();
    setIsOpen(false);
  };

  const handleCancel = useCallback(() => {
    setEditValue(subtitle || "");
    setIsOpen(false);
  }, [subtitle]);

  const handleDelete = () => {
    setShowDeleteConfirm(false); // modal kapanır
    resetSubtitle(); // subtitle state’i sıfırlanır
    toast.success("Subtitle removed. Click Save to apply.");
  };

  const displaySubtitle = subtitle || "";

  if (!permissionLoaded) {
    return (
      <p className={`text-base md:text-lg lg:text-xl ${className}`}>
        {displaySubtitle}
      </p>
    );
  }

  return (
    <>
      <div className="flex gap-2 items-center">
        {displaySubtitle ? (
          <>
            <p className={`text-base md:text-lg lg:text-xl ${className}`}>
              {displaySubtitle}
            </p>
            <SignedIn>
              {hasPermission && (
                <div className="flex gap-1 self-start">
                  <EditButton onClick={handleOpen} size="small" />
                  <RevertButton
                    className="text-sm underline text-primary900"
                    onClick={revertSubtitle}
                    title="Undo Changes"
                  >
                    Revert
                  </RevertButton>
                  <XButton
                    onClick={() => setShowDeleteConfirm(true)}
                    title="Delete subtitle"
                  />
                </div>
              )}
            </SignedIn>
          </>
        ) : (
          <SignedIn>
            {hasPermission && (
              <button
                onClick={handleOpen}
                className="
                  w-full max-w-[200px]
                  h-10
                  flex items-center justify-center
                  rounded-full
                  bg-gradient-to-r from-primary to-primary500
                  text-white
                  shadow-md
                  hover:shadow-lg
                  hover:scale-[1.02]
                  transition-all duration-300 ease-in-out
                  font-medium
                "
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Subtitle
              </button>
            )}
          </SignedIn>
        )}
      </div>

      {/* Editor Modal */}
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
              {displaySubtitle ? "Edit Subtitle" : "Add Subtitle"}
            </Header2>

            <textarea
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className="
                w-full px-3 py-2 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-primary
                mb-4 text-gray-900 h-auto transition-none
                resize-none overflow-hidden
              "
              autoFocus
              onFocus={(e) => {
                const length = e.target.value.length;
                e.target.setSelectionRange(length, length);
              }}
            />

            <div className="flex justify-end gap-2">
              <OutlinedButton label="Cancel" onClick={handleCancel} />
              <PrimaryButton label="Save" onClick={handleSave} />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Header2 className="text-lg font-semibold mb-4">
              Delete Subtitle
            </Header2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete the subtitle? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <OutlinedButton
                label="Cancel"
                onClick={() => setShowDeleteConfirm(false)}
              />
              <PrimaryButton label="Delete" onClick={handleDelete} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
