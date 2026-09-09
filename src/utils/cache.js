// utils/cache.js

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const getCache = (key, maxAge = DAY_IN_MS) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        const { data, timestamp } = JSON.parse(raw);
        const isExpired = Date.now() - timestamp > maxAge;

        if (isExpired) {
            localStorage.removeItem(key);
            return null;
        }

        return data;
    } catch {
        // corrupted cache entry — don't let it break the app
        localStorage.removeItem(key);
        return null;
    }
};

export const setCache = (key, data) => {
    try {
        localStorage.setItem(
            key,
            JSON.stringify({ data, timestamp: Date.now() })
        );
    } catch {
        // localStorage might be full or blocked (private mode) — fail silently
    }
};

export const clearCache = (key) => {
    localStorage.removeItem(key);
};