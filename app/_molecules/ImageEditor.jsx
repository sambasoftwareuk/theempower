"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { usePageEdit } from "../context/PageEditProvider";
import EditButton from "../_atoms/EditButton";
import { XButton } from "../_atoms/buttons";
import BodyEditorModal from "./BodyEditorModal";
import { SignedIn } from "@clerk/nextjs";

export default function ImageEditor({
  initialUrl = "/generic-image.png",
  initialAlt = "Hero",
  className = "mt-2",
}) {
  const {
    heroUrl,
    setHeroUrl,
    heroAlt,
    setHeroAlt,
    heroMediaId,
    setHeroMediaId,
    resetHero,
    setDeletedImages,
    deletedImages,
    pageSlug,
  } = usePageEdit();

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(initialUrl);
  const [alt, setAlt] = useState(initialAlt);
  const [stagedMediaId, setStagedMediaId] = useState(null);
  const [previewOk, setPreviewOk] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [stagedFile, setStagedFile] = useState(null);
  const [stagedPreview, setStagedPreview] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const abortControllerRef = useRef(null);

  // Update state when modal opens, cancel upload when closed
  useEffect(() => {
    if (open) {
      // Update state when modal opens
      setUrl(heroUrl || initialUrl);
      setAlt(heroAlt || initialAlt);
      setStagedMediaId(heroMediaId || null);
      setPreviewOk(true);
      setError("");
      setUploadComplete(false);
    } else {
      // Cancel upload when modal closes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, [open, heroUrl, heroAlt, heroMediaId, initialUrl, initialAlt]);

  // URL kontrol
  useEffect(() => {
    if (!open || !url) return;
    let cancelled = false;
    setChecking(true);
    const img = new Image();
    img.onload = () => {
      if (!cancelled) {
        setPreviewOk(true);
        setChecking(false);
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        setPreviewOk(false);
        setChecking(false);
      }
    };
    img.src = url;
    return () => {
      cancelled = true;
    };
  }, [open, url]);

  // Component unmount olduğunda cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (stagedPreview) {
        URL.revokeObjectURL(stagedPreview);
      }
    };
  }, []);

  // Selection / staging
  const handleFileSelected = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Only image files allowed");
      return;
    }

    // Cancel old upload if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (stagedPreview) URL.revokeObjectURL(stagedPreview);

    const objUrl = URL.createObjectURL(file);
    setStagedFile(file);
    setStagedPreview(objUrl);
    setUrl(objUrl);
    setPreviewOk(true);
    setError("");
  };

  const clearStaged = () => {
    if (stagedPreview) URL.revokeObjectURL(stagedPreview);
    setStagedFile(null);
    setStagedPreview(null);
    setStagedMediaId(null);
    setUrl(heroUrl || initialUrl);
  };

  const apply = async () => {
    if (!url) {
      setError("Image URL required");
      return;
    }

    // If current hero image is among deleted images, revert to generic-image
    if (deletedImages.some((img) => img.id === heroMediaId)) {
      setHeroUrl("/generic-image.png");
      setHeroAlt("Hero");
      setHeroMediaId(null);
      setOpen(false);
      setDeletedImages([]);
      return;
    }

    setUploading(true);
    setError("");

    try {
      let finalUrl = url;
      let mime = stagedFile?.type || "image/png";
      let mediaId = null;

      // 1) If file is selected, first upload to storage → /api/upload
      if (stagedFile) {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const formData = new FormData();
        formData.append("file", stagedFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error("Upload failed: " + res.status + " - " + t);
        }
        const data = await res.json();
        finalUrl = data.url; // storage URL
        if (stagedPreview) URL.revokeObjectURL(stagedPreview);
        setStagedFile(null);
        setStagedPreview(null);
        abortControllerRef.current = null;
      }

      // 2) Update context for preview
      setHeroUrl(finalUrl);
      setHeroAlt(alt);

      // 3) Media record
      // If selected from gallery (stagedMediaId exists), don't create new record
      if (stagedMediaId) {
        // Selected from gallery, use existing media record
        mediaId = stagedMediaId;
      } else {
        // New file uploaded, create media record
        const mediaRes = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: finalUrl,
            alt_text: alt || null,
            mime_type: mime,
          }),
        });
        if (!mediaRes.ok) {
          const errorText = await mediaRes.text();
          throw new Error("Media could not be created: " + errorText);
        }
        const created = await mediaRes.json();
        mediaId = created.media.id;
      }

      // 4) Page context → link hero_media_id (will be written to DB in Save All PATCH)
      setHeroMediaId(mediaId);

      setOpen(false);
    } catch (e) {
      if (e.name !== "AbortError") {
        setError(e.message || "Could not update");
      }
    } finally {
      setUploading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <>
      <SignedIn>
        <div className="flex items-center gap-1">
          <EditButton
            onClick={() => setOpen(true)}
            className={className}
            size="small"
          />
          <XButton onClick={resetHero} />
        </div>
      </SignedIn>

      <BodyEditorModal
        isOpen={open}
        onClose={() => setOpen(false)}
        mode="image"
        pageSlug={pageSlug}
        imageUrl={url}
        imageAlt={alt}
        selectedMediaId={stagedMediaId}
        onImageUrlChange={setUrl}
        onImageAltChange={setAlt}
        onImageUpload={handleFileSelected}
        onImageSelect={(id, selectedUrl) => {
          clearStaged();
          setUrl(selectedUrl);
          setStagedMediaId(id); // Mark as selected from gallery
          setPreviewOk(true);
        }}
        onSave={async () => {
          // First apply deletion operations (done in BodyEditorModal)
          // Then save
          await apply();
          // Clear deletedImages list after deletion is successful
          setDeletedImages([]);
        }}
        saving={uploading}
        error={error}
        onDeleteImage={(image) => setDeletedImages((prev) => [...prev, image])}
        deletedImages={deletedImages}
        onUploadComplete={(lastUploadedMediaId, lastUploadedUrl) => {
          setUploadComplete(true);
          // Select the newly uploaded image
          if (lastUploadedMediaId && lastUploadedUrl) {
            // Select directly from URL
            setUrl(lastUploadedUrl);
            setStagedMediaId(lastUploadedMediaId);
            setPreviewOk(true);
          } else if (lastUploadedMediaId) {
            // If URL is not available, get from API
            setTimeout(async () => {
              try {
                const res = await fetch(`/api/media?id=${lastUploadedMediaId}`);
                if (res.ok) {
                  const data = await res.json();
                  const mediaItem = data.media;
                  if (mediaItem && (mediaItem.path || mediaItem.url)) {
                    setUrl(mediaItem.path || mediaItem.url);
                    setStagedMediaId(lastUploadedMediaId);
                    setPreviewOk(true);
                  }
                }
              } catch (e) {
                console.error("Could not select newly uploaded image:", e);
              }
            }, 600);
          }
          // Reload gallery
          window.dispatchEvent(new CustomEvent("gallery-reload"));
        }}
      />
    </>
  );
}
