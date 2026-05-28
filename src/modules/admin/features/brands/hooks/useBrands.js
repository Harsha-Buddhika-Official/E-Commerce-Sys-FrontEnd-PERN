import { fetchBrands } from "../services/brand.service.js";
import { useState, useEffect } from "react";

export const useBrands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
        const loadBrands = async () => {
            try {
                const fetchedBrands = await fetchBrands();
                const normalizedBrands = Array.isArray(fetchedBrands)
                    ? fetchedBrands
                    : Array.isArray(fetchedBrands?.brands)
                        ? fetchedBrands.brands
                        : Array.isArray(fetchedBrands?.data)
                            ? fetchedBrands.data
                            : [];

                setBrands(normalizedBrands);
            } catch (err) {
                setError(`Failed to load brands. ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
    useEffect(() => {
        loadBrands();
    }, []);

    return { brands, loading, error, refresh: loadBrands };
};