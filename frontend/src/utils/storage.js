// A utility for safely accessing sessionStorage to prevent "Access is denied for this document" 
// and "QuotaExceededError" which commonly occurs in embedded environments, strict privacy modes, 
// or when cookies/storage are disabled by the user or organizational policies.

export const safeSessionStorage = {
    setItem(key, value) {
        try {
            sessionStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.warn(`[SafeSessionStorage] Failed to set ${key}:`, e);
            return false;
        }
    },
    getItem(key) {
        try {
            return sessionStorage.getItem(key);
        } catch (e) {
            console.warn(`[SafeSessionStorage] Failed to get ${key}:`, e);
            return null;
        }
    },
    removeItem(key) {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn(`[SafeSessionStorage] Failed to remove ${key}:`, e);
            return false;
        }
    },
    clear() {
        try {
            sessionStorage.clear();
            return true;
        } catch (e) {
            console.warn('[SafeSessionStorage] Failed to clear:', e);
            return false;
        }
    }
};
