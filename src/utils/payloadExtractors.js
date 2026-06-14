export function extractArrayPayload(payload) {
  if (payload?.success !== undefined) {
    if (!payload.success) throw new Error(payload.message || "API request failed");
    if (!Array.isArray(payload.data)) {
      throw new Error(`Expected array in 'data' field, got ${typeof payload.data}`);
    }
    return payload.data;
  }
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  throw new Error(`Expected array payload from API, got ${typeof payload}`);
}

export function extractObjectPayload(payload) {
  if (payload?.success !== undefined) {
    if (!payload.success) throw new Error(payload.message || "API request failed");
    if (payload.data === undefined || payload.data === null) {
      throw new Error("Expected 'data' field in API response, but it was missing");
    }
    return payload.data;
  }
  if (payload && typeof payload === "object") return payload;
  throw new Error(`Expected object payload from API, got ${typeof payload}`);
}

export default {
  extractArrayPayload,
  extractObjectPayload,
};