import { useCallback, useEffect, useState } from "react";
import { fetchBrandNames } from "../services/brand.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

const INITIAL_STATE = {
    brandNames: [],
};

export const useBrandNames = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadBrandNames = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchBrandNames();

            setState({ brandNames: data ?? [], });
        } catch (err) {
            const hookError = handleHookError(err, "Failed to load brand names");
            setError(hookError);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBrandNames();
    }, [loadBrandNames]);

    return {
        ...state,
        loading,
        error,
        refresh: loadBrandNames,
    };
};