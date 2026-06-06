import { useEffect, useState } from "react";
import { getBannerById } from "../services/banner.service.js";

export const useBannerDetail = (bannerId) => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanner = async () => {
    if (!bannerId) return;

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
  };

  useEffect(() => {
    fetchBanner();
  }, [bannerId]);

  return {
    banner,
    loading,
    error,
    refresh: fetchBanner,
  };
};