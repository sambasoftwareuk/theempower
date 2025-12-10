"use client";

import seedMedia from "../mocks/mediaGallery.json";

const STORAGE_KEY = "mockMediaGalleryStore";

// Sadece 1 defa hesapla - module yüklendiğinde bir kez çalışır
const INITIAL_STORE = (() => {
  const store = {};
  seedMedia.forEach((item) => {
    const scope = item.scope || "gallery";
    if (!store[scope]) store[scope] = [];
    store[scope].push({ ...item });
  });
  return store;
})();

// Closure kullanarak memoryStore'u local scope'ta tut
const getStoreManager = (() => {
  let memoryStore = null;

  const readStore = () => {
    if (memoryStore) {
      return memoryStore;
    }

    if (typeof window === "undefined") {
      memoryStore = INITIAL_STORE;
      return memoryStore;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STORE));
        memoryStore = INITIAL_STORE;
        return memoryStore;
      }
      memoryStore = JSON.parse(raw);
      return memoryStore;
    } catch (error) {
      // localStorage okunamazsa sessizce sıfırla
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STORE));
      memoryStore = INITIAL_STORE;
      return memoryStore;
    }
  };

  const writeStore = (store) => {
    memoryStore = store;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }
  };

  return { readStore, writeStore };
})();

const readStore = getStoreManager.readStore;
const writeStore = getStoreManager.writeStore;

const cloneItems = (items = []) => items.map((item) => ({ ...item }));

const normalizeScope = (scope) => scope?.trim() || "gallery";

export const listMockMedia = (scope) => {
  const store = readStore();
  const key = normalizeScope(scope);
  const items = cloneItems(store[key] || []);
  return items;
};

const createId = (prefix = "id") => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  // randomUUID yoksa fallback
  return `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now()}`;
};

export const addMockMedia = (scope, media) => {
  const store = readStore();
  const key = normalizeScope(scope);
  const newItem = {
    id: media.id || createId(key),
    url: media.url,
    alt: media.alt || media.alt_text || "Yeni görsel",
    scope: key,
    createdAt: Date.now(),
  };
  store[key] = [newItem, ...(store[key] || [])];
  writeStore(store);
  return { ...newItem };
};

export const removeMockMedia = (scope, id) => {
  const store = readStore();
  const key = normalizeScope(scope);
  if (!store[key]) {
    return false;
  }
  const beforeLength = store[key].length;
  const next = store[key].filter((item) => item.id !== id);
  const removed = next.length !== beforeLength;
  store[key] = next;
  writeStore(store);
  return removed;
};

export const clearMockMedia = (scope) => {
  const store = readStore();
  const key = normalizeScope(scope);
  store[key] = [];
  writeStore(store);
};
