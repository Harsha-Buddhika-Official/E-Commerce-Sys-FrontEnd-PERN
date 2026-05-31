import { getBrands, getBrandNames, createBrand, deleteBrand } from "../api/brand.api.js";
import { handleServiceError } from "../../../../../utils/serviceError.js";
import { extractArrayPayload } from "../../../../../utils/payloadExtractors.js";
import { safeNumber, safeText, safeDate, normalizeStatus } from "../../../../../utils/normalizers.js";

// for creating a new brand in brand page 
export const createBrandService = async (brandData) => {
  try {
    const brand = await createBrand(brandData);
    const brandDetails = {
      brand_id: safeNumber(brand.brand_id), 
      brand_name: safeText(brand.brand_name),
      slug: safeText(brand.slug),
      logo_url: safeText(brand.logo_url),
      is_active: Boolean(brand.is_active),
      updated_at: safeDate(brand.updated_at),
      created_at: safeDate(brand.created_at),
      logo_public_id: safeText(brand.logo_public_id),
    };
    return brandDetails;
  } catch (error) {
    throw handleServiceError(error, "Failed to create brand", {
      service: "brands",
      operation: "createBrandService",
    });
  }
};

// for brands page listing and details
export const fetchBrands = async () => {
  try {
    const payload = await getBrands();
    const data = extractArrayPayload(payload);

    const brandDetails = data.map((brand) => ({
      brand_id: safeNumber(brand.brand_id),
      name: safeText(brand.name),
      slug: safeText(brand.slug),
      logo_url: safeText(brand.logo_url),
      is_active: Boolean(brand.is_active),
      updated_at: safeDate(brand.updated_at),
      created_at: safeDate(brand.created_at),
    }));

    return brandDetails;
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch brands", {
      service: "brands",
      operation: "fetchBrands",
    });
  }
};

export const fetchBrandNames = async () => {
  try {
    const payload = await getBrandNames();
    const data = extractArrayPayload(payload);

    const brandNames = data.map((b) => ({
      brand_id: safeNumber(b.brand_id),
      brand_name: safeText(b.name),
    }));
    
    return brandNames;
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch brand names", {
      service: "brands",
      operation: "fetchBrandNames",
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