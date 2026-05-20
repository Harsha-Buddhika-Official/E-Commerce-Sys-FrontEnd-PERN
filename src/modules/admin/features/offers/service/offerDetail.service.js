import { fetchOfferById } from "../api/offers.api";
import { handleApiError } from "../../../../../utils/apiError";

/**
 * Fetch a single offer's details
 */
export const getOfferDetail = async (offerId) => {
  try {
    const response = await fetchOfferById(offerId);

    if (!response || typeof response !== "object") {
      throw new Error("Invalid offer detail response");
    }

    if (response.success !== true) {
      throw new Error(response.message || "Failed to fetch offer details");
    }

    const offer = response.data;

    if (!offer || typeof offer !== "object") {
      throw new Error("Invalid offer detail response");
    }

    return offer;
  } catch (error) {
    const err = new Error(error.message || "Failed to fetch offer details");
    err.cause = error;
    throw err;
  }
};
