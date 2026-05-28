import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";

/**
 * Fetch all products with limited details from admin endpoint
 * Returns: {success: true, data: [...], message: string}
 */
export const fetchAllProductsLimited = async () => {
  try {
    const res = await API.get("/products/admin/limited-details");
    return res.data; // Already unwrapped by client interceptor
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to fetch products"
    );
  }
};

export const fetchProductDetail = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  try {
    const res = await API.get(`/products/admin/products/${productId}`);
    return res.data;
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to fetch product details"
    );
  }
};

export const deleteProduct = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }
  try {
    const res = await API.delete(`/products/admin/delete/${productId}`);
    return res.data;
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to delete product"
    );
  }
};

export const fetchProductsLimitedData = async () => {
  try {
    const res = await API.get("/products/admin/simple-details");
    return res.data?.data ?? [];
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to fetch limited product data"
    );
  }
};
