import { getCategories, getCategory } from "../api/category.api.js";
import { handleServiceError } from "../../../../../utils/serviceError.js";

export const fetchCategories = async () => {
  try {
    return await getCategories();
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch categories", {
      service: "categories",
      operation: "fetchCategories",
    });
  }
};

export const fetchCategoryNames = async () => {
  try {
    return await getCategory();
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch category names", {
      service: "categories",
      operation: "fetchCategoryNames",
    });
  }
};
