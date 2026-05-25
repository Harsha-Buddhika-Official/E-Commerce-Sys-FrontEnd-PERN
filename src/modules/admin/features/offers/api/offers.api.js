import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";

/**
 * Fetch all offers with mapped products
 * GET /api/offers
 */
export const fetchAllOffers = async () => {
  try {
    const res = await API.get("/offers");
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch offers");
  }
};

/**
 * Fetch active offers only
 * GET /api/offers/active
 */
export const fetchActiveOffers = async () => {
  try {
    const res = await API.get("/offers/active");
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch active offers");
  }
};

/**
 * Fetch a single offer by ID
 * GET /api/offers/:id
 */
export const fetchOfferById = async (offerId) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }
  try {
    const res = await API.get(`/offers/${offerId}`);
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch offer details");
  }
};

/**
 * Fetch products attached to an offer
 * GET /api/offers/:id/products
 */
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

/**
 * Create a new offer
 * POST /api/offers/admin/
 */
export const createOffer = async (payload) => {
  if (!payload) {
    throw new Error("Offer payload is required");
  }
  try {
    const res = await API.post("/offers/admin/", payload);
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to create offer");
  }
};

/**
 * Update an existing offer
 * PUT /api/offers/admin/:id
 */
export const updateOffer = async (offerId, payload) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }
  if (!payload) {
    throw new Error("Offer payload is required");
  }
  try {
    const res = await API.put(`/offers/admin/${offerId}`, payload);
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to update offer");
  }
};

/**
 * Toggle an offer's active status
 * PUT /api/offers/admin/:id/toggle-active
 */
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

/**
 * Set an offer's active status explicitly
 * PUT /api/offers/admin/activation/:id
 * Body: { is_active: "true" | "false" }
 */
export const setOfferActivation = async (offerId, isActive) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }

  // Backend expects the is_active value as a string: "true" or "false"
  if (typeof isActive !== "boolean") {
    throw new Error("isActive must be a boolean");
  }

  try {
    const payload = { is_active: isActive ? "true" : "false" };
    const res = await API.put(`/offers/admin/activation/${offerId}`, payload);
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to set offer activation");
  }
};

/**
 * Delete an offer
 * DELETE /api/offers/admin/:id
 */
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

/**
 * Attach a product to an offer
 * POST /api/offers/admin/products/:id
 * Body: { product_id: number }
 */
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

/**
 * Detach a product from an offer
 * DELETE /api/offers/admin/:id/products/:productId
 */
export const detachProductFromOffer = async (offerId, productId) => {
  if (!offerId) {
    throw new Error("Offer ID is required");
  }
  if (!productId) {
    throw new Error("Product ID is required");
  }
  try {
    const res = await API.delete(`/offers/admin/${offerId}/products/${productId}`);
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to detach product from offer");
  }
};
