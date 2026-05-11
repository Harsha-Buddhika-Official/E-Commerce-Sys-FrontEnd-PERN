// features/products/services/products.service.js
// Layer: Service — normalization, business rules, error handling.

import { getAllProducts, getProductsByCategory, getFilterOptions, getFilteredProducts } from "../api/products.api";

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

// ── add these two ──
export const fetchFilterOptions = async (categoryId) => {
    const response = await getFilterOptions(categoryId);
    return extractList(response);
};

const hasActiveFilters = ({ attributeFilters, priceMin, priceMax }) =>
    attributeFilters.length > 0 || priceMin !== '' || priceMax !== '';

// smart fetch:
// no filters active  → GET /products/products/category/:id  (your existing API)
// filters active     → POST /products/filter/:id
export const fetchProductsWithFilters = async (categoryId, filters) => {
    if (!hasActiveFilters(filters)) {
        return fetchProductsByCategory(categoryId);
    }

    const response = await getFilteredProducts(categoryId, {
        attributeFilters: filters.attributeFilters,
        ...(filters.priceMin !== '' && { priceMin: parseFloat(filters.priceMin) }),
        ...(filters.priceMax !== '' && { priceMax: parseFloat(filters.priceMax) }),
    });

    return extractList(response);
};