"use client";

import { useState, useEffect } from "react";
import ImageGallery from "./ImageGallery";
import { PrimaryButton, OutlinedButton } from "../_atoms/buttons";
import { Header2 } from "../_atoms/Headers";
import InlineTabButton from "../_atoms/InlineTabButton";
import UploadModal from "./UploadModal";

export default function BodyEditorModal({
  isOpen,
  onClose,
  mode = "image",
  imageUrl = "",
  imageAlt = "",
  selectedMediaId = null,
  onImageUrlChange = () => {},
  onImageAltChange = () => {},
  onImageSelect = () => {},
  onImageUpload = () => {},
  onSave,
  saving = false,
  error = "",
  onDeleteImage = () => {},
  deletedImages = [],
  onUploadComplete = () => {},
  pageSlug,
}) {
  const [activeTab, setActiveTab] = useState("gallery");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [galleryActions, setGalleryActions] = useState(null);

  useEffect(() => {
    if (activeTab === "upload" && mode === "image") {
      setShowUploadModal(true);
    }
  }, [activeTab, mode]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
        <div className="w-full max-w-4xl max-h-[90vh] rounded-xl bg-white p-4 shadow-lg overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <Header2 className="text-lg font-semibold">Görseli Düzenle</Header2>
            <OutlinedButton
              label="✖"
              onClick={onClose}
              className="text-sm px-3 py-1"
            />
          </div>

          {/* Tab'lar */}
          <div className="flex border-b mb-4 gap-2">
            <InlineTabButton
              label="Galeri"
              isActive={activeTab === "gallery"}
              onClick={() => setActiveTab("gallery")}
            />
            <InlineTabButton
              label="Upload"
              isActive={activeTab === "upload"}
              onClick={() => {
                setActiveTab("upload");
                setShowUploadModal(true);
              }}
            />
          </div>

          {/* Tab Content */}
          {activeTab === "gallery" ? (
            <ImageGallery
              onImageSelect={(id, url) => onImageSelect(id, url)}
              selectedMediaId={selectedMediaId}
        onDeleteImage={onDeleteImage}
        deletedImages={deletedImages}
        onDeletesApplied={() => {
          // Silme işlemi başarılı olduktan sonra deletedImages listesini temizle
          if (onDeleteImage) {
            // Tüm deletedImages'ı kaldırmak için özel bir callback gerekli
            // Şimdilik ImageEditor'da handle edilecek
          }
        }}
              onApply={setGalleryActions}
              pageSlug={pageSlug}
            />
          ) : (
            <div className="p-4 text-center text-gray-500">
              Upload modal açılıyor...
            </div>
          )}

          {/* Preview */}
          {imageUrl && (
            <div className="mt-4 p-4 border rounded">
              <p className="text-sm font-medium mb-2">Önizleme:</p>
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-1/2 mx-auto h-auto rounded"
              />
            </div>
          )}

          {/* Error Message */}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end gap-2">
            <OutlinedButton
              label="Vazgeç"
              onClick={() => {
                if (galleryActions && galleryActions.resetTemporaryDeletes) {
                  galleryActions.resetTemporaryDeletes();
                }
                onClose();
              }}
              disabled={saving}
            />
            <PrimaryButton
              label={saving ? "Kaydediliyor..." : "Kaydet"}
              onClick={async () => {
                // Önce silme işlemlerini uygula
                if (galleryActions && galleryActions.applyDeletes) {
                  await galleryActions.applyDeletes();
                }
                // Sonra kaydet (ImageEditor'daki apply fonksiyonu deletedImages'ı temizleyecek)
                onSave();
              }}
              disabled={saving}
              className="bg-black text-white"
            />
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setActiveTab("gallery");
        }}
        onUploadComplete={(lastUploadedMediaId) => {
          onUploadComplete(lastUploadedMediaId);
          setShowUploadModal(false);
          setActiveTab("gallery");
          // Trigger gallery reload with a small delay to ensure database is updated
          setTimeout(() => {
            console.log("Dispatching gallery-reload event");
            window.dispatchEvent(new CustomEvent("gallery-reload"));
          }, 500);
        }}
        pageSlug={pageSlug}
      />
    </>
  );
}
