import { getBrands, getBrandNames, createBrand, deleteBrand } from "../api/brand.api.js";
import { handleServiceError } from "../../../../../utils/serviceError.js";

export const fetchBrands = async () => {
  try {
    return await getBrands();
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch brands", {
      service: "brands",
      operation: "fetchBrands",
    });
  }
};

export const fetchBrandNames = async () => {
  try {
    return await getBrandNames();
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch brand names", {
      service: "brands",
      operation: "fetchBrandNames",
    });
  }
};

export const createBrandService = async (brandData) => {
  try {
    return await createBrand(brandData);
  } catch (error) {
    throw handleServiceError(error, "Failed to create brand", {
      service: "brands",
      operation: "createBrandService",
    });
  }
};

export const deleteBrandService = async (brandId) => {
  try {
    return await deleteBrand(brandId);
  } catch (error) {
    throw handleServiceError(error, "Failed to delete brand", {
      service: "brands",
      operation: "deleteBrandService",
    });
  }
};