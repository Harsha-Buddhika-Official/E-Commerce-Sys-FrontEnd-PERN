import { useState } from "react";
import { reorderProductImages } from "../service/products.service.js";

export const useReorderProductImages = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const reorderImages = async (productId, primaryImageId, order) => {
    setLoading(true);
    setError(null);
    try {
      return await reorderProductImages(productId, primaryImageId, order);
    } catch (err) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { reorderImages, loading, error };
};