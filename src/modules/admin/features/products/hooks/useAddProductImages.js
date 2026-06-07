import { useState } from "react";
import { addProductImages } from "../service/products.service.js";

export const useAddProductImages = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const addImages = async (productId, files) => {
    setLoading(true);
    setError(null);
    try {
      return await addProductImages(productId, files);
    } catch (err) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addImages, loading, error };
};