import { safeNumber, safeText, safeDate } from "../../../../../utils/normalizers.js";

const FALLBACK_IMAGE = "https://placehold.co/280x200/f5f5f5/252525?text=Offer";
const FALLBACK_PRICE = 100000;

const getFirstProduct = (products) => {
  if (!products) return null;
  if (Array.isArray(products)) return products[0] ?? null;
  if (typeof products === "object") return products;
  return null;
};

const getDisplayImage = (product, bannerImage) => {
  if (bannerImage) return bannerImage;
  if (product?.images && Array.isArray(product.images)) {
    const primaryImage = product.images.find((img) => img.is_primary);
    const firstImage = product.images[0];
    return primaryImage?.image_url || firstImage?.image_url || FALLBACK_IMAGE;
  }
  return FALLBACK_IMAGE;
};

const calculateDiscount = (originalPrice, discountType, discountValue) => {
  if (discountType === "percentage") {
    const discountPercent = Math.min(Math.round(discountValue), 100);
    return { discountedPrice: originalPrice * (1 - discountPercent / 100), discountPercent };
  }
  if (discountType === "fixed") {
    const discountedPrice = Math.max(0, originalPrice - discountValue);
    const discountPercent = originalPrice > 0 ? Math.round((discountValue / originalPrice) * 100) : 0;
    return { discountedPrice, discountPercent };
  }
  return { discountedPrice: originalPrice, discountPercent: 0 };
};

/**
 * Normalize a single offer to UI shape. Products are embedded in the offer response.
 * @param {object} offer - raw offer payload
 * @param {"all"|"active"|"upcoming"|string} source - determines which date/state fields apply
 */
export const normalizeOffer = (offer = {}, source = "all") => {
  const discountValue = safeNumber(offer.discount_value) ?? 0;
  const discountType = safeText(offer.discount_type) ?? "percentage";
  const isUpcoming = source === "upcoming";

  const firstProduct = getFirstProduct(offer.products);
  const originalPrice = firstProduct
    ? safeNumber(firstProduct.discounted_price) ?? FALLBACK_PRICE
    : FALLBACK_PRICE;

  const displayImage = getDisplayImage(firstProduct, offer.banner_image);
  const { discountedPrice, discountPercent } = calculateDiscount(originalPrice, discountType, discountValue);

  return {
    id: safeNumber(offer.id) ?? 0,
    offerId: safeNumber(offer.id) ?? 0,
    productId: safeNumber(firstProduct?.product_id) ?? null,
    products: Array.isArray(offer.products) ? offer.products : [],
    title: safeText(offer.title) ?? "",
    displayImage,
    description: safeText(offer.description) ?? "",
    category: safeText(firstProduct?.name) ?? "General",
    tag: safeText(offer.tag) ?? "Flash Deal",
    tagColor: safeText(offer.tag_color) ?? "red",
    originalPrice: Math.round(originalPrice),
    discountedPrice: Math.round(discountedPrice),
    discountPercent,
    badge: offer.badge ?? null,
    specs: Array.isArray(offer.specs) ? offer.specs : [],
    validUntil: isUpcoming ? safeText(offer.start_date) ?? "" : safeText(offer.end_date) ?? "",
    countdownLabel: isUpcoming ? "Starts In" : "Ends In",
    countdownTarget: isUpcoming ? safeText(offer.start_date) ?? "" : safeText(offer.end_date) ?? "",
    offerState: isUpcoming ? "upcoming" : offer.is_active !== false ? "active" : "inactive",
    inStock: isUpcoming ? false : firstProduct?.is_active !== false && offer.is_active !== false,
    isActive: offer.is_active !== false,
    startDate: safeText(offer.start_date) ?? "",
    endDate: safeText(offer.end_date) ?? "",
  };
};

export const normalizeOfferProduct = (product = {}) => ({
  offerProductId: safeNumber(product.offer_product_id) ?? 0,
  offerId: safeNumber(product.offer_id) ?? 0,
  productId: safeNumber(product.product_id) ?? 0,
  name: safeText(product.name) ?? "",
  sellingPrice: safeNumber(product.selling_price) ?? 0,
  stockQuantity: Math.max(0, Math.trunc(safeNumber(product.stock_quantity) ?? 0)),
  isActive: product.is_active !== false,
  createdAt: safeDate(product.created_at) ?? null,
});