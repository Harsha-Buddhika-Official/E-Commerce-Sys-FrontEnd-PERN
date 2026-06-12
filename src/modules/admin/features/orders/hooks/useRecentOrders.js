import { useState, useEffect, useCallback } from "react";
import { getRecentOrders } from "../service/order.service";

export const useRecentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadRecentOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getRecentOrders();

            const formattedOrders = data.map(formatOrderForTable);

            setOrders(formattedOrders);

            return formattedOrders;
        } catch (err) {
            const message =
                err?.message || "Failed to fetch recent orders";

            setError(message);
            setOrders([]);

            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRecentOrders();
    }, [loadRecentOrders]);

    return {
        orders,
        loading,
        error,
        refresh: loadRecentOrders,
    };
};

function formatOrderForTable(order) {
    return {
        id: `#${order.id}`,
        product: order.product,
        quantity: order.quantity,
        totalAmount: order.totalAmount,
        status: formatStatus(order.status),
        raw: order,
    };
}

function formatStatus(status) {
    if (!status) {
        return "Unknown";
    }

    return status
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        )
        .join(" ");
}