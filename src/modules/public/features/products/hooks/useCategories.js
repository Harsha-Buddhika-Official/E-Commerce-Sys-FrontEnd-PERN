import { useEffect, useState } from "react";
import { fetchAllCategories } from "../api/categoriesService";

/**
 * Custom hook to fetch product and accessory categories
 * Handles loading, error states, and automatic refetch on mount
 * @returns {Object} { products, accessories, loading, error }
 */
export const useCategories = () => {
  const [products, setProducts] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllCategories();
        setProducts(data.products);
        setAccessories(data.accessories);
      } catch (err) {
        setError(err.message);
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { products, accessories, loading, error };
};
