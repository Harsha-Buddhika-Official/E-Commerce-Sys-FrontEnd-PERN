import { useEffect, useState } from "react";
import { getAttributesCatalog } from "../service/attributes.service";

export const useAttributesCatalog = () => {
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCatalog = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAttributesCatalog();
      setCategories(data.categories || []);
      setAttributes(data.attributes || []);
    } catch (err) {
      setCategories([]);
      setAttributes([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCatalog = async () => {
      await fetchCatalog();
    };

    void loadCatalog();
  }, []);

  return {
    categories,
    attributes,
    loading,
    error,
    refresh: fetchCatalog,
  };
};