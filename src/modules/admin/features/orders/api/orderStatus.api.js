import API from "../../../../../api/client";

/**
 * Update order status for admin.
 * POST /orders/admin/state/:id with body { newStatus }
 * @param {string|number} orderId
 * @param {string} newStatus
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  if (!orderId) throw new Error("orderId is required");
  if (!newStatus) throw new Error("newStatus is required");
  try {
    // explicit JSON header and logging for easier debugging
    const res = await API.put(`/orders/admin/state/${orderId}`, { newStatus }, {
      headers: { "Content-Type": "application/json" },
    });
    // server response body
    return res.data;
  } catch (err) {
    // normalize axios error for caller
    const message = err?.response?.data?.message || err?.message || "Network error";
    console.error("updateOrderStatus API error:", { orderId, newStatus, status: err?.response?.status, body: err?.response?.data, message });
    throw new Error(message, { cause: err });
  }
};
