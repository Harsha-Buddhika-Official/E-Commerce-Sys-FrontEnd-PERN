import { useEffect, useState } from "react";
import { fetchLowAlertData } from "../services/dashboard.service.js";

export const useStock = () => {
    const [lowStockItems, setLowStockItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedData = await fetchLowAlertData();
                setLowStockItems(fetchedData);
            } catch (err) {
                setError(`Failed to load low stock data. ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    return { lowStockItems, loading, error };
}
