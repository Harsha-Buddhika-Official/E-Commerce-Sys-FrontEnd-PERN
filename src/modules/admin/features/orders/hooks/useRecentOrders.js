import { useState, useEffect } from "react";
import { getRecentOrders } from "../service/order.service";

export const useRecentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedOrders = await getRecentOrders();
                setOrders(fetchedOrders);
            } catch (err) {
                setError(err.message || "Failed to fetch recent orders");
                setOrders([]);
            } finally {
                setLoading(false);
             }
        };
        fetchOrders();
    }, []);
    return { orders, loading, error };
}