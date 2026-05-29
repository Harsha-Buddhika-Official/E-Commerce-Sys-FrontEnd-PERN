import { useState, useEffect } from "react";
import { getAllOffers } from "../service/offers.service.js";

/**
 * Hook to fetch and manage offers state
 * Provides: offers array, loading state, error state, and refresh function
 */
export const useOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllOffers();
      setOffers(data);
    } catch (err) {
      setError(err.message || "Failed to fetch offers");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchOffers();
  }, []);

  return {
    offers,
    loading,
    error,
    refresh: fetchOffers,
  };
};
