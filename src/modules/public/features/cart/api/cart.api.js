import API from "../../../../../api/client.js";

export const getCart = () => API.get("/cart");

export const addCartItem = ({ product_id, quantity = 1 }) =>
  API.post("/cart", { product_id, quantity });

export const updateCartItem = (itemId, quantity) =>
  API.patch(`/cart/${itemId}`, { quantity });

export const removeCartItem = (itemId) => API.delete(`/cart/${itemId}`);

export const clearCart = () => API.delete("/cart");