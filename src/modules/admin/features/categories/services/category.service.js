import { getCategories, getCategoryNames, createCategory as createCategoryApi, deleteCategory as deleteCategoryApi, } from "../api/category.api.js";
import { handleServiceError } from "../../../../../utils/serviceError.js";
import { extractArrayPayload, extractObjectPayload, } from "../../../../../utils/payloadExtractors.js";
import { normalizeCategory, normalizeCategoryList, normalizeCategoryNameList, } from "./category.normalizer.js";


// ==================== FETCH CATEGORIES ====================

export const fetchCategories = async () => {
  try {
    const response = await getCategories();
    const data = extractArrayPayload(response);

    return normalizeCategoryList(data);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch categories", {
      service: "categories",
      operation: "fetchCategories",
    });
  }
};


// ==================== FETCH CATEGORY NAMES ====================

export const fetchCategoryNames = async () => {
  try {
    const response = await getCategoryNames();
    const data = extractArrayPayload(response);

    return normalizeCategoryNameList(data);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch category names", {
      service: "categories",
      operation: "fetchCategoryNames",
    });
  }
};


// ==================== CREATE CATEGORY ====================

export const createCategory = async (payload) => {
  if (!payload) throw new Error("Category payload is required");

  const { name, category_type, image } = payload;

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category_type", category_type);

    if (image) {
      formData.append("media", image);
    }

    const response = await createCategoryApi(formData);
    const data = extractObjectPayload(response);

    return normalizeCategory(data);
  } catch (error) {
    throw handleServiceError(error, "Failed to create category", {
      service: "categories",
      operation: "createCategory",
    });
  }
};


// ==================== DELETE CATEGORY ====================

export const deleteCategory = async (categoryId) => {
  if (!categoryId) throw new Error("Category ID is required");

  try {
    const response = await deleteCategoryApi(categoryId);
    return extractObjectPayload(response);
  } catch (error) {
    throw handleServiceError(error, "Failed to delete category", {
      service: "categories",
      operation: "deleteCategory",
    });
  }
};