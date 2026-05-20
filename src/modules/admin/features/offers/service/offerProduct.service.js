import { attachProductToOffer as apiAttachProduct, detachProductFromOffer as apiDetachProduct } from "../api/offers.api";
import { handleApiError } from "../../../../../utils/apiError";

/**
 * Attach a product to an offer
 */
export const attachProductService = async (offerId, productId) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }
  if (!productId) {
    throw new Error("Product ID is required");
  }

  try {
    const response = await apiAttachProduct(offerId, productId);

    if (!response || typeof response !== "object") {
      throw new Error("Invalid attach response");
    }

    return response;
  } catch (error) {
    throw handleApiError(error, "Failed to attach product to offer");
  }
};

/**
 * Detach a product from an offer
 */
export const detachProductService = async (offerId, productId) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }
  if (!productId) {
    throw new Error("Product ID is required");
  }

  try {
    const response = await apiDetachProduct(offerId, productId);

    if (!response || typeof response !== "object") {
      throw new Error("Invalid detach response");
    }

    return response;
  } catch (error) {
    throw handleApiError(error, "Failed to detach product from offer");
  }
};
