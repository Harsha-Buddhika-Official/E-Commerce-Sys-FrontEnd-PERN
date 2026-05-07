import API from "../../../../../api/client";

export const fetchProductById = async (productId) => {
  try {
    const response = await API.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};

export const fetchProducts = async (params) => {
  try {
    const response = await API.get("/products", { params });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};