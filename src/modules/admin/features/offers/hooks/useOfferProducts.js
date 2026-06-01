import { useCallback, useState } from "react";
import { attachProductService } from "../service/offers.service.js";

export const useOfferProducts = () => {
  const [attachedProduct, setAttachedProduct] = useState(null);
  const [attaching, setAttaching] = useState(false);
  const [error, setError] = useState(null);

  const attachProduct = useCallback(async (offerId, productId) => {
    if (!offerId) {
      const validationError = new Error("Offer ID is required");
      setError(validationError.message);
      throw validationError;
    }

    if (!productId) {
      const validationError = new Error("Product ID is required");
      setError(validationError.message);
      throw validationError;
    }

    setAttaching(true);
    setError(null);

    try {
      const result = await attachProductService(offerId, productId);
      setAttachedProduct(result);
      return result;
    } catch (err) {
      setError(err?.message || "Failed to attach product to offer");
      throw err;
    } finally {
      setAttaching(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAttachedProduct(null);
    setError(null);
    setAttaching(false);
  }, []);

  return {attachedProduct,attaching,error,attachProduct,reset,};
};