import {
  fetchAllOffers,
  createOffer as apiCreateOffer,
  updateOffer as apiUpdateOffer,
  deleteOffer as apiDeleteOffer,
  fetchOfferById,
  attachProductToOffer as apiAttachProduct,
  setOfferActivation as apiSetOfferActivation,
} from "../api/offers.api.js";

import { handleServiceError } from "../../../../../utils/serviceError.js";
import {
  extractArrayPayload,
  extractObjectPayload,
} from "../../../../../utils/payloadExtractors.js";

import {
  normalizeOffer,
  normalizeOfferList,
} from "./offers.normalizer.js";


// ==================== CREATE ====================

export const createOfferService = async (payload) => {
  if (!payload) throw new Error("Offer payload is required");

  try {
    const response = await apiCreateOffer(payload);
    const data = extractObjectPayload(response);

    return normalizeOffer(data);
  } catch (error) {
    throw handleServiceError(error, "Failed to create offer", {
      service: "offers",
      operation: "createOfferService",
    });
  }
};


// ==================== READ (ALL) ====================

export const getAllOffers = async () => {
  try {
    const response = await fetchAllOffers();
    const data = extractArrayPayload(response);

    return normalizeOfferList(data);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch offers", {
      service: "offers",
      operation: "getAllOffers",
    });
  }
};


// ==================== READ (DETAIL) ====================

export const getOfferDetail = async (offerId) => {
  if (!offerId) throw new Error("Offer ID is required");

  try {
    const response = await fetchOfferById(offerId);
    const data = extractObjectPayload(response);

    return normalizeOffer(data);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch offer details", {
      service: "offers",
      operation: "getOfferDetail",
    });
  }
};


// ==================== UPDATE ====================

export const updateOfferService = async (offerId, payload) => {
  if (!offerId) throw new Error("Offer ID is required");
  if (!payload) throw new Error("Offer payload is required");

  try {
    const response = await apiUpdateOffer(offerId, payload);
    const data = extractObjectPayload(response);

    return normalizeOffer(data);
  } catch (error) {
    throw handleServiceError(error, "Failed to update offer", {
      service: "offers",
      operation: "updateOfferService",
    });
  }
};


// ==================== ATTACH PRODUCT ====================

export const attachProductService = async (offerId, productId) => {
  if (!offerId) throw new Error("Offer ID is required");
  if (!productId) throw new Error("Product ID is required");

  try {
    const response = await apiAttachProduct(offerId, productId);
    return extractObjectPayload(response);
  } catch (error) {
    throw handleServiceError(error, "Failed to attach product to offer", {
      service: "offers",
      operation: "attachProductService",
    });
  }
};


// ==================== TOGGLE ACTIVE ====================

export const toggleOfferService = async (offerId, isActive) => {
  if (!offerId) throw new Error("Offer ID is required");

  try {
    const response = await apiSetOfferActivation(offerId, isActive);
    const data = extractObjectPayload(response);

    if (!data) throw new Error("Failed to update offer activation");

    return true;
  } catch (error) {
    throw handleServiceError(error, "Failed to set offer activation", {
      service: "offers",
      operation: "toggleOfferService",
    });
  }
};


// ==================== DELETE ====================

export const deleteOfferService = async (offerId) => {
  if (!offerId) throw new Error("Offer ID is required");

  try {
    const response = await apiDeleteOffer(offerId);
    return extractObjectPayload(response);
  } catch (error) {
    throw handleServiceError(error, "Failed to delete offer", {
      service: "offers",
      operation: "deleteOfferService",
    });
  }
};