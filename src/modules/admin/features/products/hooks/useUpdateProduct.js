import { useState } from "react";
import { updateProductFull } from "../service/products.service.js";

export const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProduct = async (productId, payload) => {
    setLoading(true);
    setError(null);
    console.log(payload);

    try {
      return await updateProductFull(productId, payload);
    } catch (err) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProduct, loading, error };
};
