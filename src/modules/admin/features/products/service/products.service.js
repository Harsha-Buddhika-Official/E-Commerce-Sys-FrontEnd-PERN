import { fetchAllProductsLimited } from "../api/product.api";

/**
 * Normalize backend product data to frontend format
 * Backend sends snake_case, convert to camelCase
 * Maps: product_id → id, product_name → name, etc.
 */
const normalizeProduct = (product) => ({
  id: Number(product.product_id),
  name: product.product_name || "",
  brand: product.brand_name || "",
  category: product.category_name || "",
  stockCount: Number(product.stock_quantity) || 0,
  stockStatus: product.stock_status || "IN_STOCK", // IN_STOCK | OUT_OF_STOCK
  basePrice: Number(product.base_price) || 0,
  sellingPrice: Number(product.selling_price) || 0,
  discountedPrice: Number(product.discounted_price) || 0,
  image: product.primary_image || "",
});

/**
 * Fetch all products with limited details
 * Handles response normalization and error propagation
 */
export const getAllProductsLimited = async () => {
  try {
    const response = await fetchAllProductsLimited();

    // Validate response structure
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response structure from API");
    }

    // Extract data array (handle different response shapes)
    let products = [];
    if (Array.isArray(response)) {
      products = response;
    } else if (response.data && Array.isArray(response.data)) {
      products = response.data;
    } else {
      throw new Error("No products data found in response");
    }

    // Normalize each product
    return products
      .filter((p) => p && typeof p === "object")
      .map(normalizeProduct)
      .sort((a, b) => b.id - a.id); // Descending order by ID
  } catch (error) {
    const err = new Error(error.message || "Failed to fetch products");
    err.cause = error;
    throw err;
  }
};
