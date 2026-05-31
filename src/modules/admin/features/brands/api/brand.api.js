import API from "../../../../../api/client.js";
import { handleApiError } from "../../../../../utils/apiError.js";

// create a new brand for create product form and brands page
export const createBrand = async (brandData) => {
  try {
    const res = await API.post("/brands", brandData, {
      timeout: 30000,
    });
    return res.data;
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to create brand"
    );
  }
};

// get all brands for listing in brands page
export const getBrands = async () => {
  try {
    const res = await API.get("/brands");
    return res.data;
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to fetch brands"
    );
  }
};

//get brand name and id for create product form dropdown
export const getBrandNames = async () => {
  try {
    const res = await API.get("/brands/names");
    return res.data;
  } catch (error) {
    throw handleApiError(
      error, 
      "Failed to fetch brand names"
    );
  }
};

// delete a brand by id for brand details page
export const deleteBrand = async (brandId) => {
  try {
    const res = await API.delete(`/brands/${brandId}`);
    return res.data;
  } catch (error) {
    throw handleApiError(
      error, "Failed to delete brand"
    );
  }
}
