import API from "../../../../../api/client";
import {
  fetchAttributesCatalog,
  createAttribute,
  createAttributeValue as createAttributeValueApi,
  deleteAttributeValue,
  deleteAttribute,
} from "../api/attributes.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";

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
  created_at: value.created_at || null,
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
    throw handleServiceError(error, "Failed to fetch attributes catalog", {
      service: "attributes",
      operation: "getAttributesCatalog",
    });
  }
};

export const createAttributeService = async (attributeData) => {
  try {
    const res = await createAttribute(attributeData);
    return res;
  } catch (error) {
    throw handleServiceError(error, "Failed to create attribute", {
      service: "attributes",
      operation: "createAttributeService",
    });
  }
};

export const createAttributeValueService = async (attributeId, valueData) => {
  try {
    const newValue = await createAttributeValueApi(attributeId, valueData);
    return newValue;
  } catch (error) {
    throw handleServiceError(error, "Failed to create attribute value", {
      service: "attributes",
      operation: "createAttributeValueService",
    });
  }
};

export const deleteValueService = async (attributeId, attributeValueId) => {
  try {
    const res = await deleteAttributeValue(attributeId, attributeValueId);
    return res;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete attribute value", {
      service: "attributes",
      operation: "deleteValueService",
    });
  }
};

export const deleteAttributesService = async (id) => {
  try {
    const res = await deleteAttribute(id);
    return res;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete attribute", {
      service: "attributes",
      operation: "deleteAttributesService",
    });
  }
};

export const getGroupedAttributes = async () => {
  try {
    const response = await API.get("/attributes/grouped");
    const payload = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
      ? response.data.data
      : Array.isArray(response)
      ? response
      : [];

    const groups = payload
      .filter((group) => group && typeof group === "object")
      .map((group) => {
        const categoryId = Number(group.category_id);
        const attributes = Array.isArray(group.attributes)
          ? group.attributes
              .filter((attribute) => attribute && typeof attribute === "object")
              .map((attribute) => ({
                attribute_id: Number(attribute.attribute_id),
                name: attribute.name || "",
                category_id: Number(categoryId),
                values: Array.isArray(attribute.values) ? attribute.values.map(normalizeValue) : [],
              }))
              .sort((a, b) => a.name.localeCompare(b.name))
          : [];

        return {
          category_id: categoryId,
          category_name: group.category_name || group.name || "",
          attributes,
        };
      })
      .sort((a, b) => a.category_id - b.category_id);

    const categories = groups.map((group) => ({
      category_id: group.category_id,
      name: group.category_name,
    }));

    const attributes = groups
      .flatMap((group) => group.attributes)
      .sort((a, b) => a.category_id - b.category_id || a.name.localeCompare(b.name));

    return {
      groups,
      categories,
      attributes,
    };
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch grouped attributes", {
      service: "attributes",
      operation: "getGroupedAttributes",
    });
  }
};