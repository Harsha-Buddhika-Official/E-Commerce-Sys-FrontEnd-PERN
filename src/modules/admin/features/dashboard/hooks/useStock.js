import { useEffect, useState } from "react";
import { fetchLowAlertData } from "../services/stockData.service";

export const useStock = () => {
    const [lowStockItems, setLowStockItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadLowStockItems = async () => {
            try {
                const data = await fetchLowAlertData();

                if (!isMounted) return;

                let items = [];

                if (Array.isArray(data)) {
                    items = data;
                } else if (Array.isArray(data?.items)) {
                    items = data.items;
                } else if (Array.isArray(data?.data)) {
                    items = data.data;
                }

                setLowStockItems(items);
            } catch (fetchError) {
                if (isMounted) {
                    setError(`Failed to load low stock alerts. ${fetchError.message}`);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadLowStockItems();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        lowStockItems,
        loading,
        error,
    };
};