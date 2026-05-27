/**
 * Get status badge config for promotion/offer based on dates and active state
 * @param {string} start - ISO start date
 * @param {string} end - ISO end date
 * @param {boolean} isActive - Whether promotion is active
 * @returns {object} Status config with label, bg color, text color, and border color
 */
export const getStatus = (start, end, isActive) => {
  if (!isActive) return { label: "Inactive", bg: "#f5f5f5", color: "#aaa", border: "#e5e5e5" };
  const now = new Date();
  const s = new Date(start);
  const e = new Date(end);
  if (now < s) return { label: "Scheduled", bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" };
  if (now > e) return { label: "Expired", bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" };
  return { label: "Active", bg: "#dcfce7", color: "#16a34a", border: "#86efac" };
};

/**
 * Calculate days remaining until end date
 * @param {string} end - ISO end date
 * @returns {object} { expired: boolean, days: number }
 */
export const daysRemaining = (end) => {
  const diff = new Date(end) - new Date();
  if (diff <= 0) return { expired: true, days: 0 };
  return { expired: false, days: Math.ceil(diff / (1000 * 60 * 60 * 24)) };
};
