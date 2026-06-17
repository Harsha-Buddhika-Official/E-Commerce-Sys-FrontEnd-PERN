import { safeNumber, safeText, safeDate } from "../../../../../utils/normalizers.js";


// ==================== SINGLE CATEGORY ====================

export const normalizeCategory = (category = {}) => ({
  category_id: safeNumber(category.category_id),
  name: safeText(category.name) || "",
  slug: safeText(category.slug) || "",
  category_type: safeText(category.category_type) || "",
  img_url: safeText(category.img_url) || "",
  created_at: safeDate(category.created_at),
  updated_at: safeDate(category.updated_at),
});


// ==================== LIST ====================

export const normalizeCategoryList = (categories = []) => {
  if (!Array.isArray(categories)) return [];

  return categories
    .filter((c) => c && typeof c === "object")
    .map(normalizeCategory);
};


// ==================== NAME LIST (DROPDOWN) ====================

export const normalizeCategoryNameList = (categories = []) => {
  if (!Array.isArray(categories)) return [];

  return categories
    .filter((c) => c && typeof c === "object")
    .map((c) => ({
      category_id: safeNumber(c.category_id),
      name: safeText(c.name) || "",
    }));
};