import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";

// for create offer in offer page
export const createOffer = async (payload) => {
  if (!payload) {
    throw new Error("Offer payload is required");
  }
  try {
    const isMultipart = typeof FormData !== "undefined" && payload instanceof FormData;
    const res = await API.post("/offers/admin/", payload, isMultipart ? { timeout: 30000 } : undefined);
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to create offer");
  }
};

// for create offer in offer page
export const attachProductToOffer = async (offerId, productId) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }
  if (!productId) {
    throw new Error("Product ID is required");
  }
  try {
    const res = await API.post(`/offers/admin/products/${offerId}`, { product_id: productId });
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to attach product to offer");
  }
};

export const fetchAllOffers = async () => {
  try {
    const res = await API.get("/offers/admin");
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch offers");
  }
};

export const fetchActiveOffers = async () => {
  try {
    const res = await API.get("/offers/active");
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch active offers");
  }
};

export const fetchOfferById = async (offerId) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }
  try {
    const res = await API.get(`/offers/admin/${offerId}`);
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch offer details");
  }
};

export const fetchOfferProducts = async (offerId) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }
  try {
    const res = await API.get(`/offers/${offerId}/products`);
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch offer products");
  }
};

export const updateOffer = async (offerId, payload) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }
  if (!payload) {
    throw new Error("Offer payload is required");
  }
  try {
    const isMultipart = typeof FormData !== "undefined" && payload instanceof FormData;
    const res = await API.put(`/offers/admin/${offerId}`, payload, isMultipart ? { timeout: 30000 } : undefined);
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to update offer");
  }
};

export const toggleOfferActive = async (offerId) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }
  try {
    const res = await API.put(`/offers/admin/${offerId}/toggle-active`);
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to toggle offer status");
  }
};

export const setOfferActivation = async (offerId, isActive) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }

  if (typeof isActive !== "boolean") {
    throw new Error("isActive must be a boolean");
  }

  try {
    const payload = { is_active: isActive };
    const res = await API.put(`/offers/admin/${offerId}/activation`, payload);
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to set offer activation");
  }
};

export const deleteOffer = async (offerId) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }
  try {
    const res = await API.delete(`/offers/admin/${offerId}`);
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to delete offer");
  }
};
