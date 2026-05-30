import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";


// for dashboard recent orders and stats
export const fetchRecentOrders = async () => {
  try {
    const res = await API.get("/orders/admin/recent-orders");
    return res.data;
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to fetch recent orders"
    );
  }
};

// for order page order status counts
export const fetchOrderStats = async () => {
  try {
    const res = await API.get("/orders/admin/order-status-count");
    return res.data;
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to fetch order stats"
    );
  }
};

// for order page order list and details
export const fetchAllOrders = async () => {
  try {
    const res = await API.get("/orders/admin/orders");
    return res.data;
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to fetch all orders"
    );
  }
};

export const fetchOrderDetail = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");
  try {
    const res = await API.get(`/orders/admin/${orderId}`);
    return res.data;
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to fetch order details"
    );
  }
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
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to update order status"
    );
  }
};