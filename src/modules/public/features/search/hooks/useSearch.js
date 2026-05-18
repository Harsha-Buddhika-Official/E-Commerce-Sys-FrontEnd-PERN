import { useEffect, useState } from "react";
import { fetchSearchResults } from "../service/search.service";

const initialState = {
  results: [],
  loading: false,
  error: null,
};

export const useSearch = (query, options = {}) => {
  const { minLength = 2, debounceMs = 300 } = options;
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const trimmed = (query || "").trim();
    let cancelled = false;

    if (!trimmed || trimmed.length < minLength) {
      const t = setTimeout(() => {
        if (!cancelled) {
          setState({ results: [], loading: false, error: null });
        }
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    const t = setTimeout(() => {
      if (cancelled) return;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      fetchSearchResults(trimmed)
        .then((results) => {
          if (!cancelled) {
            setState({ results, loading: false, error: null });
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setState({ results: [], loading: false, error: err.message || "Search failed" });
          }
        });
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, minLength, debounceMs]);

  return state;
};
