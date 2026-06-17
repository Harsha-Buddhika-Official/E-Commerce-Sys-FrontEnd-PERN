import { useCallback, useState } from "react";
import { deleteOfferService } from "../service/offers.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useDeleteOffer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteOffer = useCallback(async (offerId) => {
    if (offerId == null) {
      const hookError = new Error("Offer ID is required");
      setError(hookError.message);
      throw hookError;
    }

    setLoading(true);
    setError(null);

    try {
      return await deleteOfferService(offerId);

    } catch (err) {
      const hookError = handleHookError(err, "Failed to delete offer");
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
    deleteOffer,
    loading,
    error,
    reset,
  };
};