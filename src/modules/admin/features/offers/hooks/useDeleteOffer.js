import { useState } from "react";
import { deleteOfferService } from "../service/offers.service.js";

/**
 * Hook to delete an offer
 * Returns: { deleting, error, deleteOffer }
 */
export const useDeleteOffer = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteOffer = async (offerId) => {
    if (!offerId) {
      const err = new Error("Offer ID is required");
      setError(err);
      throw err;
    }

    setDeleting(true);
    setError(null);
    try {
      const res = await deleteOfferService(offerId);
      setDeleting(false);
      return res;
    } catch (err) {
      setError(err);
      setDeleting(false);
      throw err;
    }
  };

  return { deleting, error, deleteOffer };
};
