"use client";

import { useState } from "react";

export default function DragDropZone({
  children,
  onFileDrop,
  acceptTypes = ["image/*"],
  className = "",
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = acceptTypes.join(",");
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        onFileDrop(file);
      }
    };
    input.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const acceptedFile = files.find((file) =>
      acceptTypes.some((type) => {
        // Eğer type pattern ise (örn: "image/*"), startsWith kullan
        if (type.endsWith("/*")) {
          const prefix = type.slice(0, -2); // "image/*" -> "image"
          return file.type.startsWith(prefix + "/");
        }
        // Spesifik type ise direkt eşitlik kontrolü
        return file.type === type;
      })
    );

    if (acceptedFile) {
      onFileDrop(acceptedFile);
    } else {
      // Note: This could be improved by adding an onError callback prop
      alert(`Please only drag ${acceptTypes.join(", ")} files`);
    }
  };

  return (
    <div
      className={`border rounded relative ${
        isDragOver ? "border-blue-500 bg-blue-50" : ""
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-500 rounded flex items-center justify-center z-10">
          <div className="text-blue-600 text-lg font-medium">
            Drop file here
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
