import { createOffer as apiCreateOffer } from "../api/offers.api";
import { handleApiError } from "../../../../../utils/apiError";

/**
 * Create a new offer
 */
export const createOfferService = async (payload) => {
  if (!payload) {
    throw new Error("Offer payload is required");
  }

  try {
    const response = await apiCreateOffer(payload);

    if (!response || typeof response !== "object") {
      throw new Error("Invalid create response");
    }

    if (response.success !== true) {
      throw new Error(response.message || "Failed to create offer");
    }

    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to create offer");
  }
};
