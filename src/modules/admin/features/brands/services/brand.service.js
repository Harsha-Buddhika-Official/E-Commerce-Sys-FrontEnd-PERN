import { getBrands, getBrandNames, createBrand, deleteBrand, } from "../api/brand.api.js";
import { handleServiceError } from "../../../../../utils/serviceError.js";
import { normalizeBrand, normalizeBrandList, normalizeBrandNameList, } from "./brand.normalizer.js";
import { extractArrayPayload, extractObjectPayload } from "../../../../../utils/payloadExtractors.js";


// ==================== CREATE ====================

export const createBrandService = async (brandData) => {
  try {
    const response = await createBrand(brandData);
    return normalizeBrand(extractObjectPayload(response));
  } catch (error) {
    throw handleServiceError(error, "Failed to create brand", {
      service: "brands",
      operation: "createBrandService",
    });
  }
};


// ==================== READ (LIST) ====================

export const fetchBrands = async () => {
  try {
    const response = await getBrands();
    return normalizeBrandList(extractArrayPayload(response));
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch brands", {
      service: "brands",
      operation: "fetchBrands",
    });
  }
};


// ==================== READ (DROPDOWN) ====================

export const fetchBrandNames = async () => {
  try {
    const response = await getBrandNames();
    return normalizeBrandNameList(extractArrayPayload(response));
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch brand names", {
      service: "brands",
      operation: "fetchBrandNames",
    });
  }
};


// ==================== DELETE ====================

export const deleteBrandService = async (brandId) => {
  try {
    return extractObjectPayload(await deleteBrand(brandId));
  } catch (error) {
    throw handleServiceError(error, "Failed to delete brand", {
      service: "brands",
      operation: "deleteBrandService",
    });
  }
};