import { useState, useEffect, useCallback } from "react";
import { fetchCategories } from "../services/category.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCategories();
      setCategories(data ?? []);

    } catch (err) {
      setCategories([]);
      setError(handleHookError(err, "Failed to fetch categories"));

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    categories,
    loading,
    error,
    refresh: load,
  };
};