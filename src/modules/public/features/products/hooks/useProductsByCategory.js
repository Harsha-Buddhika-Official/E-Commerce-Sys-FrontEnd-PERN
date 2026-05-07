import { useEffect, useState } from "react";
import { fetchProductsByCategory } from "../api/productsByCategoryService";

export const useProductsByCategory = (category = "Processors") => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const productsData = await fetchProductsByCategory(category);
                setProducts(productsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [category]);

    return { products, loading, error };
};
