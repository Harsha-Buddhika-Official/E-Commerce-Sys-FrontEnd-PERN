import { useEffect, useState, useCallback } from "react";
import { getAllBanners } from "../services/banner.service.js";

export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllBanners();
      setBanners(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return { banners, loading, error, refresh: fetchBanners };
};