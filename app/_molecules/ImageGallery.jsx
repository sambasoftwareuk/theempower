"use client";

import { useState, useEffect, useCallback } from "react";
import XButton from "../_atoms/XButton";
import DeleteConfirmModal from "../_atoms/DeleteConfirmModal";
import { PrimaryButton } from "../_atoms/buttons";

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

  const loadGallery = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?scope=${pageSlug || "gallery"}`);
      if (res.ok) {
        const data = await res.json();
        setGallery(data.items || []);
      }
    } catch (e) {
      console.error("Gallery failed to load:", e);
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
    // Also add to deletedImages list in context
    onDeleteImage(item);
    setDeleteConfirm(null);
  };

  const resetTemporaryDeletes = () => {
    setTemporarilyDeleted([]);
  };

  const applyDeletes = async () => {
    // Sadece temporarilyDeleted listesindeki resimleri sil
    // deletedImages sadece görsel gizleme için kullanılıyor
    if (!temporarilyDeleted.length) return;

    try {
      await Promise.all(
        temporarilyDeleted.map(async (image) => {
          try {
            // First delete the physical file (if it starts with /uploads/)
            if (image.url && image.url.startsWith("/uploads/")) {
              const fileName = image.url.split("/").pop();
              try {
                const deleteFileRes = await fetch(
                  `/api/upload?file=${fileName}`,
                  {
                    method: "DELETE",
                  }
                );
                if (!deleteFileRes.ok) {
                  // File could not be deleted but continue (delete from JSON)
                  console.warn("Physical file could not be deleted:", fileName);
                }
              } catch (fileError) {
                // File could not be deleted but continue (delete from JSON)
                console.warn("Physical file deletion error:", fileError);
              }
            }

            // JSON'dan sil
            const res = await fetch(`/api/media?id=${image.id}`, {
              method: "DELETE",
            });
            if (!res.ok) {
              const t = await res.text();
              console.error("Could not delete:", image.id, t);
              return;
            }
            setGallery((prev) => prev.filter((it) => it.id !== image.id));
          } catch (e) {
            console.error("Deletion error:", image.id, e);
          }
        })
      );
      // Deletion successful, call callback
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

  return (
    <div className="max-h-64 overflow-y-auto p-2">
      {temporarilyDeleted.length > 0 && (
        <div className="mt-4 p-3 bg-primary300 border border-primary500 rounded flex justify-between mb-2">
          <p className="text-sm text-secondary400">
            {temporarilyDeleted.length} image(s) marked for deletion
          </p>
          <PrimaryButton
            label="Cancel"
            onClick={resetTemporaryDeletes}
            className="mt-2 px-3 py-1 bg-secondary400 text-white text-sm rounded hover:bg-gray-600"
          />
        </div>
      )}
      {loading ? (
        <p className="text-sm text-gray-500 text-center py-4">
          Gallery loading…
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {gallery
            .filter(
              (item) =>
                !deletedImages.some((deleted) => deleted.id === item.id) &&
                !temporarilyDeleted.some((temp) => temp.id === item.id)
            )
            .map((item) => (
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
                    alt={item.alt_text || item.alt || "Galeri"}
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
        title="Delete image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        onConfirm={() => handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
