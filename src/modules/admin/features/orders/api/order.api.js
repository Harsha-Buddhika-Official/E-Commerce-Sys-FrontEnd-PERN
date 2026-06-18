import API from "../../../../../api/client";

// for dashboard recent orders and stats
export const fetchRecentOrders = async () => {
  const res = await API.get("/orders/admin/recent-orders");
  return res.data;
};

// for order page order status counts
export const fetchOrderStats = async () => {
  const res = await API.get("/orders/admin/order-status-count");
  return res.data;
};

// for order page order list and details
export const fetchAllOrders = async () => {
  const res = await API.get("/orders/admin/orders");
  return res.data;
};

// for order page order details
export const fetchOrderDetail = async (orderId) => {
  const res = await API.get(`/orders/admin/${orderId}`);
  return res.data;
};

export const getOrderReceiptAPI = async (orderId) => {
  const { data } = await API.get(`/orders/admin/receipt/${orderId}`);
  return data;
};

// for order page order status update
export const updateOrderStatus = async (orderId, newStatus) => {
  const res = await API.put(`/orders/admin/state/${orderId}`, { newStatus });
  return res.data;
};