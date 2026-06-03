import { useState, useEffect, useCallback } from "react";
import { fetchStatusBarData } from "../services/dashboard.service.js";

const INITIAL_STATS = {
  revenue: 0,
  revenueGrowth: 0,
  totalOrders: 0,
  orderGrowth: 0,
  activeProducts: 0,
  lowStockProducts: 0,
  pendingOrders: 0,
  shippedOrders: 0,
};

export const useStatusBar = () => {
  const [data, setData] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const stats = await fetchStatusBarData();
      setData(stats);
    } catch (err) {
      setData(INITIAL_STATS);
      setError(err?.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ...data,
    loading,
    error,
    refresh: loadData,
  };
};