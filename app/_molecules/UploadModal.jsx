"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { PrimaryButton, OutlinedButton } from "../_atoms/buttons";
import { Header2, Header3 } from "../_atoms/Headers";
import XButton from "../_atoms/XButton";
import { usePageEdit } from "../context/PageEditProvider";
import { addMockMedia } from "../utils/mockGalleryStore";

export default function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
  pageSlug,
}) {
  const [files, setFiles] = useState([]); // [{id, file, url}, ...]
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const { mediaScope } = usePageEdit();

  const handleFileSelect = (fileList) => {
    const fileArray = Array.from(fileList);
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      setError("Only image files can be selected");
      return;
    }

    const newFiles = imageFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const removeFile = (id) => {
    const fileToRemove = files.find((f) => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    if (!mediaScope) {
      setError("Scope is missing.");
      return;
    }

    setUploading(true);
    setError("");
    let lastUploadedMediaId = null;
    try {
      for (const { file } of files) {
        // Upload file
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text();
          throw new Error(`Upload failed: ${uploadRes.status} - ${errorText}`);
        }

        const uploadData = await uploadRes.json();

        // Create media record in mock store
        const newMedia = addMockMedia(mediaScope, {
          url: uploadData.url,
          alt_text: file.name,
          mime_type: uploadData?.mime_type || file.type || null,
        });

        // Son yüklenen resmin ID'sini sakla
        if (newMedia.id) {
          lastUploadedMediaId = newMedia.id;
        }
      }

      // Cleanup
      files.forEach(({ url }) => URL.revokeObjectURL(url));
      setFiles([]);

      // Galeriyi yenile
      window.dispatchEvent(new CustomEvent("gallery-reload"));

      // Son yüklenen resmin ID'sini callback ile döndür
      onUploadComplete?.(lastUploadedMediaId);
      onClose();
    } catch (error) {
      setError("Error uploading image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    files.forEach(({ url }) => URL.revokeObjectURL(url));
    setFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-4xl h-5/6 rounded-xl bg-white p-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Header2 className="text-lg font-semibold">Upload Image</Header2>
          <XButton onClick={handleClose} title="Close" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`p-6 text-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
          onClick={handleClick}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleFileSelect(e.dataTransfer.files);
            }
          }}
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
            Click to upload images or drag and drop
          </p>
          <p className="text-xs text-gray-500">JPG, PNG, GIF desteklenir</p>
        </div>

        {/* Seçilen resimler */}
        {files.length > 0 && (
          <div className="mt-4 h-4/6">
            <Header3 className="text-sm font-medium text-gray-700 mb-2">
              Selected Images ({files.length})
            </Header3>
            <div className="grid grid-cols-3 gap-2 h-5/6 overflow-y-auto p-2">
              {files.map((fileItem) => (
                <div key={fileItem.id} className="relative">
                  <div className="relative w-full h-32 rounded border overflow-hidden">
                    <Image
                      src={fileItem.url}
                      alt={fileItem.file.name}
                      fill
                      unoptimized
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <XButton
                      onClick={() => removeFile(fileItem.id)}
                      title="Dosyayı kaldır"
                    />
                  </div>
                  <p className="text-xs text-gray-600 truncate mt-1">
                    {fileItem.file.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <OutlinedButton
            label="Cancel"
            onClick={handleClose}
            disabled={uploading}
          />
          <PrimaryButton
            label={uploading ? "Uploading..." : "Upload"}
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="bg-blue-600 text-white"
          />
        </div>
      </div>
    </div>
  );
}
