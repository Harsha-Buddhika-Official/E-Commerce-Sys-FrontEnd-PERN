import API from "../../../../../api/client";

export const fetchOrders = () => API.get("/orders");