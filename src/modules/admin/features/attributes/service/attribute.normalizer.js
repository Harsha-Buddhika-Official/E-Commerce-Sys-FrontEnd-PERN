import { safeNumber, safeText, safeDate } from "../../../../../utils/normalizers.js";

export const normalizeCategory = (category = {}) => ({
  category_id: safeNumber(category.category_id) ?? 0,
  name: safeText(category.name) ?? "",
});

export const normalizeValue = (value = {}) => ({
  attribute_value_id: safeNumber(value.attribute_value_id) ?? 0,
  value: safeText(value.value) ?? "",
  slug: safeText(value.slug) ?? null,
  created_at: safeDate(value.created_at) ?? null,
});

export const normalizeAttribute = (attribute = {}) => ({
  attribute_id: safeNumber(attribute.attribute_id) ?? 0,
  name: safeText(attribute.name) ?? "",
  category_id: safeNumber(attribute.category_id) ?? 0,
  values: Array.isArray(attribute.values)
    ? attribute.values.filter((value) => value && typeof value === "object").map(normalizeValue)
    : [],
});

export const buildCategoryAttributeMap = (attributes = []) => {
  const map = new Map();
  attributes.forEach((attribute) => {
    const categoryId = attribute.category_id;
    if (!map.has(categoryId)) map.set(categoryId, []);
    map.get(categoryId).push(attribute);
  });
  return map;
};

export const normalizeCatalogPayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid attributes catalog payload");
  }

  const categories = Array.isArray(payload.categories) ? payload.categories : [];
  const attributes = Array.isArray(payload.attributes) ? payload.attributes : [];

  const normalizedCategories = categories
    .filter((category) => category && typeof category === "object")
    .map(normalizeCategory)
    .sort((a, b) => a.category_id - b.category_id);

  const normalizedAttributes = attributes
    .filter((attribute) => attribute && typeof attribute === "object")
    .map(normalizeAttribute)
    .sort((a, b) => a.category_id - b.category_id || a.name.localeCompare(b.name));

  const attributesByCategory = buildCategoryAttributeMap(normalizedAttributes);

  const groupedCategories = normalizedCategories.map((category) => ({
    ...category,
    attributes: attributesByCategory.get(category.category_id) ?? [],
  }));

  return {
    categories: normalizedCategories,
    attributes: normalizedAttributes,
    groupedCategories,
    totalCategories: normalizedCategories.length,
    totalAttributes: normalizedAttributes.length,
  };
};