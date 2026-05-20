import { useCallback, useEffect, useState } from "react";
import { fetchAllOffers } from "../service/offers.service.js";

const INITIAL_STATE = {
  offers: [],
  loading: true,
  error: null,
};

export const useOffers = () => {
  const [state, setState] = useState(INITIAL_STATE);

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const offers = await fetchAllOffers();
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
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const offers = await fetchAllOffers();
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
  }, []);

  return {
    ...state,
    refresh,
  };
};
