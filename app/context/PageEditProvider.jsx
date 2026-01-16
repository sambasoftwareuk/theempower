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
  initialBodyHtml,
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
  const [bodyHtml, setBodyHtml] = useState(initialBodyHtml || "");
  const [deletedImages, setDeletedImages] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingHero, setSavingHero] = useState(false);
  const [savingBody, setSavingBody] = useState(false);

  // isDirty state'leri - hero ve body ayrı ayrı
  const [isHeroDirty, setIsHeroDirty] = useState(false);
  const [isBodyDirty, setIsBodyDirty] = useState(false);
  // Yetki kontrolü
const [hasPermission, setHasPermission] = useState(false);
const [permissionLoaded, setPermissionLoaded] = useState(false);

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
    bodyHtml: initialBodyHtml || "",
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
    const storedBodyHtml = getStored("bodyHtml", null);

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
    // bodyHtml için: boş string, null veya boş object ise localStorage'dan yükleme
    // Sadece gerçek bir değer varsa (string veya object) yükle
    const isValidBodyHtml =
      storedBodyHtml !== null &&
      storedBodyHtml !== "" &&
      storedBodyHtml !== "{}" &&
      !(typeof storedBodyHtml === "string" && storedBodyHtml.trim() === "");

    if (isValidBodyHtml) {
      setBodyHtml(storedBodyHtml);
      baselineRef.current.bodyHtml = storedBodyHtml;
    } else {
      // localStorage'da geçersiz değer varsa, initial değeri kullan ve baseline'ı güncelle
      if (
        initialBodyHtml &&
        (typeof initialBodyHtml === "object" || initialBodyHtml !== "")
      ) {
        setBodyHtml(initialBodyHtml);
        baselineRef.current.bodyHtml = initialBodyHtml;
      }
    }
  }, [pageSlug, initialBodyHtml]);

  // Kullanıcının yetkilerini kontrol et
useEffect(() => {
  const checkPermission = async () => {
    if (!pageSlug && !pageId) {
      setPermissionLoaded(true);
      return;
    }

    try {
      // Slug veya content_id ile yetki kontrolü yap
      const url = pageId 
        ? `/api/permissions/check?content_id=${pageId}`
        : `/api/permissions/check?slug=${pageSlug}&locale=${locale || "en"}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setHasPermission(data.hasPermission || false);
      } else {
        setHasPermission(false);
      }
    } catch (error) {
      console.error("Failed to check permissions:", error);
      setHasPermission(false);
    } finally {
      setPermissionLoaded(true);
    }
  };

  checkPermission();
}, [pageSlug, pageId, locale]);

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
  };

  const resetSubtitle = () => {
    setSubtitle(baselineRef.current.subtitle);
    saveToStorage("subtitle", baselineRef.current.subtitle);
  };

  const resetBody = () => {
    setBodyHtml(baselineRef.current.bodyHtml);
    saveToStorage("bodyHtml", baselineRef.current.bodyHtml);
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

  const setBodyHtmlWithStorage = (newBodyHtml) => {
    setBodyHtml(newBodyHtml);
    saveToStorage("bodyHtml", newBodyHtml);
  };

  // isHeroDirty kontrolü - hero kısmında değişiklik var mı?
  useEffect(() => {
    const dirty =
      heroUrl !== baselineRef.current.heroUrl ||
      heroAlt !== baselineRef.current.heroAlt ||
      heroMediaId !== baselineRef.current.heroMediaId ||
      title !== baselineRef.current.title ||
      subtitle !== baselineRef.current.subtitle;
    setIsHeroDirty(dirty);
  }, [heroUrl, heroAlt, heroMediaId, title, subtitle]);

  // isBodyDirty kontrolü - body kısmında değişiklik var mı?
  useEffect(() => {
    const dirty = bodyHtml !== baselineRef.current.bodyHtml;
    setIsBodyDirty(dirty);
  }, [bodyHtml]);

  // saveHero - hero kısmını kaydet (title, subtitle, hero image)
  const saveHero = async () => {
  if (!isHeroDirty) return;

  setSavingHero(true);
  try {
    const response = await fetch(
      `/api/content/by-slug/${pageSlug}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          title,
          excerpt: subtitle,
          hero_media_id: heroMediaId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Hero save failed");
    }

    // baseline güncelle
    baselineRef.current.heroUrl = heroUrl;
    baselineRef.current.heroAlt = heroAlt;
    baselineRef.current.heroMediaId = heroMediaId;
    baselineRef.current.title = title;
    baselineRef.current.subtitle = subtitle;

    saveToStorage("heroUrl", heroUrl);
    saveToStorage("heroAlt", heroAlt);
    saveToStorage("heroMediaId", heroMediaId);
    saveToStorage("title", title);
    saveToStorage("subtitle", subtitle);

    setIsHeroDirty(false);
  } catch (error) {
    console.error("saveHero error:", error);
    throw error;
  } finally {
    setSavingHero(false);
  }
};


  // saveBody - body kısmını kaydet
  const saveBody = async () => {
  if (!isBodyDirty) return;

  setSavingBody(true);
  try {
    const response = await fetch(
      `/api/content/by-slug/${pageSlug}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          body_richtext: bodyHtml,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Body save failed");
    }

    baselineRef.current.bodyHtml = bodyHtml;
    saveToStorage("bodyHtml", bodyHtml);
    setIsBodyDirty(false);
  } catch (error) {
    console.error("saveBody error:", error);
    throw error;
  } finally {
    setSavingBody(false);
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
        bodyHtml,
        setBodyHtml: setBodyHtmlWithStorage,
        resetHero,
        resetTitle,
        resetSubtitle,
        resetBody,
        deletedImages,
        setDeletedImages,
        pageId,
        locale,
        pageSlug,
        mediaScope,
        isHeroDirty,
        isBodyDirty,
        saveHero,
        saveBody,
        savingHero,
        savingBody,
        // Backward compatibility için
        isDirty: isHeroDirty || isBodyDirty,
        saveAll: async () => {
          await saveHero();
          await saveBody();
        },
        saving: savingHero || savingBody,
        hasPermission,
        permissionLoaded,
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
