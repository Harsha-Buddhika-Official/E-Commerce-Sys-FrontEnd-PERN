import { useState } from "react";
import { updateProductDetails } from "../service/products.service.js";

export const useUpdateProductDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const updateDetails = async (productId, payload) => {
    setLoading(true);
    setError(null);
    try {
      return await updateProductDetails(productId, payload);
    } catch (err) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateDetails, loading, error };
};