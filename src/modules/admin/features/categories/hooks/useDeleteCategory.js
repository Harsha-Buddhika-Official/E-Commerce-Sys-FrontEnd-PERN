import { useState, useCallback } from "react";
import { deleteCategory } from "../services/category.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useDeleteCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteCategoryAction = useCallback(async (categoryId) => {
    if (!categoryId) {
      const hookError = new Error("Category ID is required");
      setError(hookError.message);
      throw hookError;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await deleteCategory(categoryId);
      return response;

    } catch (err) {
      const hookError = handleHookError(err, "Failed to delete category");
      setError(hookError);
      throw hookError;

    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    deleteCategory: deleteCategoryAction,
    loading,
    error,
    reset,
  };
};