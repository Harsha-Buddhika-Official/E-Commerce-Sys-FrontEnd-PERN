import {
  fetchAllOffers,
  fetchActiveOffers,
  createOffer as apiCreateOffer,
  updateOffer as apiUpdateOffer,
  deleteOffer as apiDeleteOffer,
  fetchOfferById,
  attachProductToOffer as apiAttachProduct,
  setOfferActivation as apiSetOfferActivation,
} from "../api/offers.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const normalizeOfferProduct = (linkedProduct) => {
  const product = linkedProduct?.product || linkedProduct || null;

  if (!product || typeof product !== "object") {
    return null;
  }

  const primaryImage = Array.isArray(product.images)
    ? product.images.find((image) => image?.is_primary) || product.images[0] || null
    : product.image || null;

  return {
    id: product.product_id ?? product.id ?? null,
    product_id: product.product_id ?? product.id ?? null,
    name: product.name || "",
    slug: product.slug || "",
    description: product.description || "",
    selling_price: toNumber(product.selling_price),
    discounted_price: toNumber(product.discounted_price),
    stock_quantity: toNumber(product.stock_quantity),
    is_active: product.is_active !== false,
    image: primaryImage || null,
    images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []),
    attributes: Array.isArray(product.attributes) ? product.attributes : [],
  };
};

const normalizeOfferDetail = (offer) => {
  if (!offer || typeof offer !== "object") {
    return null;
  }

  const linkedProducts = Array.isArray(offer.products) ? offer.products : [];
  const primaryLinkedProduct = linkedProducts[0] || null;
  const primaryProduct = normalizeOfferProduct(primaryLinkedProduct);

  return {
    id: offer.id ?? null,
    title: offer.title || "",
    description: offer.description || null,
    discount_type: offer.discount_type || "percentage",
    discount_value: toNumber(offer.discount_value),
    start_date: offer.start_date || null,
    end_date: offer.end_date || null,
    is_active: offer.is_active !== false,
    banner_image: offer.banner_image || null,
    created_at: offer.created_at || null,
    updated_at: offer.updated_at || null,
    banner_image_id: offer.banner_image_id ?? null,
    products: linkedProducts,
    product: primaryProduct,
    product_id: primaryProduct?.product_id ?? null,
    product_count: linkedProducts.length,
  };
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
      .map(normalizeOfferDetail)
      .filter((o) => o)
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

    return offers.filter((o) => o && typeof o === "object").map(normalizeOfferDetail).filter((o) => o);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch active offers", {
      service: "offers",
      operation: "getActiveOffers",
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

export const getOfferDetail = async (offerId) => {
  try {
    const response = await fetchOfferById(offerId);
    if (!response || typeof response !== "object") throw new Error("Invalid offer detail response");
    if (response.success !== true) throw new Error(response.message || "Failed to fetch offer details");
    return normalizeOfferDetail(response.data);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch offer details", {
      service: "offers",
      operation: "getOfferDetail",
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
