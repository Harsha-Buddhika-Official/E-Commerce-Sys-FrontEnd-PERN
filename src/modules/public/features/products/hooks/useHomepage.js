import { useEffect,useState } from "react";
import { fetchHomepageData } from "../api/homepageService";

export const useHomepage = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadHomepageData = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchHomepageData();
                setBestSellers(data.bestSellers);
                setLatestProducts(data.latest);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadHomepageData();
    }, []);

    return { bestSellers, latestProducts, loading, error };
}