import { useState, useCallback } from "react";
import { createCategory } from "../services/category.service.js";

export const useCreateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const category = await createCategory(payload);
      return category;
    } catch (err) {
      setError(err?.message || "Failed to create category");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createCategory: create,
    loading,
    error,
  };
};