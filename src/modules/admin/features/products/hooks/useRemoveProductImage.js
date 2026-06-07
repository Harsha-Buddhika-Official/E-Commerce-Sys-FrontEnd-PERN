import { useState } from "react";
import { removeProductImage } from "../service/products.service.js";

export const useRemoveProductImage = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const removeImage = async (productId, imageId) => {
    setLoading(true);
    setError(null);
    try {
      return await removeProductImage(productId, imageId);
    } catch (err) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removeImage, loading, error };
};