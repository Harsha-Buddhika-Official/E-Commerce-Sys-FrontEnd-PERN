import { safeNumber, safeText, safeDate } from "../../../../../utils/normalizers.js";

// ==================== SINGLE ENTITY ====================

export const normalizeBrand = (brand = {}) => ({
  brand_id: safeNumber(brand.brand_id) ?? 0,
  brand_name: safeText(brand.brand_name ?? brand.name) ?? "",
  slug: safeText(brand.slug) ?? "",
  logo_url: safeText(brand.logo_url) ?? "",
  logo_public_id: safeText(brand.logo_public_id) ?? null,
  is_active: Boolean(brand.is_active),
  updated_at: safeDate(brand.updated_at) ?? null,
  created_at: safeDate(brand.created_at) ?? null,
});

// ==================== LIST (FULL BRANDS PAGE) ====================

export const normalizeBrandList = (brands = []) => {
  if (!Array.isArray(brands)) return [];

  return brands
    .filter((b) => b && typeof b === "object")
    .map(normalizeBrand);
};

// ==================== DROPDOWN (NAME ONLY) ====================

export const normalizeBrandNameList = (brands = []) => {
  if (!Array.isArray(brands)) return [];

  return brands.map((b) => ({
    brand_id: safeNumber(b.brand_id) ?? 0,
    brand_name: safeText(b.name ?? b.brand_name) ?? "",
  }));
};