import {
  getAllOffers,
  getOfferById,
  getOfferProducts,
  getActiveOffers,
  getUpcomingOffers,
} from "../api/offers.api.js";

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

/**
 * Normalize a single offer to UI shape
 * Products are embedded in the offer response
 */
const normalizeOffer = (offer, source = "all") => {
  const discountValue = toNumber(offer.discount_value);
  const discountType = offer.discount_type || "percentage";
  const isUpcoming = source === "upcoming";

  // Extract product information: API may return an array or a single product object
  const firstProduct = (() => {
    const p = offer?.products;
    if (!p) return null;
    if (Array.isArray(p)) return p[0] ?? null;
    if (typeof p === "object") return p;
    return null;
  })();

  // Use selling_price as originalPrice (struck-through price)
  const originalPrice = firstProduct
    ? toNumber(firstProduct.discounted_price)
    : 100000; // fallback

  // Get primary image from product images
  let image = offer.banner_image || "https://placehold.co/280x200/f5f5f5/252525?text=Offer";
  if (firstProduct?.images && Array.isArray(firstProduct.images)) {
    const primaryImage = firstProduct.images.find((img) => img.is_primary);
    const firstImage = firstProduct.images[0];
    image = primaryImage?.image_url || firstImage?.image_url || image;
  }

  // Calculate discounted price and discount percent
  let discountedPrice = originalPrice;
  let discountPercent = 0;

  if (discountType === "percentage") {
    discountPercent = Math.min(Math.round(discountValue), 100);
    discountedPrice = originalPrice * (1 - discountPercent / 100);
  } else if (discountType === "fixed") {
    discountedPrice = Math.max(0, originalPrice - discountValue);
    discountPercent = originalPrice > 0 ? Math.round((discountValue / originalPrice) * 100) : 0;
  }

  let displayImage = offer.banner_image;
  if(offer.banner_image === null) {
    displayImage = image;
  }

  return {
    id: offer.id,
    offerId: offer.id,
    productId: firstProduct?.product_id,
    title: offer.title || "",
    displayImage,
    description: offer.description || "",
    category: firstProduct?.name || "General",
    tag: offer.tag || "Flash Deal",
    tagColor: offer.tag_color || "red",
    originalPrice: Math.round(originalPrice),
    discountedPrice: Math.round(discountedPrice),
    discountPercent,
    badge: offer.badge || null,
    specs: Array.isArray(offer.specs) ? offer.specs : [],
    validUntil: isUpcoming ? (offer.start_date || "") : (offer.end_date || ""),
    countdownLabel: isUpcoming ? "Starts In" : "Ends In",
    countdownTarget: isUpcoming ? (offer.start_date || "") : (offer.end_date || ""),
    offerState: isUpcoming ? "upcoming" : (offer.is_active !== false ? "active" : "inactive"),
    inStock: isUpcoming ? false : (firstProduct?.is_active !== false && offer.is_active !== false),
    isActive: offer.is_active !== false,
    startDate: offer.start_date || "",
    endDate: offer.end_date || "",
  };
};

const unwrapResponse = (response) => {
  const payload = response?.data ?? response;

  if (payload?.success === false) {
    throw new Error(payload.message || "Offers request failed");
  }

  return payload?.data ?? payload;
};

export const fetchAllOffers = async () => {
  try {
    const response = await getAllOffers();
    const offers = Array.isArray(unwrapResponse(response))
      ? unwrapResponse(response)
      : [];
    return offers.map(normalizeOffer);
  } catch (error) {
    console.error("Failed to fetch all offers:", error);
    return [];
  }
};

export const fetchActiveOffers = async () => {
  try {
    const response = await getActiveOffers();
    const offers = Array.isArray(unwrapResponse(response))
      ? unwrapResponse(response)
      : [];
    return offers.map((offer) => normalizeOffer(offer, "active"));
  } catch (error) {
    console.error("Failed to fetch active offers:", error);
    return [];
  }
};

export const fetchUpcomingOffers = async () => {
  try {
    const response = await getUpcomingOffers();
    const offers = Array.isArray(unwrapResponse(response))
      ? unwrapResponse(response)
      : [];
    return offers.map((offer) => normalizeOffer(offer, "upcoming"));
  } catch (error) {
    console.error("Failed to fetch upcoming offers:", error);
    return [];
  }
};

export const fetchOfferById = async (offerId) => {
  try {
    const response = await getOfferById(offerId);
    const offer = unwrapResponse(response);
    return offer ? normalizeOffer(offer) : null;
  } catch (error) {
    console.error(`Failed to fetch offer ${offerId}:`, error);
    return null;
  }
};

export const fetchOfferProducts = async (offerId) => {
  try {
    const response = await getOfferProducts(offerId);
    const products = Array.isArray(unwrapResponse(response))
      ? unwrapResponse(response)
      : [];

    return products.map((p) => ({
      offerProductId: p.offer_product_id,
      offerId: p.offer_id,
      productId: p.product_id,
      name: p.name || "",
      sellingPrice: toNumber(p.selling_price),
      stockQuantity: Math.max(0, Math.trunc(toNumber(p.stock_quantity))),
      isActive: p.is_active !== false,
      createdAt: p.created_at || null,
    }));
  } catch (error) {
    console.error(`Failed to fetch products for offer ${offerId}:`, error);
    return [];
  }
};
