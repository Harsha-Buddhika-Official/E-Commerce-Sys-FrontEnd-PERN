import { fetchAttributesCatalog } from "../api/attributes.api";

const slugify = (str) =>
  String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeCategory = (category) => ({
  category_id: Number(category.category_id),
  name: category.name || "",
});

const normalizeValue = (value) => ({
  attribute_value_id: Number(value.attribute_value_id),
  value: value.value || "",
  slug: value.slug || slugify(value.value),
});

const normalizeAttribute = (attribute) => ({
  attribute_id: Number(attribute.attribute_id),
  name: attribute.name || "",
  category_id: Number(attribute.category_id),
  values: Array.isArray(attribute.values) ? attribute.values.map(normalizeValue) : [],
});

export const getAttributesCatalog = async () => {
  try {
    const response = await fetchAttributesCatalog();

    if (!response || typeof response !== "object") {
      throw new Error("Invalid response structure from API");
    }

    const categories = Array.isArray(response.categories) ? response.categories : [];
    const attributes = Array.isArray(response.attributes) ? response.attributes : [];

    return {
      categories: categories
        .filter((category) => category && typeof category === "object")
        .map(normalizeCategory)
        .sort((a, b) => a.category_id - b.category_id),
      attributes: attributes
        .filter((attribute) => attribute && typeof attribute === "object")
        .map(normalizeAttribute)
        .sort((a, b) => a.category_id - b.category_id || a.name.localeCompare(b.name)),
    };
  } catch (error) {
    const err = new Error(error.message || "Failed to fetch attributes catalog");
    err.cause = error;
    throw err;
  }
};