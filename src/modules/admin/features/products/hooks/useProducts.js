import { useState, useEffect } from "react";
import { getAllProductsLimited } from "../service/products.service.js";

/**
 * Hook to fetch and manage products state
 * Provides: products array, loading state, error state, and refresh function
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProductsLimited();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refresh: fetchProducts,
  };
};
