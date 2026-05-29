import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOfferDetail } from "../service/offers.service.js";

const INITIAL_STATE = {
  offer: null,
  loading: true,
  error: null,
};

/**
 * Hook for loading a single offer detail record.
 * Accepts an explicit offerId or falls back to the route param.
 */
export const useOfferDetail = (offerIdFromArg) => {
  const params = useParams();
  const offerId = offerIdFromArg ?? params.id;
  const [state, setState] = useState(() => (
    offerId
      ? INITIAL_STATE
      : { offer: null, loading: false, error: "Offer ID is required" }
  ));

  useEffect(() => {
    if (!offerId) {
      return;
    }

    let cancelled = false;

    getOfferDetail(offerId)
      .then((offer) => {
        if (!cancelled) {
          setState({ offer, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ offer: null, loading: false, error: err.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [offerId]);

  return {
    ...state,
    refresh: () => {
      if (offerId) {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        getOfferDetail(offerId)
          .then((offer) => setState({ offer, loading: false, error: null }))
          .catch((err) => setState({ offer: null, loading: false, error: err.message }));
      }
    },
  };
};
