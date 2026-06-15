import { useState, useEffect, useCallback } from "react";
import { getAllOffers } from "../service/offers.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllOffers();
      setOffers(data ?? []);

    } catch (err) {
      setError(handleHookError(err, "Failed to fetch offers"));
      setOffers([]);

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return {
    offers,
    loading,
    error,
    refresh: fetchOffers,
  };
};