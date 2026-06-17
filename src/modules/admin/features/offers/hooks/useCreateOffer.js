import { useCallback, useState } from "react";
import { createOfferService } from "../service/offers.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useCreateOffer = () => {
  const [createdOffer, setCreatedOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOffer = useCallback(async (offerData) => {
    if (!offerData || typeof offerData !== "object") {
      const hookError = new Error("Offer payload is required");
      setError(hookError.message);
      throw hookError;
    }

    setLoading(true);
    setError(null);

    try {
      const offer = await createOfferService(offerData);
      setCreatedOffer(offer);
      return offer;

    } catch (err) {
      const hookError = handleHookError(err, "Failed to create offer");
      setError(hookError);
      throw hookError;

    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCreatedOffer(null);
    setError(null);
  }, []);

  return {
    createdOffer,
    loading,
    error,
    createOffer,
    reset,
  };
};