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

export const getCategoryNames = async () => {
  try {
    const response = await API.get("/categories/names");
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch category names");
  }
};

export const createCategory = async (formData) => {
  try {
    const response = await API.post("/categories", formData,{
      headers: {"Content-Type": "multipart/form-data",},
      timeout: 100000,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to create category");
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await API.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to delete category");
  }
};