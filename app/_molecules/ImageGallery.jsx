"use client";

import { useState, useEffect, useCallback } from "react";
import XButton from "../_atoms/XButton";
import DeleteConfirmModal from "../_atoms/DeleteConfirmModal";

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
      console.error("Galeri yüklenemedi:", e);
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
      console.log("Gallery reload event received");
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

    if (!allToDelete.length) return;

    try {
      await Promise.all(
        allToDelete.map(async (image) => {
          try {
            const res = await fetch(`/api/media?id=${image.id}`, {
              method: "DELETE",
            });
            if (!res.ok) {
              const t = await res.text();
              console.error("Silinemedi:", image.id, t);
              return;
            }
            setGallery((prev) => prev.filter((it) => it.id !== image.id));
          } catch (e) {
            console.error("Silme hatası:", image.id, e);
          }
        })
      );
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

  return (
    <div className="max-h-64 overflow-y-auto p-2">
      {temporarilyDeleted.length > 0 && (
        <div className="mt-4 p-3 bg-primary300 border border-primary500 rounded flex justify-between mb-2">
          <p className="text-sm text-secondary400">
            {temporarilyDeleted.length} resim silinmek üzere işaretlendi
          </p>
          <button
            onClick={resetTemporaryDeletes}
            className="mt-2 px-3 py-1 bg-secondary400 text-white text-sm rounded hover:bg-gray-600"
          >
            İptal Et
          </button>
        </div>
      )}
      {loading ? (
        <p className="text-sm text-gray-500 text-center py-4">
          Galeri yükleniyor...
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
        title="Resmi Sil"
        message="Bu resmi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        onConfirm={() => handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
