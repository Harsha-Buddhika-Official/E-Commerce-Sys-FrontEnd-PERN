import { getCategories, getCategory } from "../api/category.api.js";

export const fetchCategories = async () => {
  try {
    return await getCategories();
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
};

export const fetchCategoryNames = async () => {
  try {
    return await getCategory();
  } catch (err) {
    console.error("Error fetching category names:", err);
    throw err;
  }
};
