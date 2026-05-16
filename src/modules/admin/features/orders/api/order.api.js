import API from "../../../../../api/client";

export const fetchOrders = () => API.get("/orders");
export const fetchOrderStats = () => API.get("/orders/admin/order-status-count");