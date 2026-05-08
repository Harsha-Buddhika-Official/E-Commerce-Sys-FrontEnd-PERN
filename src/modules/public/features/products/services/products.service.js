// features/products/services/products.service.js
// Layer: Service — normalization, business rules, error handling.

import { getAllProducts, getProductsByCategory } from "../api/products.api";

const extractList = (response) => {
    const payload = response?.data?.data ?? response?.data;
    return Array.isArray(payload) ? payload : [];
};

/**
 * Fetches all products with no category filter.
 * @returns {Promise<Product[]>}
 */
export const fetchProducts = async () => {
    const response = await getAllProducts();
    return extractList(response);
};

/**
 * Fetches products filtered by category.
 * @param {string} category
 * @returns {Promise<Product[]>}
 */
export const fetchProductsByCategory = async (category) => {
    const response = await getProductsByCategory(category);
    return extractList(response);
};