"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { usePageEdit } from "../context/PageEditProvider";
import EditButton from "../_atoms/EditButton";
import XButton from "../_atoms/XButton";
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
    uploadImage,
    createMedia,
    getMedia,
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

  // Modal açılınca state güncelle, kapandığında upload iptal et
  useEffect(() => {
    if (open) {
      // Modal açıldığında state güncelle
      setUrl(heroUrl || initialUrl);
      setAlt(heroAlt || initialAlt);
      setStagedMediaId(heroMediaId || null);
      setPreviewOk(true);
      setError("");
      setUploadComplete(false);
    } else {
      // Modal kapandığında upload iptal et
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

  // Seçme / staging
  const handleFileSelected = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Only image files allowed");
      return;
    }

    // Eski upload varsa iptal et
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

    // Eğer silinen resimler arasında şu anki hero image varsa, generic-image'e dön
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
      const mime = stagedFile?.type || "image/png";

      // 1) Dosya seçildiyse önce storage'a yükle
      if (stagedFile) {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const data = await uploadImage(stagedFile, controller.signal);

        // Cleanup staged preview
        if (stagedPreview) URL.revokeObjectURL(stagedPreview);
        setStagedFile(null);
        setStagedPreview(null);
        abortControllerRef.current = null;

        finalUrl = data.url;
      }

      // 2) Media kaydı oluştur veya mevcut ID'yi kullan
      let mediaId;
      if (stagedMediaId) {
        // Galeriden seçildi, mevcut media kaydını kullan
        mediaId = stagedMediaId;
      } else {
        // Yeni dosya yüklendi, media kaydı oluştur
        const created = await createMedia(finalUrl, alt, mime);
        mediaId = created.id || created.media?.id;
      }

      // 3) Context'i güncelle
      setHeroUrl(finalUrl);
      setHeroAlt(alt);
      setHeroMediaId(mediaId);

      setOpen(false);
    } catch (e) {
      if (e.name !== "AbortError") {
        setError(e.message || "Güncellenemedi");
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
          setStagedMediaId(id); // Galeriden seçildiğini işaretle
          setPreviewOk(true);
        }}
        onSave={async () => {
          // Önce silme işlemlerini uygula (BodyEditorModal'da yapılıyor)
          // Sonra kaydet
          await apply();
          // Silme işlemi başarılı olduktan sonra deletedImages listesini temizle
          setDeletedImages([]);
        }}
        saving={uploading}
        error={error}
        onDeleteImage={(image) => setDeletedImages((prev) => [...prev, image])}
        deletedImages={deletedImages}
        onUploadComplete={(lastUploadedMediaId) => {
          setUploadComplete(true);
          // Son yüklenen resmi seçili yap
          if (lastUploadedMediaId) {
            // Galeriyi yenile ve sonra seçili yap
            setTimeout(async () => {
              try {
                // Yeni yüklenen resmin bilgilerini al
                const data = await getMedia(lastUploadedMediaId);
                const mediaItem = data.media;
                if (mediaItem && (mediaItem.path || mediaItem.url)) {
                  setUrl(mediaItem.path || mediaItem.url);
                  setStagedMediaId(lastUploadedMediaId);
                  setPreviewOk(true);
                }
              } catch (e) {
                setError("Failed to select newly uploaded image: " + e.message);
              }
            }, 600);
          }
          // Galeriyi yenile
          window.dispatchEvent(new CustomEvent("gallery-reload"));
        }}
      />
    </>
  );
}
