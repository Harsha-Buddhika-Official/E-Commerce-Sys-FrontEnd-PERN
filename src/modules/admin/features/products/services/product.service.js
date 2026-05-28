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
