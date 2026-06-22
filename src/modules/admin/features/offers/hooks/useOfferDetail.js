import { useCallback, useEffect, useState } from "react";
import { getOfferDetail } from "../service/offers.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useOfferDetail = (offerId) => {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffer = useCallback(async () => {
    if (!offerId) {
      setOffer(null);
      setError(handleHookError(new Error("Offer ID is required"), "Offer ID is required"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const offerData = await getOfferDetail(offerId);
      console.log("Fetched offer data:", offerData);
      setOffer(offerData ?? null);

    } catch (err) {
      setOffer(null);
      setError(handleHookError(err, "Failed to fetch offer"));

    } finally {
      setLoading(false);
    }
  }, [offerId]);

  useEffect(() => {
    fetchOffer();
  }, [fetchOffer]);

  return {
    offer,
    loading,
    error,
    refresh: fetchOffer,
  };
};