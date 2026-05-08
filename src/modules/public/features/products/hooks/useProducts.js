import { useEffect, useState } from "react";
import { fetchProducts } from "../services/products.service";

const PRODUCTS_INITIAL_STATE = {
    products: [],
    loading: true,
    error: null,
};

export const useProducts = () => {
    const [state, setState] = useState(PRODUCTS_INITIAL_STATE);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setState((prev) => ({ ...prev, loading: true, error: null }));

            try {
                const products = await fetchProducts();
                if (!cancelled) {
                    setState({ products, loading: false, error: null });
                }
            } catch (err) {
                if (!cancelled) {
                    setState({ ...PRODUCTS_INITIAL_STATE, loading: false, error: err.message });
                }
            }
        };

        load();
        return () => { cancelled = true; };
    }, []);

    return state;
};

// ─── useProductsByCategory ────────────────────────────────────────────────────
// Re-fetches whenever `category` changes.

// export const useProductsByCategory = (category = "Processors") => {
//     const [state, setState] = useState(PRODUCTS_INITIAL_STATE);

//     useEffect(() => {
//         let cancelled = false;

//         const load = async () => {
//             setState((prev) => ({ ...prev, loading: true, error: null }));

//             try {
//                 const products = await fetchProductsByCategory(category);
//                 if (!cancelled) {
//                     setState({ products, loading: false, error: null });
//                 }
//             } catch (err) {
//                 if (!cancelled) {
//                     setState({ ...PRODUCTS_INITIAL_STATE, loading: false, error: err.message });
//                 }
//             }
//         };

//         load();
//         return () => { cancelled = true; };
//     }, [category]); // ← re-runs when category changes

//     return state;
// };

// // ─── useCategories ────────────────────────────────────────────────────────────
// // Fetches both product and accessory categories on mount.

// const CATEGORIES_INITIAL_STATE = {
//     products: [],
//     accessories: [],
//     loading: true,
//     error: null,
// };

// export const useCategories = () => {
//     const [state, setState] = useState(CATEGORIES_INITIAL_STATE);

//     useEffect(() => {
//         let cancelled = false;

//         const load = async () => {
//             setState((prev) => ({ ...prev, loading: true, error: null }));

//             try {
//                 const { products, accessories } = await fetchAllCategories();
//                 if (!cancelled) {
//                     setState({ products, accessories, loading: false, error: null });
//                 }
//             } catch (err) {
//                 if (!cancelled) {
//                     setState({ ...CATEGORIES_INITIAL_STATE, loading: false, error: err.message });
//                 }
//             }
//         };

//         load();
//         return () => { cancelled = true; };
//     }, []);

//     return state;
// };