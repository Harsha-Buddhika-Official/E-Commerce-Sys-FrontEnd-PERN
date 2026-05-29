import API from "../../../../../api/client.js";
import { handleApiError } from "../../../../../utils/apiError.js";

export const getCategories = async () => {
  try {
    const response = await API.get("/categories");
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch categories");
  }
};

export const getCategory = async () => {
  try {
    const response = await API.get("/categories/names");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};