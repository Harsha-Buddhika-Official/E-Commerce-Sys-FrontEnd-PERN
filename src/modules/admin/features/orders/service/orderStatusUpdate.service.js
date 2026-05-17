import { updateOrderStatus as apiUpdate } from "../api/orderStatus.api";

const ALLOWED_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

/**
 * Change order status using API and return updated order data (or server response).
 * Validates inputs and coerces types to match backend expectations.
 * @param {string|number} orderId
 * @param {string} newStatus
 * @returns {Promise<Object>} server response `data`
 */
export const changeOrderStatus = async (orderId, newStatus) => {
  if (orderId === undefined || orderId === null) throw new Error("orderId is required");
  if (!newStatus) throw new Error("newStatus is required");

  const id = Number(orderId);
  if (Number.isNaN(id)) throw new Error("orderId must be a number");

  if (!ALLOWED_STATUSES.includes(String(newStatus))) {
    throw new Error(`newStatus must be one of: ${ALLOWED_STATUSES.join(", ")}`);
  }

  try {
    const res = await apiUpdate(id, String(newStatus));
    if (!res || typeof res !== "object") throw new Error("Invalid API response");
    if (res.success !== true) throw new Error(res.message || "Failed to update status");

    // return updated order record (server provides it in res.data)
    return res.data;
  } catch (err) {
    console.error("changeOrderStatus service error:", err instanceof Error ? err.message : err);
    throw err;
  }
};
