import { useState } from "react";
import { toggleOfferService } from "../service/offers.service.js";

export const useToggleOffer = () => {
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState(null);

  const toggleOfferActive = async (offerId, isActive) => {
    if (!offerId) {
      const message = "Offer ID is required";
      setError(message);
      throw new Error(message);
    }

    setToggling(true);
    setError(null);

    try {
      return await toggleOfferService(offerId, isActive);
    } catch (err) {
      const message = err?.message || "Failed to update offer status";
      setError(message);
      throw err;
    } finally {
      setToggling(false);
    }
  };

  return {toggling,error,toggleOfferActive,};
};