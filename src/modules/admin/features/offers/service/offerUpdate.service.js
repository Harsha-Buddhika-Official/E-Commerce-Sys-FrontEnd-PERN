import { updateOffer as apiUpdateOffer } from "../api/offers.api";
import { handleApiError } from "../../../../../utils/apiError";

/**
 * Update an existing offer
 */
export const updateOfferService = async (offerId, payload) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }
  if (!payload) {
    throw new Error("Offer payload is required");
  }

  try {
    const response = await apiUpdateOffer(offerId, payload);

    if (!response || typeof response !== "object") {
      throw new Error("Invalid update response");
    }

    if (response.success !== true) {
      throw new Error(response.message || "Failed to update offer");
    }

    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to update offer");
  }
};
