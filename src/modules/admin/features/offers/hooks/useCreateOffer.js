import { useState } from "react";
import { createOfferService } from "../service/offerCreate.service";

/**
 * Hook to create a new offer
 * Returns: { creating, error, createOffer }
 */
export const useCreateOffer = () => {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const createOffer = async (payload) => {
    if (!payload) {
      const err = new Error("Offer payload is required");
      setError(err);
      throw err;
    }

    setCreating(true);
    setError(null);
    try {
      const res = await createOfferService(payload);
      setCreating(false);
      return res;
    } catch (err) {
      setError(err);
      setCreating(false);
      throw err;
    }
  };

  return { creating, error, createOffer };
};
