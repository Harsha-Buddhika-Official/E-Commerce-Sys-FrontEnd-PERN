import { useCallback, useEffect, useState } from "react";
import { getOfferDetail } from "../service/offers.service.js";

export const useOfferDetail = (offerId) => {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffer = useCallback(async () => {
    if (!offerId) {
      setOffer(null);
      setError("Offer ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const offerData = await getOfferDetail(offerId);
      setOffer(offerData);
    } catch (err) {
      setOffer(null);
      setError(err?.message || "Failed to fetch offer");
    } finally {
      setLoading(false);
    }
  }, [offerId]);

  useEffect(() => {
    fetchOffer();
  }, [fetchOffer]);

  return {offer,loading,error,refresh: fetchOffer,};
};