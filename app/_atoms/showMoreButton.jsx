export const ShowMoreButton = ({ showAll, hiddenCount, onClick }) => {
  if (hiddenCount <= 0) return null;

  return (
    <button
      onClick={onClick}
      className="text-primary hover:underline py-3"
    >
      {showAll ? "Show less" : `Show ${hiddenCount} more`}
    </button>
  );
};
