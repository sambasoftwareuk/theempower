"use client";

import { OutlinedButton, PrimaryButton } from "./buttons";
import { Header3 } from "./Headers";

export default function DeleteConfirmModal({
  isOpen,
  title = "Delete Item",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
        <Header3 className="text-lg font-semibold mb-4">{title}</Header3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <OutlinedButton
            label={cancelLabel}
            onClick={onCancel}
            className="text-gray-600 border-gray-300 hover:bg-gray-50"
          />
          <PrimaryButton
            label={confirmLabel}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 border-red-600"
          />
        </div>
      </div>
    </div>
  );
}
