import {
  getAllOffers,
  getOffers,
  getActiveOffers,
  getUpcomingOffers,
  getOfferById,
  getOfferProducts,
} from "../api/offers.api.js";
import { handleServiceError } from "../../../../../utils/serviceError.js";
import { extractArrayPayload, extractObjectPayload } from "../../../../../utils/payloadExtractors.js";
import { normalizeOffer, normalizeOfferProduct } from "./offer.normalizer.js";

// ==================== READ ====================

export const fetchAllOffersService = async () => {
  try {
    const response = await getAllOffers();
    const offers = extractArrayPayload(response);
    return offers.map((offer) => normalizeOffer(offer, "all"));
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch all offers", {
      service: "offers",
      operation: "fetchAllOffersService",
    });
  }
};

export const fetchOffersService = async (status) => {
  try {
    const response = await getOffers(status);
    const offers = extractArrayPayload(response);
    return offers.map((offer) => normalizeOffer(offer, status));
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch offers", {
      service: "offers",
      operation: "fetchOffersService",
    });
  }
};

export const fetchActiveOffersService = async () => {
  try {
    const response = await getActiveOffers();
    const offers = extractArrayPayload(response);
    return offers.map((offer) => normalizeOffer(offer, "active"));
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch active offers", {
      service: "offers",
      operation: "fetchActiveOffersService",
    });
  }
};

export const fetchUpcomingOffersService = async () => {
  try {
    const response = await getUpcomingOffers();
    const offers = extractArrayPayload(response);
    return offers.map((offer) => normalizeOffer(offer, "upcoming"));
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch upcoming offers", {
      service: "offers",
      operation: "fetchUpcomingOffersService",
    });
  }
};

export const fetchOfferByIdService = async (offerId) => {
  try {
    const response = await getOfferById(offerId);
    const offer = extractObjectPayload(response);
    return normalizeOffer(offer);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch offer details", {
      service: "offers",
      operation: "fetchOfferByIdService",
    });
  }
};

export const fetchOfferProductsService = async (offerId) => {
  try {
    const response = await getOfferProducts(offerId);
    const products = extractArrayPayload(response);
    return products.map(normalizeOfferProduct);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch offer products", {
      service: "offers",
      operation: "fetchOfferProductsService",
    });
  }
};