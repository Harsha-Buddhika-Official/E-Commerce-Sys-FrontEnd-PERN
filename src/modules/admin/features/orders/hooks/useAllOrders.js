import { useState, useEffect, useRef, useCallback } from "react";
import { getAllOrders } from "../service/order.service.js";

export const useAllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const mounted = useRef(true);

    const mapToUi = (apiOrders = []) =>
        apiOrders.map((order) => ({
            id: `#${order.orderId}`,
            product: order.productName ?? "",
            email: order.customerEmail ?? "",
            date: order.updatedAt ? formatDate(order.updatedAt) : "Unknown",
            quantity: order.quantity ?? 0,
            priceAtPurchase: order.priceAtPurchase ?? 0,
            amount: order.totalAmount ?? 0,
            status: capitalizeStatus(order.orderStatus),
            raw: order,
        }));

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const apiOrders = await getAllOrders();
            if (!mounted.current) return;
            setOrders(mapToUi(apiOrders));
        } catch (err) {
            if (!mounted.current) return;
            setError(err instanceof Error ? err : new Error(String(err) || "Failed to load orders"));
        } finally {
            if (mounted.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        mounted.current = true;
        (async () => { await load(); })();
        return () => {
            mounted.current = false;
        };
    }, [load]);

    const refresh = useCallback(() => load(), [load]);

    return { orders, loading, error, refresh };
};

function formatDate(dateInput) {
    try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return "Unknown";
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
        return "Unknown";
    }
}

function capitalizeStatus(status) {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}
