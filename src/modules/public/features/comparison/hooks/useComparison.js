// src/features/comparison/hooks/useComparison.js
import { useCallback, useEffect, useState } from "react";
import {
  getCompareList,
  addToCompareList,
  removeFromCompareList,
  clearCompareList,
  runComparison,
} from "../services/comparison.service.js";

const INITIAL_RESULT_STATE = {
  result: null,
  loading: false,
  error: null,
  pollAttempt: 0,
};

export const useComparison = () => {
  const [list, setList] = useState(() => getCompareList());
  const [resultState, setResultState] = useState(INITIAL_RESULT_STATE);

  useEffect(() => {
    const handleUpdate = () => setList(getCompareList());
    window.addEventListener("compare:updated", handleUpdate);
    return () => window.removeEventListener("compare:updated", handleUpdate);
  }, []);

  const add = useCallback((productId) => {
    try {
      addToCompareList(productId);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const remove = useCallback((productId) => {
    removeFromCompareList(productId);
  }, []);

  const clear = useCallback(() => {
    clearCompareList();
    setResultState(INITIAL_RESULT_STATE);
  }, []);

  const isInList = useCallback((productId) => list.includes(productId), [list]);

  /**
   * Runs the AI comparison for the current list (or a passed-in list of IDs).
   * Manages loading/error/polling state internally so the UI layer stays simple.
   */
  const compare = useCallback(async (productIds) => {
    const idsToCompare = productIds || getCompareList();

    if (idsToCompare.length < 2) {
      setResultState((prev) => ({ ...prev, error: "Select at least 2 products to compare." }));
      return;
    }

    setResultState({ result: null, loading: true, error: null, pollAttempt: 0 });

    try {
      const data = await runComparison(idsToCompare, (attempt) => {
        setResultState((prev) => ({ ...prev, pollAttempt: attempt }));
      });
      setResultState({ result: data, loading: false, error: null, pollAttempt: 0 });
    } catch (err) {
      setResultState({
        result: null,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to compare products",
        pollAttempt: 0,
      });
    }
  }, []);

  const resetResult = useCallback(() => setResultState(INITIAL_RESULT_STATE), []);

  return {
    // compare list management
    list,
    count: list.length,
    add,
    remove,
    clear,
    isInList,
    // AI comparison execution
    result: resultState.result,
    loading: resultState.loading,
    error: resultState.error,
    pollAttempt: resultState.pollAttempt,
    compare,
    resetResult,
  };
};