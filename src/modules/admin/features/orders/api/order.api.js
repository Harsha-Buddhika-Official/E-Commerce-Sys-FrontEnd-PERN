import API from "../../../../../api/client";

export const fetchOrderStats = async () => {
  const res = await API.get("/orders/admin/order-status-count");
  return res.data;
};

export const fetchAllOrders = async () => {
  const res = await API.get("/orders/admin/all");
  return res.data;
};

export const fetchOrderDetail = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");
  const res = await API.get(`/orders/admin/${orderId}`);
  return res.data;
};

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
    // normalize axios error for caller in a portable way
    const message = err?.response?.data?.message || err?.message || "Network error";
    console.error("updateOrderStatus API error:", { orderId, newStatus, status: err?.response?.status, body: err?.response?.data, message });
    const e = new Error(message);
    e.originalError = err;
    throw e;
  }
};