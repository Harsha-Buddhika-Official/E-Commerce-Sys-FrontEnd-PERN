import API from "../../../../../api/client";

export const getAllProducts = () => API.get("/products");
export const getProductsByCategory = (category) => API.get(`/products/category/${category}`);