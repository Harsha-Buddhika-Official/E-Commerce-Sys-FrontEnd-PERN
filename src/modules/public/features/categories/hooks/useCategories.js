import { useEffect, useState } from "react";
import { fetchAllCategories } from "../services/categories.service.js";
import { getCache, setCache } from "../../../../../utils/cache.js";

/** * Custom hook to fetch product and accessory categories
 * Handles loading, error states, and automatic refetch on mount
 * @returns {Object} { products, accessories, loading, error }
 * */
const INITIAL_STATE = {
    products: [],
    accessories: [],
    loading: true,
    error: null,
};

const cacheKey = "categories_data";

export const useCategories = () => {
    const [state, setState] = useState(INITIAL_STATE);

    useEffect(() => {
        let cancelled = false;
        const cached = getCache(cacheKey);
        const load = async () => {

            if (cached) {
                setState({
                    ...INITIAL_STATE,
                    ...cached
                });
                return;
            }

            setState((prev) => ({ ...prev, loading: true, error: null }));
            
            try {
                const { products, accessories } = await fetchAllCategories();
                if (!cancelled) {
                    setState({ products, accessories, loading: false, error: null });
                    setCache(cacheKey, { products, accessories });
                }
            } catch (err) {
                if (!cancelled) {
                    setState({ ...INITIAL_STATE, loading: false, error: err.message });
                }
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    return state;
};