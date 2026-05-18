import API from "../../../../../api/client";

/**
 * Fetch detailed product data for the admin product info page.
 */
export const fetchProductDetail = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  try {
    const res = await API.get(`/products/admin/products/${productId}`);
    return res.data;
  } catch (e) {
    const error = new Error(e.response?.data?.message || "Failed to fetch product details");
    error.originalError = e;
    error.status = e.response?.status;
    error.body = e.response?.data;
    throw error;
  }
};