import { fetchProductDetail } from "../api/product.api";

/**
 * Fetch a single product's detailed admin view payload.
 * The backend already returns the shape the page needs, so we only unwrap and validate it.
 */
export const getProductDetail = async (productId) => {
  try {
    const response = await fetchProductDetail(productId);
    if (!response || typeof response !== "object") {
      throw new Error("Invalid product detail response");
    }

    if (response.success !== true) {
      throw new Error(response.message || "Failed to fetch product details");
    }

    const product = response.data;

    if (!product || typeof product !== "object") {
      throw new Error("Invalid product detail response");
    }

    return product;
  } catch (error) {
    const err = new Error(error.message || "Failed to fetch product details");
    err.cause = error;
    throw err;
  }
};