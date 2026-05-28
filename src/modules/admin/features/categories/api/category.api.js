import API from "../../../../../api/client.js";
import { handleApiError } from "../../../../../utils/apiError.js";

export const getCategories = async () => {
  try {
    // try the product categories endpoint first (per API docs), fallback to /categories
    let response;
    try {
      response = await API.get("/categories/products");
    } catch {
      response = await API.get("/categories");
    }
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