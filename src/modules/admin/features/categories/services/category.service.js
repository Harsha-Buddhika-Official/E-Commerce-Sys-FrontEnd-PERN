import { getCategories, getCategoryNames } from "../api/category.api.js";
import { handleServiceError } from "../../../../../utils/serviceError.js";
import {safeNumber,safeText,safeDate} from "../../../../../utils/normalizers.js";

const normalizeCategory = (category = {}) => ({
  category_id: safeNumber(category.category_id),
  name: safeText(category.name) || "",
  slug: safeText(category.slug),
  image_url: safeText(category.image_url),
  created_at: safeDate(category.created_at),
  updated_at: safeDate(category.updated_at),
});

export const fetchCategories = async () => {
  try {
    const response = await getCategories();
    
    const categories = response?.data;

    if (!Array.isArray(categories)) {
      throw new Error("Invalid categories response");
    }

    return categories
      .filter(category => category && typeof category === "object")
      .map(normalizeCategory);

  } catch (error) {
    throw handleServiceError(error, "Failed to fetch categories", {
      service: "categories",
      operation: "fetchCategories",
    });
  }
};

export const fetchCategoryNames = async () => {
  try {
    const response = await getCategoryNames();

    if (!Array.isArray(response)) {
      throw new Error("Invalid category names response");
    }

    return response
      .filter((category) => category && typeof category === "object")
      .map((category) => ({
        category_id: safeNumber(category.category_id),
        name: safeText(category.name) || "",
      }));

  } catch (error) {
    throw handleServiceError(error, "Failed to fetch category names", {
      service: "categories",
      operation: "fetchCategoryNames",
    });
  }
};