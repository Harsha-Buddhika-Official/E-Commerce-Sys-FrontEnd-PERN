import { useState } from "react";
import { createProduct as createProductService } from "../services/product.service.js";

export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProduct = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createProductService(payload);
      return res;
    } catch (err) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProduct, loading, error };
};
