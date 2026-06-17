import { useState, useCallback } from "react";
import { createCategory } from "../services/category.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useCreateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCategoryAction = useCallback(async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const category = await createCategory(payload);
      return category;

    } catch (err) {
      const hookError = handleHookError(err, "Failed to create category");
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
    createCategory: createCategoryAction,
    loading,
    error,
    reset,
  };
};