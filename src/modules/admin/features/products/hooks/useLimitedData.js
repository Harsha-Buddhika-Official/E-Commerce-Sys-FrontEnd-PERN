import { getProductsLimitedData } from "../service/products.service.js";
import { useState, useEffect } from "react";

export const useLimitedData = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductsLimitedData();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error };
};
