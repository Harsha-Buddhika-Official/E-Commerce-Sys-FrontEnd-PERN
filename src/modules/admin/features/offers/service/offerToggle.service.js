import { setOfferActivation as apiSetOfferActivation, updateOffer as apiUpdateOffer } from "../api/offers.api";
import { handleApiError } from "../../../../../utils/apiError";

/**
 * Toggle an offer's active status
 */
export const toggleOfferActiveService = async (offerId, isActive) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }

  try {
    const response = await apiSetOfferActivation(offerId, isActive);

    if (!response || typeof response !== "object") {
      throw new Error("Invalid activation response");
    }

    if (response.success !== true) {
      throw new Error(response.message || "Failed to set offer activation");
    }

    return response.data;
  } catch (error) {
    // If activation route isn't available on the backend, fall back to the generic update route
    if (error?.response?.status === 404 && typeof isActive === "boolean") {
      const fallbackResponse = await apiUpdateOffer(offerId, { is_active: isActive });

      if (!fallbackResponse || typeof fallbackResponse !== "object") {
        throw new Error("Invalid update response");
      }

      if (fallbackResponse.success !== true) {
        throw new Error(fallbackResponse.message || "Failed to set offer activation");
      }

      return fallbackResponse.data;
    }

    throw handleApiError(error, "Failed to set offer activation");
  }
};