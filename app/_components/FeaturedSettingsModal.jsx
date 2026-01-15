import { OutlinedButton, PrimaryButton } from "../_atoms/buttons";

export const FeaturedSettingsModal = ({
  isOpen,
  onClose,
  onToggle,
  onSave,
  selectedPositions = [],
}) => {
  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedPositions);
    onClose();
  };

  const isChecked = (pos) => selectedPositions.includes(pos);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          Which position would you like this to appear in the featured section?
        </h2>

        {/* Checkbox Options */}
        <div className="space-y-3">
          {[1, 2].map((pos) => (
            <label key={pos} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value={pos}
                checked={isChecked(pos)}
                onChange={() => onToggle(pos)}
                className="w-5 h-5 accent-primary"
              />
              <span className="text-gray-700">
                {pos}
                {pos === 1 ? "st" : pos === 2 ? "nd" : "rd"} position
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <PrimaryButton label="Save" onClick={handleSave} />
          <OutlinedButton label="Close" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};
