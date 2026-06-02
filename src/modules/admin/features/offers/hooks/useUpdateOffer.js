import { useState } from "react";
import { updateOfferService } from "../service/offers.service.js";

export const useUpdateOffer = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateOffer = async (offerId, payload) => {
    if (!offerId) {
      const message = "Offer ID is required";
      setError(message);
      throw new Error(message);
    }

    if (!payload) {
      const message = "Offer payload is required";
      setError(message);
      throw new Error(message);
    }

    setUpdating(true);
    setError(null);

    try {
      return await updateOfferService(offerId, payload);
    } catch (err) {
      const message = err?.message || "Failed to update offer";
      setError(message);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updating,
    error,
    updateOffer,
  };
};