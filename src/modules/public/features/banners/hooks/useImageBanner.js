import { useState, useEffect } from 'react';
import { fetchImageBanners } from '../services/banners.service.js';
import { getCache, setCache } from "../../../../../utils/cache.js";

export const useImageBanner = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cacheKey = "image_banners";

    const getAllBanners = async () => {
        try {
            setLoading(true);
            setError(null);

            const cachedData = getCache(cacheKey);
            if (cachedData) {
                setBanners(cachedData);
                setLoading(false);
                return;
            }

            const data = await fetchImageBanners();
            // console.log('Fetched image banners:', data);
            setBanners(data);
            setCache(cacheKey, data);
        } catch (error) {
            console.error('Error fetching image banners:', error);
            setError(error.message || 'Failed to load image banners');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllBanners();
    }, []);

    return {
        banners,
        loading,
        error,
        refetch: getAllBanners
    };
};