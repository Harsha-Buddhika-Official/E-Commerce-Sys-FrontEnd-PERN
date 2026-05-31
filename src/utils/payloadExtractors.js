// Utilities to normalize common API response shapes into usable payloads
export function extractArrayPayload(payload) {
  if (payload?.success !== undefined) {
    if (!payload.success) throw new Error(payload.message || "API request failed");
    return payload.data;
  }
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  throw new Error(`Expected array payload from API, got ${typeof payload}`);
}

export function extractObjectPayload(payload) {
  if (payload?.success !== undefined) {
    if (!payload.success) throw new Error(payload.message || "API request failed");
    return payload.data;
  }
  if (payload && typeof payload === "object") return payload;
  throw new Error(`Expected object payload from API, got ${typeof payload}`);
}

export default {
  extractArrayPayload,
  extractObjectPayload,
};
