"use client";

import seedMedia from "../mocks/mediaGallery.json";

const STORAGE_KEY = "mockMediaGalleryStore";

const buildInitialStore = () => {
  const store = {};
  seedMedia.forEach((item) => {
    const scope = item.scope || "gallery";
    if (!store[scope]) store[scope] = [];
    store[scope].push({ ...item });
  });
  return store;
};

let memoryStore = null;

const readStore = () => {
  if (memoryStore) return memoryStore;

  const initial = buildInitialStore();

  if (typeof window === "undefined") {
    memoryStore = initial;
    return memoryStore;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      memoryStore = initial;
      return memoryStore;
    }
    memoryStore = JSON.parse(raw);
    return memoryStore;
  } catch (error) {
    console.warn("Mock gallery storage okunamadı, sıfırlanıyor:", error);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    memoryStore = initial;
    return memoryStore;
  }
};

const writeStore = (store) => {
  memoryStore = store;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
};

const cloneItems = (items = []) => items.map((item) => ({ ...item }));

const getScopeKey = (scope) => (scope && scope.trim() ? scope : "gallery");

export const listMockMedia = (scope) => {
  const store = readStore();
  const key = getScopeKey(scope);
  return cloneItems(store[key] || []);
};

const createId = (key) => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${key}-${crypto.randomUUID()}`;
  }
  return `${key}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const addMockMedia = (scope, media) => {
  const store = readStore();
  const key = getScopeKey(scope);
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
  const key = getScopeKey(scope);
  if (!store[key]) return false;
  const next = store[key].filter((item) => item.id !== id);
  const removed = next.length !== store[key].length;
  store[key] = next;
  writeStore(store);
  return removed;
};

export const clearMockMedia = (scope) => {
  const store = readStore();
  const key = getScopeKey(scope);
  store[key] = [];
  writeStore(store);
};

