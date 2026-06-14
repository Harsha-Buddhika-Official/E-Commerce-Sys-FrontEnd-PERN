import { fetchBrands } from "../services/brand.service.js";
import { useState, useEffect, useCallback } from "react";
import { handleHookError } from "../../../../../utils/handleHookError.js";

const INITIAL_STATE = {
    brands: [],
};

export const useBrands = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadBrands = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchBrands();

            setState({
                brands: data ?? [],
            });
        } catch (err) {
            const hookError = handleHookError(err, "Failed to load brands");
            setError(hookError);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBrands();
    }, [loadBrands]);

    return {
        ...state,
        loading,
        error,
        refresh: loadBrands,
    };
};