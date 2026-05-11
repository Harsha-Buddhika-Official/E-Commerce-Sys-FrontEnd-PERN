// features/products/services/homepageService.js
// Layer: Service — normalization, business rules, error handling.

import { getBestSellers, getLatestProducts } from "../api/products.api";

const extractList = (response) => {
    const payload = response?.data?.data ?? response?.data;
    return Array.isArray(payload) ? payload : [];
};

export const fetchHomepageData = async () => {
    const [bestSellersResult, latestResult] = await Promise.allSettled([
        getBestSellers(),
        getLatestProducts(),
    ]);

    const bestSellers = bestSellersResult.status === "fulfilled"
        ? extractList(bestSellersResult.value)
        : [];

    const latest = latestResult.status === "fulfilled"
        ? extractList(latestResult.value).map((product) => ({
              ...product,
              product_tag: "LATEST",
          }))
        : [];

    const errors = [bestSellersResult, latestResult]
        .filter((r) => r.status === "rejected")
        .map((r) => r.reason?.message ?? "Unknown error");

    if (errors.length === 2) {
        throw new Error(`Failed to load homepage products: ${errors.join("; ")}`);
    }

    return { bestSellers, latest };
};