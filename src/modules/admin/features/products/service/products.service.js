import {
  fetchAllProductsLimited,
  fetchProductsLimitedData,
  fetchProductDetail,
  updateProductFull as apiUpdateProductFull,
  deleteProduct,
} from "../api/product.api";
import { handleApiError } from "../../../../../utils/apiError";

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

export const getProductsLimitedData = async () => {
  try {
    const response = await fetchProductsLimitedData();
    const products = Array.isArray(response) ? response : response?.data ?? [];
    return products.map((product) => ({
      product_id: product.product_id,
      name: product.name,
      category_name: product.category_name || product.category || "Product",
      selling_price: product.discounted_price ?? product.price ?? 0,
      is_active: product.is_active,
    }));
  } catch (err) {
    throw new Error("Failed to fetch limited product data: " + (err?.message || String(err)));
  }
};

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

export const updateProductFull = async (productId, payload) => {
  try {
    const response = await apiUpdateProductFull(productId, payload);

    if (!response || typeof response !== "object") {
      throw new Error("Invalid update product response");
    }

    if (response.success !== true) {
      throw new Error(response.message || "Failed to update product");
    }

    return response.data;
  } catch (error) {
    const err = new Error(error.message || "Failed to update product");
    err.cause = error;
    throw err;
  }
};

export const deleteProductService = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }
  try {
    const res = await deleteProduct(productId);
    return res;
  } catch (error) {
    throw handleApiError(error, "Failed to delete product");
  }
};

import {
  createProduct as apiCreateProduct,
  fetchProductAttributesByCategory as apiFetchAttributesByCategory,
  addProductAttribute as apiAddProductAttribute,
} from "../api/product.api.js";

export const createProduct = async (payload) => {
  try {
    return await apiCreateProduct(payload);
  } catch (err) {
    console.error("Error creating product:", err);
    throw err;
  }
};

export const fetchAttributesByCategory = async (categoryId) => {
  try {
    return await apiFetchAttributesByCategory(categoryId);
  } catch (err) {
    console.error("Error fetching attributes for category:", err);
    throw err;
  }
};

export const addAttributeToProduct = async (productId, payload) => {
  try {
    return await apiAddProductAttribute(productId, payload);
  } catch (err) {
    console.error("Error adding attribute to product:", err);
    throw err;
  }
};
