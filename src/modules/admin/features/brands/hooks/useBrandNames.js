import { useEffect,useState } from "react";
import { fetchBrandNames } from "../services/brand.service.js";

export const useBrandNames = () => {
    const [brandNames, setBrandNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadBrandNames = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchBrandNames();
            setBrandNames(data);
        } catch (err) {
            setError(`Failed to load brands. ${err.message}`);
        } finally {
            setLoading(false);
        }
    };
    useEffect(()=>{
        loadBrandNames()
    }, []);

    return { brandNames, loading, error, refresh: loadBrandNames };
}