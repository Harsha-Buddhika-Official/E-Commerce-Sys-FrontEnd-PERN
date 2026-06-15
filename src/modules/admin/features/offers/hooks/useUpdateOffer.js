import { useCallback, useState } from "react";
import { updateOfferService } from "../service/offers.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useUpdateOffer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateOffer = useCallback(async (offerId, payload) => {
    if (!offerId) {
      const hookError = new Error("Offer ID is required");
      setError(hookError.message);
      throw hookError;
    }

    if (!payload) {
      const hookError = new Error("Offer payload is required");
      setError(hookError.message);
      throw hookError;
    }

    setLoading(true);
    setError(null);

    try {
      return await updateOfferService(offerId, payload);

    } catch (err) {
      const hookError = handleHookError(err, "Failed to update offer");
      setError(hookError);
      throw hookError;

    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    updateOffer,
    loading,
    error,
    reset,
  };
};