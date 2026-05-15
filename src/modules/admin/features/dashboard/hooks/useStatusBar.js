import { fetchStatusBarData } from "../services/statusBar.service";
import { useState, useEffect } from "react";

export const useStatusBar = () => {
  const [data, setData] = useState({
    totalRevenueThisMonth: 0,
    comparedRevenuePercentage: 0,
    totalOrdersThisMonth: 0,
    comparedOrdersPercentage: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    shippedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchStatusBarData();
          setData((current) => ({
            ...current,
            ...fetchedData,
          }));
          console.log("Fetched status bar data:", fetchedData);
      } catch (err) {
          setError(`Failed to load status bar data. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { ...data, loading, error };
};