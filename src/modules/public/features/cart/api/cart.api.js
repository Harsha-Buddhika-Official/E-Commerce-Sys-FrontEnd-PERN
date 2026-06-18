import API from "../../../../../api/client.js";

export const getCart = async () => {
  return await API.get("/cart");
};

export const addCartItem = async ({ product_id, quantity = 1 }) =>{
  return await API.post("/cart", { product_id, quantity });
};

export const updateCartItem = async (itemId, quantity) =>{
  return await API.patch(`/cart/${itemId}`, { quantity });
};

export const removeCartItem = async (itemId) => {
  return await API.delete(`/cart/${itemId}`);
};

export const clearCart = async () => {
  return await API.delete("/cart");
};