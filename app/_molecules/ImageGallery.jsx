"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import XButton from "../_atoms/XButton";
import DeleteConfirmModal from "../_atoms/DeleteConfirmModal";
import { OutlinedButton } from "../_atoms/buttons";
import { listMockMedia, removeMockMedia } from "../utils/mockGalleryStore";

export default function ImageGallery({
  onImageSelect,
  selectedUrl = "",
  selectedMediaId = null,
  onDeleteImage,
  pageSlug,
  deletedImages = [],
  onApply,
  onDeletesApplied,
}) {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [temporarilyDeleted, setTemporarilyDeleted] = useState([]);
  const [error, setError] = useState("");

  const loadGallery = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const scope = pageSlug || "gallery";
      const items = listMockMedia(scope);
      setGallery(items);
    } catch (e) {
      setError("Error loading gallery: " + e.message);
    } finally {
      setLoading(false);
    }
  }, [pageSlug]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  // Listen for gallery reload event
  useEffect(() => {
    const handleReload = () => {
      loadGallery();
    };
    window.addEventListener("gallery-reload", handleReload);
    return () => {
      window.removeEventListener("gallery-reload", handleReload);
    };
  }, [loadGallery]);

  const handleDelete = (item) => {
    setTemporarilyDeleted((prev) => [...prev, item]);
    // Context'teki deletedImages listesine de ekle
    onDeleteImage(item);
    setDeleteConfirm(null);
  };

  const resetTemporaryDeletes = () => {
    setTemporarilyDeleted([]);
  };

  const applyDeletes = async () => {
    // Hem temporarilyDeleted hem de deletedImages listesindeki resimleri sil
    const allToDelete = [
      ...temporarilyDeleted,
      ...deletedImages.filter(
        (deleted) => !temporarilyDeleted.some((temp) => temp.id === deleted.id)
      ),
    ];

    if (!allToDelete.length) {
      return;
    }

    setError("");
    const errors = [];
    try {
      await Promise.all(
        allToDelete.map(async (image) => {
          try {
            const scope = image.scope || pageSlug || "gallery";

            // Dosyayı sil (eğer /uploads/ ile başlıyorsa)
            if (image.url && image.url.startsWith("/uploads/")) {
              const fileName = image.url.split("/").pop();
              try {
                const deleteRes = await fetch(`/api/upload?file=${fileName}`, {
                  method: "DELETE",
                });
                if (!deleteRes.ok) {
                  // Dosya silinemedi ama devam et (mock store'dan sil)
                }
              } catch (fileError) {
                // Dosya silinemedi ama devam et (mock store'dan sil)
              }
            }

            // Mock store'dan sil
            const removed = removeMockMedia(scope, image.id);
            if (!removed) {
              const errorMsg = `Failed to delete image (ID: ${image.id})`;
              setError(errorMsg);
              errors.push(errorMsg);
              return;
            }
          } catch (e) {
            const errorMsg = `Error deleting image (ID: ${image.id}): ${e.message}`;
            setError(errorMsg);
            errors.push(errorMsg);
          }
        })
      );

      // Silme işlemi başarılı oldu, galeriyi yeniden yükle
      await loadGallery();

      // Silme işlemi başarılı oldu, callback'i çağır
      if (onDeletesApplied) {
        onDeletesApplied();
      }
    } finally {
      setTemporarilyDeleted([]);
    }
  };

  useEffect(() => {
    if (onApply) {
      onApply({
        applyDeletes,
        hasTemporaryDeletes: temporarilyDeleted.length > 0,
        resetTemporaryDeletes,
      });
    }
  }, [temporarilyDeleted.length, onApply]);

  const visibleGallery = useMemo(() => {
    return gallery.filter(
      (item) =>
        !deletedImages.some((d) => d.id === item.id) &&
        !temporarilyDeleted.some((t) => t.id === item.id)
    );
  }, [gallery, deletedImages, temporarilyDeleted]);

  return (
    <div className="max-h-64 overflow-y-auto p-2">
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {temporarilyDeleted.length > 0 && (
        <div className="mt-4 p-3 bg-primary300 border border-primary500 rounded flex justify-between mb-2">
          <p className="text-sm text-secondary400">
            {temporarilyDeleted.length} image(s) marked for deletion
          </p>
          <OutlinedButton
            label="Cancel"
            onClick={resetTemporaryDeletes}
            className="mt-2 text-sm bg-secondary400 text-white hover:bg-gray-600 border-secondary400"
          />
        </div>
      )}
      {loading ? (
        <p className="text-sm text-gray-500 text-center py-4">
          Loading gallery...
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {visibleGallery.map((item) => (
            <div
              key={item.id}
              className={`relative rounded border-2 p-1 transition-all ${
                selectedMediaId === item.id ||
                selectedUrl === item.id ||
                selectedUrl === item.url
                  ? "border-blue-500 ring-2 ring-blue-300 shadow-md"
                  : "border-gray-200 hover:border-primary900 hover:shadow-sm"
              }`}
            >
              <div
                onClick={() => onImageSelect(item.id, item.url || item.path)}
                className="cursor-pointer"
              >
                <img
                  src={item.url || item.path}
                  alt={item.alt_text || item.alt || "Gallery"}
                  className="w-full h-20 object-contain rounded"
                />
              </div>

              <div className="absolute -top-2 -right-2">
                <XButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirm(item);
                  }}
                  className="!p-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteConfirm}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        onConfirm={() => handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
