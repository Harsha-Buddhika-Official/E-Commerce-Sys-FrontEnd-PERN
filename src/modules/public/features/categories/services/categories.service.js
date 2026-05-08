import {getProductCategories, getAccessoryCategories} from "../api/categories.api";

/**
 * Safely extracts an array from various API response shapes.
 * Returns [] instead of throwing when the server returns null/undefined.
 */
const extractList = (response) => {
    const payload = response?.data?.data ?? response?.data;
    return Array.isArray(payload) ? payload : [];
};

/**
 * Fetches both category types in parallel.
 * Uses allSettled so one failing endpoint doesn't kill the other.
 * Only throws if BOTH endpoints fail.
 *
 * @returns {{ products: Category[], accessories: Category[] }}
 */
export const fetchAllCategories = async () => {
    const [productsResult, accessoriesResult] = await Promise.allSettled([
        getProductCategories(),
        getAccessoryCategories(),
    ]);

    const products = productsResult.status === "fulfilled"
        ? extractList(productsResult.value)
        : [];

    const accessories = accessoriesResult.status === "fulfilled"
        ? extractList(accessoriesResult.value)
        : [];

    const errors = [productsResult, accessoriesResult]
        .filter((r) => r.status === "rejected")
        .map((r) => r.reason?.message ?? "Unknown error");

    if (errors.length === 2) {
        throw new Error(`Failed to load categories: ${errors.join("; ")}`);
    }

    return { products, accessories };
};