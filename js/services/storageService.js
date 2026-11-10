// js/services/storageService.js — Centralized LocalStorage Service
const STORAGE_VERSION = 2;

export const storageService = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && 'version' in parsed) {
        if (parsed.version === STORAGE_VERSION) {
          return parsed.data ?? parsed.items ?? fallback;
        }
        return fallback; // stale version
      }
      return parsed;
    } catch {
      return fallback;
    }
  },

  set(key, data, emitEventName = null) {
    try {
      const payload = {
        version: STORAGE_VERSION,
        timestamp: Date.now(),
        data: data
      };
      localStorage.setItem(key, JSON.stringify(payload));
      if (emitEventName) {
        window.dispatchEvent(new CustomEvent(emitEventName, { detail: data }));
      }
      return true;
    } catch (e) {
      console.error(`StorageService error writing key "${key}":`, e);
      return false;
    }
  },

  remove(key, emitEventName = null) {
    try {
      localStorage.removeItem(key);
      if (emitEventName) {
        window.dispatchEvent(new CustomEvent(emitEventName, { detail: null }));
      }
      return true;
    } catch {
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
};
