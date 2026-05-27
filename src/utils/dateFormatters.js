/**
 * Format ISO date string to "DD MMM YYYY  HH:mm" format
 * @param {string} iso - ISO date string
 * @returns {string} Formatted date with time
 */
export const formatDateTime = (iso) => {
  if (!iso) return "—";
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }) + " " + date.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

/**
 * Format ISO date string to "DD MMM YYYY" format
 * @param {string} iso - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

/**
 * Format ISO date string to "DD MMM YYYY  HH:mm" format (with time)
 * Alternative variant used in some pages
 * @param {string} iso - ISO date string
 * @returns {string} Formatted date with time
 */
export const formatDateWithTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    + "  " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};
