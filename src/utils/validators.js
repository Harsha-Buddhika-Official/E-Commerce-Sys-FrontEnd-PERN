export const ensurePayload = (payload, message = "Payload is required") => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(message);
  }
  return payload;
};