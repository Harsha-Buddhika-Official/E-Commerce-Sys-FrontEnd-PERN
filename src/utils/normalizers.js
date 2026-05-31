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

export default {
  safeNumber,
  safeMoney,
  safeText,
  safeDate,
  normalizeStatus,
};
