import axios from "axios";

const CART_API = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

export const getCart = () => CART_API.get("/cart");

export const addCartItem = ({ product_id, quantity = 1 }) =>
  CART_API.post("/cart", { product_id, quantity });

export const updateCartItem = (itemId, quantity) =>
  CART_API.patch(`/cart/${itemId}`, { quantity });

export const removeCartItem = (itemId) => CART_API.delete(`/cart/${itemId}`);

export const clearCart = () => CART_API.delete("/cart");