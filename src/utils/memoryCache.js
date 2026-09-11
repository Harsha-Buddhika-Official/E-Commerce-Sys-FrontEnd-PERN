const store = new Map();

export const getMemoryCache = (key, maxAge) => {
    const entry = store.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > maxAge;
    if (isExpired) {
        store.delete(key);
        return null;
    }

    return entry.data;
};

export const setMemoryCache = (key, data) => {
    store.set(key, { data, timestamp: Date.now() });
};

export const clearMemoryCache = (key) => {
    store.delete(key);
};