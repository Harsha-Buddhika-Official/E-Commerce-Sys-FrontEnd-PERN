import { useCallback, useState } from "react";
import { createOfferService } from "../service/offers.service.js";

export const useCreateOffer = () => {
  const [createdOffer, setCreatedOffer] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const createOffer = useCallback(async (offerData) => {
    if (!offerData || typeof offerData !== "object") {
      const validationError = new Error("Offer payload is required");
      setError(validationError.message);
      throw validationError;
    }

    setCreating(true);
    setError(null);

    try {
      const offer = await createOfferService(offerData);
      setCreatedOffer(offer);
      return offer;
    } catch (err) {
      setError(err?.message || "Failed to create offer");
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCreatedOffer(null);
    setError(null);
    setCreating(false);
  }, []);

  return {createdOffer,creating,error,createOffer,reset,};
};