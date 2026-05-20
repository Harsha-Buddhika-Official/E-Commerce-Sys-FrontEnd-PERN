import { fetchAllOffers, fetchActiveOffers } from "../api/offers.api";
import { handleApiError } from "../../../../../utils/apiError";

/**
 * Fetch all offers (admin view)
 */
export const getAllOffers = async () => {
  try {
    const response = await fetchAllOffers();

    if (!response || typeof response !== "object") {
      throw new Error("Invalid response structure from API");
    }

    // Extract data array
    let offers = [];
    if (Array.isArray(response)) {
      offers = response;
    } else if (response.data && Array.isArray(response.data)) {
      offers = response.data;
    } else {
      throw new Error("No offers data found in response");
    }

    return offers
      .filter((o) => o && typeof o === "object")
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Newest first
  } catch (error) {
    const err = new Error(error.message || "Failed to fetch offers");
    err.cause = error;
    throw err;
  }
};

/**
 * Fetch only active offers (public/storefront view)
 */
export const getActiveOffers = async () => {
  try {
    const response = await fetchActiveOffers();

    if (!response || typeof response !== "object") {
      throw new Error("Invalid response structure from API");
    }

    let offers = [];
    if (Array.isArray(response)) {
      offers = response;
    } else if (response.data && Array.isArray(response.data)) {
      offers = response.data;
    } else {
      throw new Error("No offers data found in response");
    }

    return offers.filter((o) => o && typeof o === "object");
  } catch (error) {
    const err = new Error(error.message || "Failed to fetch active offers");
    err.cause = error;
    throw err;
  }
};
