import { deleteOffer as apiDeleteOffer } from "../api/offers.api";
import { handleApiError } from "../../../../../utils/apiError";

/**
 * Delete an offer
 */
export const deleteOfferService = async (offerId) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }

  try {
    const response = await apiDeleteOffer(offerId);

    if (!response || typeof response !== "object") {
      throw new Error("Invalid delete response");
    }

    return response;
  } catch (error) {
    throw handleApiError(error, "Failed to delete offer");
  }
};
