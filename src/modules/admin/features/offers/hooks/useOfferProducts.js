import { useCallback, useState } from "react";
import { attachProductService } from "../service/offers.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useOfferProducts = () => {
  const [attachedProduct, setAttachedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const attachProduct = useCallback(async (offerId, productId) => {
    if (!offerId || !productId) {
      const hookError = new Error(
        !offerId ? "Offer ID is required" : "Product ID is required"
      );
      setError(hookError.message);
      throw hookError;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await attachProductService(offerId, productId);
      setAttachedProduct(result);
      return result;

    } catch (err) {
      const hookError = handleHookError(err, "Failed to attach product to offer");
      setError(hookError);
      throw hookError;

    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAttachedProduct(null);
    setError(null);
  }, []);

  return {
    attachedProduct,
    loading,
    error,
    attachProduct,
    reset,
  };
};