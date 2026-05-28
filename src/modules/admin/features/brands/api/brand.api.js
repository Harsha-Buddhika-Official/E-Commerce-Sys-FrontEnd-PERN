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
    const res = await API.get("/brands/names");
    return res.data;
  } catch (err) {
    handleApiError(err, "Failed to fetch brand names");
    throw err;
  }
};