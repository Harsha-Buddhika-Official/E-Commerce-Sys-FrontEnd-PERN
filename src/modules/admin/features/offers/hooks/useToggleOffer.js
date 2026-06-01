import { useState } from "react";
import { toggleOfferActiveService } from "../service/offers.service.js";

export const useToggleOffer = () => {
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState(null);

  const toggleOfferActive = async (offerId, isActive) => {
    if (!offerId) {
      const err = new Error("Offer ID is required");
      setError(err);
      throw err;
    }

    setToggling(true);
    setError(null);

    try {
      const res = await toggleOfferActiveService(offerId, isActive);
      setToggling(false);
      return res;
    } catch (err) {
      setError(err);
      setToggling(false);
      throw err;
    }
  };

  return { toggling, error, toggleOfferActive };
};