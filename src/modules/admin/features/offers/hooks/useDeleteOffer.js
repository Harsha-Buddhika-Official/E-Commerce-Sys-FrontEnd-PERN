import { useState } from "react";
import { deleteOfferService } from "../service/offers.service.js";

export const useDeleteOffer = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteOffer = async (offerId) => {
    if (!offerId) {
      const message = "Offer ID is required";
      setError(message);
      throw new Error(message);
    }

    setDeleting(true);
    setError(null);

    try {
      return await deleteOfferService(offerId);
      
    } catch (err) {
      const message = err?.message || "Failed to delete offer";
      setError(message);
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleting,
    error,
    deleteOffer,
  };
};