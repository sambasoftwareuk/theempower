"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { PrimaryButton, OutlinedButton } from "../_atoms/buttons";
import { Header2 } from "../_atoms/Headers";
import XButton from "../_atoms/XButton";
import { usePageEdit } from "../context/PageEditProvider";

export default function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
  pageSlug,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const { mediaScope } = usePageEdit();

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      alert("Sadece resim dosyaları seçilebilir");
      return;
    }

    const newPreviews = imageFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...imageFiles]);
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const removeFile = (id) => {
    const previewToRemove = filePreviews.find((p) => p.id === id);
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.url);
      const indexToRemove = filePreviews.indexOf(previewToRemove);
      setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    }
    setFilePreviews((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    if (!mediaScope) {
      alert("Scope eksik.");
      return;
    }

    setUploading(true);
    let lastUploadedMediaId = null;
    try {
      for (const file of selectedFiles) {
        // Upload file
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text();
          throw new Error(
            `Upload başarısız: ${uploadRes.status} - ${errorText}`
          );
        }

        const uploadData = await uploadRes.json();
        console.log("Upload successful:", uploadData);

        // Create media record
        const mediaPayload = {
          url: uploadData.url,
          alt_text: file.name,
          mime_type: uploadData?.mime_type || file.type || null,
        };
        console.log("Creating media record with:", mediaPayload);

        const mediaRes = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mediaPayload),
        });

        if (!mediaRes.ok) {
          let errorText = "";
          try {
            errorText = await mediaRes.text();
            console.error("Media API error response:", errorText);
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch {
              errorData = { message: errorText };
            }
            throw new Error(
              `Media kaydı başarısız: ${mediaRes.status} - ${
                errorData.message || errorData.error || errorText
              }`
            );
          } catch (parseError) {
            throw new Error(
              `Media kaydı başarısız: ${mediaRes.status} - ${
                errorText || parseError.message
              }`
            );
          }
        }

        const mediaResult = await mediaRes.json();
        console.log("Media created successfully:", mediaResult);

        // Son yüklenen resmin ID'sini sakla
        const mediaId = mediaResult.media?.id || mediaResult.id;
        if (mediaId) {
          lastUploadedMediaId = mediaId;
        }

        // Media kaydı başarılı olduğundan emin ol
        if (!mediaId) {
          console.warn(
            "Media kaydı oluşturuldu ama ID döndürülmedi:",
            mediaResult
          );
        }
      }

      // Cleanup
      filePreviews.forEach(({ url }) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setFilePreviews([]);

      // Galeriyi yenile
      window.dispatchEvent(new CustomEvent("gallery-reload"));

      // Son yüklenen resmin ID'sini callback ile döndür
      onUploadComplete?.(lastUploadedMediaId);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Resim yüklenirken hata oluştu: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    filePreviews.forEach(({ url }) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setFilePreviews([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-4xl h-5/6 rounded-xl bg-white p-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Header2 className="text-lg font-semibold">Resim Yükle</Header2>
          <OutlinedButton
            label="✖"
            onClick={handleClose}
            className="text-sm px-3 py-1"
          />
        </div>

        {/* Upload Area */}
        <div
          className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
          onClick={handleClick}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={(e) => handleFileSelect(e.target.files)}
            multiple
            className="hidden"
            accept="image/*"
          />
          <p className="text-sm text-gray-600 mb-2">
            Resim yüklemek için tıklayın ya da sürükleyip bırakın
          </p>
          <p className="text-xs text-gray-500">JPG, PNG, GIF desteklenir</p>
        </div>

        {/* Seçilen resimler */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 h-4/6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Seçilen Resimler ({selectedFiles.length})
            </h4>
            <div className="grid grid-cols-3 gap-2 h-5/6 overflow-y-auto p-2">
              {filePreviews?.map((preview) => (
                <div key={preview.id} className="relative">
                  <div className="relative w-full h-32 rounded border overflow-hidden">
                    <Image
                      src={preview.url}
                      alt={preview.file.name}
                      fill
                      unoptimized
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <XButton
                      onClick={() => removeFile(preview.id)}
                      title="Dosyayı kaldır"
                    />
                  </div>
                  <p className="text-xs text-gray-600 truncate mt-1">
                    {preview.file.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <OutlinedButton
            label="Vazgeç"
            onClick={handleClose}
            disabled={uploading}
          />
          <PrimaryButton
            label={uploading ? "Yükleniyor..." : "Yükle"}
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="bg-blue-600 text-white"
          />
        </div>
      </div>
    </div>
  );
}
