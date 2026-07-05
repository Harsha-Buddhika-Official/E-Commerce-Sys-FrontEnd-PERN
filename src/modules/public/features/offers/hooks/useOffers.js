import { useCallback, useEffect, useState } from "react";
import { fetchOffersService } from "../service/offers.service.js";

const INITIAL_STATE = {
  offers: [],
  loading: true,
  error: null,
};

export const useOffers = (mode = "all") => {
  const [state, setState] = useState(INITIAL_STATE);

  const load = useCallback(async () => {
    setState((p) => ({ ...p, loading: true, error: null }));

    try {
      const offers = await fetchOffersService(mode);

      setState({offers,loading: false,error: null,});
      
      return offers;
    } catch (error) {
      setState({offers: [],loading: false,error: error.message || "Failed to load offers",});

      return [];
    }
  }, [mode]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refresh: load };
};