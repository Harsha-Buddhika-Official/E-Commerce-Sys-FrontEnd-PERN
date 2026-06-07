import { useEffect, useState } from "react";
import { fetchAttributesByCategory } from "../service/products.service.js";

export const useProductAttributes = (categoryId, refreshKey = 0) => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const normalizedCategoryId = categoryId === "" || categoryId === null || typeof categoryId === "undefined"
      ? ""
      : Number(categoryId);

    if (!normalizedCategoryId) {
      setAttributes([]);
      return;
    }

    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchAttributesByCategory(normalizedCategoryId);
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.attributes)
          ? res.attributes
          : Array.isArray(res)
          ? res
          : [];
        if (mounted) setAttributes(list);
      } catch (err) {
        if (mounted) setError(err?.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [categoryId, refreshKey]);

  return { attributes, loading, error };
};
