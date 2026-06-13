import { useState, useCallback } from "react";
import { deleteCategory } from "../services/category.service.js";

export const useDeleteCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const remove = useCallback(async (categoryId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await deleteCategory(categoryId);
      return response;
    } catch (err) {
      setError(err?.message || "Failed to delete category");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteCategory: remove,
    loading,
    error,
  };
};