import API from "../../../../../api/client.js";
import { handleApiError } from "../../../../../utils/apiError.js";

export const getBrands = async () => {
  try {
    const res = await API.get("/brands");
    return res.data;
  } catch (err) {
    handleApiError(err, "Failed to fetch brands");
    throw err;
  }
};

export const createBrand = async (brandData) => {
  try{
    const res = await API.post("/brands", brandData, {
      timeout: 30000,
    });
    return res.data;
  }catch(err){
    handleApiError(err, "Failed to create brand");
    throw err;
  }
};

export const deleteBrand = async (brandId) => {
  try{
    const res = await API.delete(`/brands/${brandId}`);
    return res.data;
  } catch (err) {
    handleApiError(err, "Failed to delete brand");
    throw err;
  }
}

export const getBrandNames = async () => {
  try {
    // Prefer /brands first to avoid noisy 400s when /brands/names is not supported.
    try {
      const res = await API.get("/brands");
      const payload = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      return payload.map((b) => {
        if (typeof b === "string") return { brand_name: b };
        if (b?.brand_name) return b;
        return {
          brand_id: b?.id ?? b?.brand_id,
          brand_name: b?.name ?? b?.brand_name,
        };
      });
    } catch {
      const res = await API.get("/brands/names");
      return res.data;
    }
  } catch (err) {
    throw handleApiError(err, "Failed to fetch brand names");
  }
};