import { useCallback, useState } from "react";
import { toggleOfferService } from "../service/offers.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useToggleOffer = () => {
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState(null);

  const toggleOfferActive = useCallback(async (offerId, isActive) => {
    if (!offerId) {
      const hookError = new Error("Offer ID is required");
      setError(hookError.message);
      throw hookError;
    }

    setToggling(true);
    setError(null);

    try {
      return await toggleOfferService(offerId, isActive);

    } catch (err) {
      const hookError = handleHookError(err, "Failed to update offer status");
      setError(hookError);
      throw hookError;

    } finally {
      setToggling(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    toggleOfferActive,
    loading: toggling,
    error,
    reset,
  };
};