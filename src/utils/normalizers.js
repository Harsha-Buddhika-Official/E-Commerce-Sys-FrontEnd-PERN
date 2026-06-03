export function safeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function safeMoney(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function safeText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function safeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function normalizeStatus(value) {
  const status = safeText(value);
  return status ? status.toLowerCase() : null;
}

export function normalizePassword(value) {
  return typeof value === "string" ? value.trim() : null;
}

export function normalizeRole(value) {
  const role = safeText(value);
  return role ? role.toLowerCase() : null;
}

export function normalizeBoolean(value) {
  if (typeof value === "boolean") return value;

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "active"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "inactive"].includes(normalized)) {
      return false;
    }
  }

  return false;
}

export default {
  safeNumber,
  safeMoney,
  safeText,
  safeDate,
  normalizeStatus,
  normalizePassword,
  normalizeRole,
  normalizeBoolean,
};
