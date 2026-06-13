import { getCategories, getCategoryNames, createCategory as createCategoryApi, deleteCategory as deleteCategoryApi } from "../api/category.api.js";
import { handleServiceError } from "../../../../../utils/serviceError.js";
import {safeNumber,safeText,safeDate} from "../../../../../utils/normalizers.js";

const normalizeCategory = (category = {}) => ({
  category_id: safeNumber(category.category_id),
  name: safeText(category.name) || "",
  slug: safeText(category.slug),
  category_type: safeText(category.category_type),
  img_url: safeText(category.img_url),
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

export const createCategory = async (payload) => {
  const { name, category_type, image } = payload;
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category_type", category_type);
    if (image) {
      formData.append("media", image);
    }
    const response = await createCategoryApi(formData);

    return normalizeCategory(response);
  } catch (error) {
    throw handleServiceError(error, "Failed to create category", {
      service: "categories",
      operation: "createCategory",
    });
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    return await deleteCategoryApi(categoryId);
  } catch (error) {
    throw handleServiceError(error, "Failed to delete category", {
      service: "categories",
      operation: "deleteCategory",
    });
  }
};