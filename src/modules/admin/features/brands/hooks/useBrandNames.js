import { useEffect,useState } from "react";
import { fetchBrandNames } from "../services/brand.service.js";

export const useBrandNames = () => {
    const [brandNames, setBrandNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadBrandNames = async () => {
        try {
            const BrandNames = await fetchBrandNames();
            const normalizedBrands = Array.isArray(BrandNames)
                ? BrandNames
                : Array.isArray(BrandNames?.brands)
                    ? BrandNames.brands
                    : Array.isArray(BrandNames?.data)
                        ? BrandNames.data
                        : [];
            setBrandNames(normalizedBrands);
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