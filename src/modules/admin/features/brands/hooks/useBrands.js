import { fetchBrands } from "../services/brand.service.js";
import { useState, useEffect, useCallback } from "react";

export const useBrands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadBrands = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const brands = await fetchBrands();
            setBrands(brands);
        } catch (err) {
            setError(`Failed to load brands. ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        loadBrands();
    }, [loadBrands]);

    return { brands, loading, error, refresh: loadBrands };
};