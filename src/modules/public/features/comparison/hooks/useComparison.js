// src/features/comparison/hooks/useComparison.js
import { useCallback, useEffect, useState } from "react";
import {
  getCompareList,
  addToCompareList,
  removeFromCompareList,
  clearCompareList,
} from "../services/comparison.service.js";

export const useComparison = () => {
  const [list, setList] = useState(() => getCompareList());

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

  const clear = useCallback(() => clearCompareList(), []);

  const isInList = useCallback((productId) => list.includes(productId), [list]);

  return { list, count: list.length, add, remove, clear, isInList };
};