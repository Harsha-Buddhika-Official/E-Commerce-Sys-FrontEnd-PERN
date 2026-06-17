import { safeText, safeDate } from "../../../../../utils/normalizers.js";

// ==================== HELPERS ====================

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

// ==================== PRODUCT NORMALIZER ====================

export const normalizeOfferProduct = (linkedProduct) => {
  const product = linkedProduct?.product || linkedProduct || null;

  if (!product || typeof product !== "object") return null;

  const primaryImage = Array.isArray(product.images)
    ? product.images.find((img) => img?.is_primary) || product.images[0] || null
    : product.image || null;

  return {
    id: product.product_id ?? product.id ?? null,
    product_id: product.product_id ?? product.id ?? null,
    name: safeText(product.name) || "",
    slug: safeText(product.slug) || "",
    description: safeText(product.description) || "",
    selling_price: toNumber(product.selling_price),
    discounted_price: toNumber(product.discounted_price),
    stock_quantity: toNumber(product.stock_quantity),
    is_active: product.is_active !== false,
    image: primaryImage,
    images: Array.isArray(product.images)
      ? product.images
      : product.image
      ? [product.image]
      : [],
    attributes: Array.isArray(product.attributes)
      ? product.attributes
      : [],
  };
};

// ==================== OFFER NORMALIZER ====================

export const normalizeOffer = (offer = {}) => {
  if (!offer || typeof offer !== "object") return null;

  const linkedProducts = Array.isArray(offer.products) ? offer.products : [];
  const primaryProduct = normalizeOfferProduct(linkedProducts[0]);

  return {
    id: offer.id ?? null,
    title: safeText(offer.title) || "",
    description: safeText(offer.description) || null,
    discount_type: offer.discount_type || "percentage",
    discount_value: toNumber(offer.discount_value),
    start_date: safeDate(offer.start_date),
    end_date: safeDate(offer.end_date),
    is_active: offer.is_active !== false,
    banner_image: safeText(offer.banner_image) || null,
    banner_image_id: offer.banner_image_id ?? null,
    created_at: safeDate(offer.created_at),
    updated_at: safeDate(offer.updated_at),

    products: linkedProducts,
    product: primaryProduct,
    product_id: primaryProduct?.product_id ?? null,
    product_count: linkedProducts.length,
  };
};

// ==================== OFFER LIST NORMALIZER ====================

export const normalizeOfferList = (offers = []) => {
  if (!Array.isArray(offers)) return [];

  return offers
    .filter((o) => o && typeof o === "object")
    .map(normalizeOffer)
    .filter(Boolean)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};