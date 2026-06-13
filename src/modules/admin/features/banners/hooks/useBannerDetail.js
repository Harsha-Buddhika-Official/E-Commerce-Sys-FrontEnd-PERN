import { useEffect, useState, useCallback } from "react";
import { getBannerById } from "../services/banner.service.js";

export const useBannerDetail = (bannerId) => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanner = useCallback(async () => {
    if (!bannerId) {
      setBanner(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getBannerById(bannerId);
      setBanner(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [bannerId]);

  useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

  return {banner, loading, error, refresh: fetchBanner,};
};