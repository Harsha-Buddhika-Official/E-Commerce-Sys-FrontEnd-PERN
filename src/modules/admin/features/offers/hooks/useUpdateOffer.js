import { useState } from "react";
import { updateOfferService } from "../service/offerUpdate.service";

/**
 * Hook to update an offer
 * Returns: { updating, error, updateOffer }
 */
export const useUpdateOffer = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateOffer = async (offerId, payload) => {
    if (!offerId) {
      const err = new Error("Offer ID is required");
      setError(err);
      throw err;
    }
    if (!payload) {
      const err = new Error("Offer payload is required");
      setError(err);
      throw err;
    }

    setUpdating(true);
    setError(null);
    try {
      const res = await updateOfferService(offerId, payload);
      setUpdating(false);
      return res;
    } catch (err) {
      setError(err);
      setUpdating(false);
      throw err;
    }
  };

  return { updating, error, updateOffer };
};
