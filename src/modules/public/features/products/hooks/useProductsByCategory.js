import { useEffect, useState } from "react";
import { fetchProducts, fetchProductsByCategory } from "../api/productsByCategoryService";
import { fetchAllCategories } from "../../categories/api/categoriesService";

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const productsData = await fetchProducts();
                setProducts(productsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return { products, loading, error };
};

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

export const useCategories = () => {
    const [products, setProducts] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchAllCategories();
                setProducts(data.products);
                setAccessories(data.accessories);
            } catch (err) {
                setError(err.message);
                console.error("Failed to load categories:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    return { products, accessories, loading, error };
};