import API from "../../../../../api/client";

/**
 * Fetch all products with limited details from admin endpoint
 * Returns: {success: true, data: [...], message: string}
 */
export const fetchAllProductsLimited = async () => {
  try {
    const res = await API.get("/products/admin/limited-details");
    return res.data; // Already unwrapped by client interceptor
  } catch (e) {
    const error = new Error(e.response?.data?.message || "Failed to fetch products");
    error.originalError = e;
    error.status = e.response?.status;
    error.body = e.response?.data;
    throw error;
  }
};

