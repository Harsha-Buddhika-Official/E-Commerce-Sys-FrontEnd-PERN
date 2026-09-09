import { useEffect, useState } from "react";
import { fetchHomepageData } from "../services/homePage.service.js";
import { getCache, setCache } from "../../../../../utils/cache.js";

const CACHE_KEY = "homepage_data";

const INITIAL_STATE = {
    bestSellers: [],
    latestProducts: [],
    loading: true,
    error: null,
};

export const useHomepage = () => {
    const [state, setState] = useState(INITIAL_STATE);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            // 1. Try cache first
            const cached = getCache(CACHE_KEY);
            if (cached) {
                if (!cancelled) {
                    setState({
                        bestSellers: cached.bestSellers,
                        latestProducts: cached.latest,
                        loading: false,
                        error: null,
                    });
                }
                return; // skip the API call entirely
            }

            // 2. No valid cache — fetch from backend
            setState((prev) => ({ ...prev, loading: true, error: null }));

            try {
                const { bestSellers, latest } = await fetchHomepageData();

                if (!cancelled) {
                    setState({
                        bestSellers,
                        latestProducts: latest,
                        loading: false,
                        error: null,
                    });
                    setCache(CACHE_KEY, { bestSellers, latest });
                }
            } catch (err) {
                if (!cancelled) {
                    setState({
                        ...INITIAL_STATE,
                        loading: false,
                        error: err.message,
                    });
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