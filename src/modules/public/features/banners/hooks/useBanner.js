import { useState, useEffect } from 'react';
import { fetchBanners } from '../services/banners.service.js';

export const useBanner = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAllBanners = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await fetchBanners();

            setBanners(data);
        } catch (error) {
            console.error('Error fetching banners:', error);
            setError(error.message || 'Failed to load banners');
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