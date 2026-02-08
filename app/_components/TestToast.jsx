"use client";

import { toast } from "sonner";

export default function TestToast() {
  const showSuccess = () => toast.success("Operation successful 🎉");
  const showError = () => toast.error("An error occurred ❌");
  const showInfo = () => toast.info("Information message ℹ️");
  const showWarning = () => toast.warning("Warning! This action cannot be undone ⚠️");

  // Basic custom toast
  const showCustom = () =>
    toast("Custom Toast", {
      description: "Using Sonner + Tailwind",
      duration: 4000,
    });

  // Fully custom toast
  const showCustom2 = () =>
    toast("Custom Toast Message", {
      description: "This toast is fully custom designed 💎",
      action: {
        label: "Close",
        onClick: () => toast.success("Custom toast closed ✅"),
      },
      icon: "🔥",
      duration: 6000,
      style: {
        backgroundColor: "#1e293b",
        color: "#fef3c7",
        fontWeight: "bold",
      },
    });

  const showApiToast = async () => {
    const fakeApi = new Promise((resolve, reject) =>
      setTimeout(
        () => (Math.random() > 0.5 ? resolve(true) : reject(false)),
        2000
      )
    );

    toast.promise(fakeApi, {
      loading: "Sending request...",
      success: "Operation completed successfully ✅",
      error: "Operation failed ❌",
    });
  };

  const showLoading = () => {
    const id = toast.loading("Saving...");
    setTimeout(() => toast.success("Save completed", { id }), 2000);
  };

  const showAction = () =>
    toast("Are you sure you want to delete?", {
      action: { label: "Yes", onClick: () => toast.success("Deleted 🗑️") },
    });

  return (
    <div className="p-6 space-y-3 max-w-md mx-auto">
      <button
        onClick={showSuccess}
        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Success
      </button>

      <button
        onClick={showError}
        className="w-full bg-ruby text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Error
      </button>

      <button
        onClick={showInfo}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Info
      </button>

      <button
        onClick={showWarning}
        className="w-full bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
      >
        Warning
      </button>

      <button
        onClick={showCustom}
        className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Custom
      </button>

      <button
        onClick={showCustom2}
        className="w-full bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
      >
        Custom v2
      </button>

      <button
        onClick={showApiToast}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        API / Promise
      </button>

      <button
        onClick={showLoading}
        className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Loading
      </button>

      <button
        onClick={showAction}
        className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-900 transition"
      >
        Action / Confirm
      </button>
    </div>
  );
}
