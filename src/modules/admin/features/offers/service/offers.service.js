import {
  fetchAllOffers,
  fetchActiveOffers,
  createOffer as apiCreateOffer,
  updateOffer as apiUpdateOffer,
  deleteOffer as apiDeleteOffer,
  fetchOfferById,
  attachProductToOffer as apiAttachProduct,
  detachProductFromOffer as apiDetachProduct,
  setOfferActivation as apiSetOfferActivation,
} from "../api/offers.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";

export const getAllOffers = async () => {
  try {
    const response = await fetchAllOffers();

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

    return offers
      .filter((o) => o && typeof o === "object")
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch offers", {
      service: "offers",
      operation: "getAllOffers",
    });
  }
};

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
    throw handleServiceError(error, "Failed to fetch active offers", {
      service: "offers",
      operation: "getActiveOffers",
    });
  }
};

export const createOfferService = async (payload) => {
  if (!payload) throw new Error("Offer payload is required");
  try {
    const response = await apiCreateOffer(payload);
    if (!response || typeof response !== "object") throw new Error("Invalid create response");
    if (response.success !== true) throw new Error(response.message || "Failed to create offer");
    return response.data;
  } catch (error) {
    throw handleServiceError(error, "Failed to create offer", {
      service: "offers",
      operation: "createOfferService",
    });
  }
};

export const updateOfferService = async (offerId, payload) => {
  if (!offerId) throw new Error("Offer ID is required");
  if (!payload) throw new Error("Offer payload is required");
  try {
    const response = await apiUpdateOffer(offerId, payload);
    if (!response || typeof response !== "object") throw new Error("Invalid update response");
    if (response.success !== true) throw new Error(response.message || "Failed to update offer");
    return response.data;
  } catch (error) {
    throw handleServiceError(error, "Failed to update offer", {
      service: "offers",
      operation: "updateOfferService",
    });
  }
};

export const deleteOfferService = async (offerId) => {
  if (!offerId) throw new Error("Offer ID is required");
  try {
    const response = await apiDeleteOffer(offerId);
    if (!response || typeof response !== "object") throw new Error("Invalid delete response");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete offer", {
      service: "offers",
      operation: "deleteOfferService",
    });
  }
};

export const getOfferDetail = async (offerId) => {
  try {
    const response = await fetchOfferById(offerId);
    if (!response || typeof response !== "object") throw new Error("Invalid offer detail response");
    if (response.success !== true) throw new Error(response.message || "Failed to fetch offer details");
    const offer = response.data;
    if (!offer || typeof offer !== "object") throw new Error("Invalid offer detail response");
    return offer;
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch offer details", {
      service: "offers",
      operation: "getOfferDetail",
    });
  }
};

export const attachProductService = async (offerId, productId) => {
  if (!offerId) throw new Error("Offer ID is required");
  if (!productId) throw new Error("Product ID is required");
  try {
    const response = await apiAttachProduct(offerId, productId);
    if (!response || typeof response !== "object") throw new Error("Invalid attach response");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to attach product to offer", {
      service: "offers",
      operation: "attachProductService",
    });
  }
};

export const detachProductService = async (offerId, productId) => {
  if (!offerId) throw new Error("Offer ID is required");
  if (!productId) throw new Error("Product ID is required");
  try {
    const response = await apiDetachProduct(offerId, productId);
    if (!response || typeof response !== "object") throw new Error("Invalid detach response");
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to detach product from offer", {
      service: "offers",
      operation: "detachProductService",
    });
  }
};

export const toggleOfferActiveService = async (offerId, isActive) => {
  if (!offerId) throw new Error("Offer ID is required");
  try {
    const response = await apiSetOfferActivation(offerId, isActive);
    if (!response || typeof response !== "object") throw new Error("Invalid activation response");
    if (response.success !== true) throw new Error(response.message || "Failed to set offer activation");
    return response.data;
  } catch (error) {
    if (error?.response?.status === 404 && typeof isActive === "boolean") {
      const fallbackResponse = await apiUpdateOffer(offerId, { is_active: isActive });
      if (!fallbackResponse || typeof fallbackResponse !== "object") throw new Error("Invalid update response");
      if (fallbackResponse.success !== true) throw new Error(fallbackResponse.message || "Failed to set offer activation");
      return fallbackResponse.data;
    }
    throw handleServiceError(error, "Failed to set offer activation", {
      service: "offers",
      operation: "toggleOfferActiveService",
    });
  }
};
