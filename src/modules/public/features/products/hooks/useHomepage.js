// features/products/hooks/useHomepage.js
// Layer: Hook — owns async state only. No API calls, no transforms.

import { useEffect, useState } from "react";
import { fetchHomepageData } from "../services/homepage.service.js";  // ← correct path

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