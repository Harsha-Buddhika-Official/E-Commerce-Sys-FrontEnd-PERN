import { fetchAttributesCatalog, createAttribute, createAttributeValue, deleteAttributeValue, deleteAttribute } from "../api/attributes.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";
import { extractObjectPayload } from "../../../../../utils/payloadExtractors.js";
import { normalizeCatalogPayload, normalizeAttribute, normalizeValue } from "./attribute.normalizer.js";

// ==================== CREATE ====================

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


// ==================== READ ====================

// get all attributes with their values divided into categories for attribute page
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


// ==================== DELETE ====================

export const deleteAttributesService = async (id) => {
  try {
    return extractObjectPayload(await deleteAttribute(id));
  } catch (error) {
    throw handleServiceError(error, "Failed to delete attribute", {
      service: "attributes",
      operation: "deleteAttributesService",
    });
  }
};

export const deleteValueService = async (attributeId, attributeValueId) => {
  try {
    return extractObjectPayload(await deleteAttributeValue(attributeId, attributeValueId));
  } catch (error) {
    throw handleServiceError(error, "Failed to delete attribute value", {
      service: "attributes",
      operation: "deleteValueService",
    });
  }
};