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

  // Modal açılınca state güncelle
  useEffect(() => {
    if (!open) return;
    setUrl(heroUrl || initialUrl);
    setAlt(heroAlt || initialAlt);
    setStagedMediaId(heroMediaId || null);
    setPreviewOk(true);
    setError("");
    setUploadComplete(false);
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

  // Modal kapanınca upload iptal et
  useEffect(() => {
    if (!open && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [open]);

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
      setError("Sadece resim dosyaları");
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
      setError("Görsel URL gerekli");
      return;
    }
    setUploading(true);
    setError("");
    try {
      // Eğer silinen resimler arasında şu anki hero image varsa, generic-image'e dön
      if (deletedImages.some((img) => img.id === heroMediaId)) {
        setHeroUrl("/generic-image.png");
        setHeroAlt("Hero");
        setHeroMediaId(null);
        setOpen(false);
        setDeletedImages([]);
        return;
      }

      let finalUrl = url;
      let mime = stagedFile?.type || "image/png";
      let mediaId = null;

      // 1) Dosya seçildiyse önce storage'a yükle → /api/upload
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
          throw new Error("Upload başarısız: " + res.status + " - " + t);
        }
        const data = await res.json();
        finalUrl = data.url; // storage URL
        if (stagedPreview) URL.revokeObjectURL(stagedPreview);
        setStagedFile(null);
        setStagedPreview(null);
        abortControllerRef.current = null;
      }

      // 2) Önizleme için context'i güncelle
      setHeroUrl(finalUrl);
      setHeroAlt(alt);

      // 3) Media kaydı
      // Eğer galeriden seçildiyse (stagedMediaId varsa), yeni kayıt oluşturma
      if (stagedMediaId) {
        // Galeriden seçildi, mevcut media kaydını kullan
        mediaId = stagedMediaId;
      } else {
        // Yeni dosya yüklendi, media kaydı oluştur
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
          throw new Error("Media oluşturulamadı: " + errorText);
        }
        const created = await mediaRes.json();
        mediaId = created.media.id;
      }

      // 4) Page context → hero_media_id'yi bağla (Save All PATCH'inde DB'ye yazılacak)
      setHeroMediaId(mediaId);

      setOpen(false);
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message || "Güncellenemedi");
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
                // Yeni yüklenen resmin bilgilerini API'den al
                const res = await fetch(`/api/media?id=${lastUploadedMediaId}`);
                if (res.ok) {
                  const data = await res.json();
                  const mediaItem = data.media;
                  if (mediaItem && mediaItem.path) {
                    setUrl(mediaItem.path);
                    setStagedMediaId(lastUploadedMediaId);
                    setPreviewOk(true);
                  }
                }
              } catch (e) {
                console.error("Yeni yüklenen resim seçilemedi:", e);
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



