import { getBrands, getBrandNames, createBrand, deleteBrand } from "../api/brand.api.js";
import { handleApiError } from "../../../../../utils/apiError.js";

export const fetchBrands = async () => {
  try {
    return await getBrands();
  } catch (err) {
    console.error("Error fetching brands:", err);
    throw err;
  }
};

export const fetchBrandNames = async () => {
  try {
    return await getBrandNames();
  } catch (err) {
    console.error("Error fetching brand names:", err);
    throw err;
  }
};

export const createBrandService = async (brandData) => {
  try {
    return await createBrand(brandData);
  } catch (err) {
    console.error("Error creating brand:", err);
    throw err;
  }
};

export const deleteBrandService = async (brandId) => {
  try {
    return await deleteBrand(brandId);
  } catch (error) {
    throw handleApiError(error, "Failed to delete brand");
  }
};