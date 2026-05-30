import { useState } from "react";
import { updateProductFull } from "../service/products.service.js";

export const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProduct = async (productId, payload, images = []) => {
    setLoading(true);
    setError(null);

    try {
      return await updateProductFull(productId, payload, images);
    } catch (err) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProduct, loading, error };
};
