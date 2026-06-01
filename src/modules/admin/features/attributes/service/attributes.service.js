import {
  fetchAttributesCatalog,
  createAttribute,
  createAttributeValue,
  deleteAttributeValue,
  deleteAttribute,
} from "../api/attributes.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";
import { extractObjectPayload } from "../../../../../utils/payloadExtractors.js";
import { safeNumber, safeText, safeDate } from "../../../../../utils/normalizers.js";

const normalizeCategory = (category = {}) => ({
  category_id: safeNumber(category.category_id) ?? 0,
  name: safeText(category.name) ?? "",
});

const normalizeValue = (value = {}) => ({
  attribute_value_id: safeNumber(value.attribute_value_id) ?? 0,
  value: safeText(value.value) ?? "",
  slug: safeText(value.slug) ?? null,
  created_at: safeDate(value.created_at) ?? null,
});

const normalizeAttribute = (attribute = {}) => ({
  attribute_id: safeNumber(attribute.attribute_id) ?? 0,
  name: safeText(attribute.name) ?? "",
  category_id: safeNumber(attribute.category_id) ?? 0,
  values: Array.isArray(attribute.values)
    ? attribute.values.filter((value) => value && typeof value === "object").map(normalizeValue)
    : [],
});

const buildCategoryAttributeMap = (attributes = []) => {
  const map = new Map();
  attributes.forEach((attribute) => {
    const categoryId = attribute.category_id;
    if (!map.has(categoryId)) map.set(categoryId, []);
    map.get(categoryId).push(attribute);
  });
  return map;
};

const normalizeCatalogPayload = (payload) => {
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

// get all attributes with their values devided into categories for attribute page
export const getAttributesCatalog = async () => {
  try {
    const response = await fetchAttributesCatalog();
    const payload = extractObjectPayload(response);
    return normalizeCatalogPayload(payload);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch attributes catalog", {
      service: "attributes",
      operation: "getAttributesCatalog",
    });
  }
};


export const createAttributeService = async (attributeData) => {
  try {
    const response = await createAttribute(attributeData);
    return normalizeAttribute(extractObjectPayload(response));
  } catch (error) {
    throw handleServiceError(error, "Failed to create attribute", {
      service: "attributes",
      operation: "createAttributeService",
    });
  }
};

export const createAttributeValueService = async (attributeId, valueData) => {
  try {
    const response = await createAttributeValue(attributeId, valueData);
    return normalizeValue(extractObjectPayload(response));
  } catch (error) {
    throw handleServiceError(error, "Failed to create attribute value", {
      service: "attributes",
      operation: "createAttributeValueService",
    });
  }
};

export const deleteValueService = async (attributeId, attributeValueId) => {
  try {
    const response = await deleteAttributeValue(attributeId, attributeValueId);
    return response.data;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete attribute value", {
      service: "attributes",
      operation: "deleteValueService",
    });
  }
};

export const deleteAttributesService = async (id) => {
  try {
    const response = await deleteAttribute(id);
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete attribute", {
      service: "attributes",
      operation: "deleteAttributesService",
    });
  }
};