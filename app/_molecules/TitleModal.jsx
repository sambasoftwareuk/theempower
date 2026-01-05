"use client";
import XButton from "../_atoms/XButton";
import { Header2 } from "../_atoms/Headers";
import { OutlinedButton, PrimaryButton } from "../_atoms/buttons";

export default function TitleModal({
  isOpen,
  onClose,
  title = "Modal Title",
  initialValue = "",
  inputValue,
  onInputChange,
  onSave,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  placeholder = "",
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center  p-4"
      onClick={onClose} // overlay tıklayınca kapanır
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg relative"
        onClick={(e) => e.stopPropagation()} // modal içi tıklamalarda kapanmasın
      >
        <div className="absolute top-4 right-4">
          <XButton onClick={onClose} title="Close" />
        </div>

        <Header2 className="text-lg font-semibold mb-4">{title}</Header2>

        <input
          type="text"
          value={inputValue || initialValue}
          onChange={onInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave();
            if (e.key === "Escape") onClose();
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4 text-gray-900"
          placeholder={placeholder}
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <OutlinedButton label={cancelLabel} onClick={onClose} />
          <PrimaryButton
            label={saveLabel}
            onClick={onSave}
            className="bg-primary900 text-white"
          />
        </div>
      </div>
    </div>
  );
}
