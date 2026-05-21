import { useCallback, useEffect, useState } from "react";
import {
  fetchActiveOffers,
  fetchAllOffers,
  fetchUpcomingOffers,
} from "../service/offers.service.js";

const INITIAL_STATE = {
  offers: [],
  loading: true,
  error: null,
};

export const useOffers = (mode = "all") => {
  const [state, setState] = useState(INITIAL_STATE);

  const loadOffers = useCallback(async () => {
    if (mode === "active") return fetchActiveOffers();
    if (mode === "upcoming") return fetchUpcomingOffers();
    return fetchAllOffers();
  }, [mode]);

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const offers = await loadOffers();
      setState({
        offers,
        loading: false,
        error: null,
      });
      return offers;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load offers",
      }));
      return [];
    }
  }, [loadOffers]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const offers = await loadOffers();
        if (!cancelled) {
          setState({
            offers,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            ...INITIAL_STATE,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load offers",
          });
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [loadOffers]);

  return {
    ...state,
    refresh,
  };
};
