import {
  getAllOffers,
  getOfferById,
  getOfferProducts,
} from "../api/offers.api.js";

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return Number.isFinite(date.getTime()) ? date : null;
};

/**
 * Normalize a single offer to UI shape
 * Products are embedded in the offer response
 */
const normalizeOffer = (offer) => {
  const discountValue = toNumber(offer.discount_value);
  const discountType = offer.discount_type || "percentage";

  // Extract first product from embedded products array
  const firstProduct = Array.isArray(offer.products)
    ? offer.products[0]
    : null;

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
    discountPercent = Math.round((discountValue / originalPrice) * 100);
  }

  return {
    id: offer.id,
    offerId: offer.id,
    productId: firstProduct?.product_id,
    title: offer.title || "",
    description: offer.description || "",
    category: firstProduct?.name || "General",
    tag: offer.tag || "Flash Deal",
    tagColor: offer.tag_color || "red",
    originalPrice: Math.round(originalPrice),
    discountedPrice: Math.round(discountedPrice),
    discountPercent,
    badge: offer.badge || null,
    image,
    specs: Array.isArray(offer.specs) ? offer.specs : [],
    validUntil: offer.end_date || "",
    inStock: firstProduct?.is_active !== false && offer.is_active !== false,
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
