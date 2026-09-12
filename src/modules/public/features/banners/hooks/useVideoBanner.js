import { useState, useEffect } from 'react';
import { fetchVideoBanners } from '../services/banners.service.js';
import { getCache, setCache } from "../../../../../utils/cache.js";

export const useVideoBanner = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cacheKey = "video_banners";

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

            const data = await fetchVideoBanners();
            // console.log('Fetched video banners:', data);
            setBanners(data);
            setCache(cacheKey, data);
        } catch (error) {
            console.error('Error fetching video banners:', error);
            setError(error.message || 'Failed to load video banners');
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