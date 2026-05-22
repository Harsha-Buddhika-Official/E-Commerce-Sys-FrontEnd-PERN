import { fetchBrands } from "../services/getBrand.service.js";
import { useState, useEffect } from "react";

export const useBrands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
        loadBrands();
    }, []);

    return { brands, loading, error };
};