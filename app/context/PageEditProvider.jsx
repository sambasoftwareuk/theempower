"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";

const PageEditContext = createContext(null);

function scopeFromPage(slug) {
  if (!slug) return "gallery";
  return slug;
}

export function PageEditProvider({
  initialHeroUrl,
  initialHeroAlt,
  initialHeroMediaId,
  initialTitle,
  initialSubtitle,
  pageId,
  locale,
  children,
  pageSlug,
}) {
  const [heroUrl, setHeroUrl] = useState(initialHeroUrl || "");
  const [heroAlt, setHeroAlt] = useState(initialHeroAlt || "");
  const [heroMediaId, setHeroMediaId] = useState(initialHeroMediaId || null);
  const [title, setTitle] = useState(initialTitle || "");
  const [subtitle, setSubtitle] = useState(initialSubtitle || "");
  const [deletedImages, setDeletedImages] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // isDirty state - herhangi bir değişiklik var mı?
  const [isDirty, setIsDirty] = useState(false);

  // Değerler değiştiğinde localStorage'a kaydet
  const saveToStorage = (key, value) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        `pageEdit_${pageSlug}_${key}`,
        JSON.stringify(value)
      );
    } catch (e) {
      console.error("localStorage save error:", e);
    }
  };

  const mediaScope = useMemo(() => scopeFromPage(pageSlug), [pageSlug]);

  const baselineRef = useRef({
    heroUrl: initialHeroUrl || "",
    heroAlt: initialHeroAlt || "",
    heroMediaId: initialHeroMediaId || null,
    title: initialTitle || "",
    subtitle: initialSubtitle || "",
  });

  // Client-side'da localStorage'dan değerleri yükle (hydration hatasını önlemek için)
  useEffect(() => {
    setIsClient(true);

    if (typeof window === "undefined") return;

    const getStored = (key, defaultValue) => {
      try {
        const stored = localStorage.getItem(`pageEdit_${pageSlug}_${key}`);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch {
        return defaultValue;
      }
    };

    const storedHeroUrl = getStored("heroUrl", null);
    const storedHeroAlt = getStored("heroAlt", null);
    const storedHeroMediaId = getStored("heroMediaId", null);
    const storedTitle = getStored("title", null);
    const storedSubtitle = getStored("subtitle", null);

    if (storedHeroUrl) {
      setHeroUrl(storedHeroUrl);
      baselineRef.current.heroUrl = storedHeroUrl;
    }
    if (storedHeroAlt) {
      setHeroAlt(storedHeroAlt);
      baselineRef.current.heroAlt = storedHeroAlt;
    }
    if (storedHeroMediaId !== null) {
      setHeroMediaId(storedHeroMediaId);
      baselineRef.current.heroMediaId = storedHeroMediaId;
    }
    if (storedTitle) {
      setTitle(storedTitle);
      baselineRef.current.title = storedTitle;
    }
    if (storedSubtitle) {
      setSubtitle(storedSubtitle);
      baselineRef.current.subtitle = storedSubtitle;
    }
  }, [pageSlug]);

  const resetHero = () => {
    setHeroUrl(baselineRef.current.heroUrl);
    setHeroAlt(baselineRef.current.heroAlt);
    setHeroMediaId(baselineRef.current.heroMediaId);
    saveToStorage("heroUrl", baselineRef.current.heroUrl);
    saveToStorage("heroAlt", baselineRef.current.heroAlt);
    saveToStorage("heroMediaId", baselineRef.current.heroMediaId);
  };

  const resetTitle = () => {
    setTitle(baselineRef.current.title);
    saveToStorage("title", baselineRef.current.title);
    // isDirty otomatik güncellenecek (useEffect sayesinde)
  };

  const resetSubtitle = () => {
    setSubtitle(baselineRef.current.subtitle);
    saveToStorage("subtitle", baselineRef.current.subtitle);
    // isDirty otomatik güncellenecek (useEffect sayesinde)
  };

  // setHeroUrl, setHeroAlt, setHeroMediaId'i wrap et ki localStorage'a kaydetsin
  const setHeroUrlWithStorage = (url) => {
    setHeroUrl(url);
    saveToStorage("heroUrl", url);
  };

  const setHeroAltWithStorage = (alt) => {
    setHeroAlt(alt);
    saveToStorage("heroAlt", alt);
  };

  const setHeroMediaIdWithStorage = (id) => {
    setHeroMediaId(id);
    saveToStorage("heroMediaId", id);
  };

  const setTitleWithStorage = (newTitle) => {
    setTitle(newTitle);
    saveToStorage("title", newTitle);
  };

  const setSubtitleWithStorage = (newSubtitle) => {
    setSubtitle(newSubtitle);
    saveToStorage("subtitle", newSubtitle);
  };

  // isDirty kontrolü - herhangi bir değişiklik var mı?
  useEffect(() => {
    const dirty = (
      heroUrl !== baselineRef.current.heroUrl ||
      heroAlt !== baselineRef.current.heroAlt ||
      heroMediaId !== baselineRef.current.heroMediaId ||
      title !== baselineRef.current.title ||
      subtitle !== baselineRef.current.subtitle
    );
    setIsDirty(dirty);
  }, [heroUrl, heroAlt, heroMediaId, title, subtitle]);

  // Backend fonksiyonları - ImageEditor ve diğer component'ler için
  const uploadImage = async (file, signal = null) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      signal,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error("Upload failed: " + res.status + " - " + errorText);
    }

    return await res.json();
  };

  const createMedia = async (url, altText, mimeType) => {
    const newMedia = addMockMedia(mediaScope, {
      url,
      alt_text: altText || null,
      mime_type: mimeType,
    });
    return { id: newMedia.id, media: { id: newMedia.id } };
  };

  const getMedia = async (id) => {
    const allItems = listMockMedia(mediaScope);
    const item = allItems.find((item) => item.id === id);
    if (!item) {
      throw new Error("Media not found");
    }
    return { media: { id: item.id, path: item.url, url: item.url } };
  };

=======
      subtitle !== baselineRef.current.subtitle
    );
    setIsDirty(dirty);
  }, [heroUrl, heroAlt, heroMediaId, title, subtitle]);

>>>>>>> 172d998 (Import image editor components from feat/editPage)
  // SaveAll - database'e kaydet (şimdilik mockdata)
  const saveAll = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      // API çağrısı (şimdilik mockdata, sonra database)
      // const response = await fetch(`/api/pages/${pageId}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     title,
      //     subtitle,
      //     heroMediaId,
      //   }),
      // });
      // if (!response.ok) {
      //   throw new Error("Kaydetme başarısız");
      // }

      // Mockdata güncelleme (geçici çözüm)
      const response = await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          heroMediaId,
        }),
      });

      if (!response.ok) {
        throw new Error("Kaydetme başarısız");
      }

      // Başarılı olursa baseline'ı güncelle
      baselineRef.current.heroUrl = heroUrl;
      baselineRef.current.heroAlt = heroAlt;
      baselineRef.current.heroMediaId = heroMediaId;
      baselineRef.current.title = title;
      baselineRef.current.subtitle = subtitle;
      
      // isDirty'yi false yap (butonun gri olması için)
      setIsDirty(false);
    } catch (error) {
      console.error("SaveAll error:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageEditContext.Provider
      value={{
        heroUrl,
        setHeroUrl: setHeroUrlWithStorage,
        heroAlt,
        setHeroAlt: setHeroAltWithStorage,
        heroMediaId,
        setHeroMediaId: setHeroMediaIdWithStorage,
        title,
        setTitle: setTitleWithStorage,
        subtitle,
        setSubtitle: setSubtitleWithStorage,
        resetHero,
        resetTitle,
        resetSubtitle,
        deletedImages,
        setDeletedImages,
        pageId,
        locale,
        pageSlug,
        mediaScope,
        isDirty,
        saveAll,
        saving,
      }}
    >
      {children}
    </PageEditContext.Provider>
  );
}

export function usePageEdit() {
  const ctx = useContext(PageEditContext);
  if (!ctx) throw new Error("usePageEdit must be used within PageEditProvider");
  return ctx;
}
