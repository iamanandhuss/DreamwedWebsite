/**
 * Bulletproof localStorage wrapper that never throws SecurityError / QuotaExceededError
 * in iOS Safari Private Browsing mode, Instagram/WhatsApp webviews, or restricted environments.
 */
export const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window === "undefined" || !window.localStorage) return null;
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key, val) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch (e) {}
  },
  removeItem: (key) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {}
  }
};

export const getApiBase = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const custom = window.localStorage.getItem("dreamwed_api_base");
      if (custom) return custom;
    }
  } catch (e) {}
  return import.meta.env.VITE_API_BASE_URL || "https://dreamwed-backend.onrender.com";
};

export default safeStorage;
