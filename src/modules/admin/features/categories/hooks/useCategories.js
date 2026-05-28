import { useState, useEffect } from "react";
import { fetchCategories } from "../services/category.service.js";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCategories();
      const normalized = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.categories)
        ? res.categories
        : Array.isArray(res)
        ? res
        : [];
      setCategories(normalized);
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return { categories, loading, error, refresh: load };
};
