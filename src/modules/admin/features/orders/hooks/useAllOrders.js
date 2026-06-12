import { useState, useEffect, useCallback } from "react";
import { getAllOrders } from "../service/order.service.js";
import { formatDate } from "../../../../../utils/dateFormatters.js";

export const useAllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllOrders();
            console.log("Fetched orders:", data);
            const formattedOrders = data.map(formatOrderForTable);
            setOrders(formattedOrders);
            return formattedOrders;
        } catch (err) {
            const message =
                err?.message || "Failed to load orders";
            setError(message);
            throw err;
        } finally {

            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    return {orders,loading,error,refresh: loadOrders};
};

function formatOrderForTable(order) {
    return {
        id: `#${order.orderId}`,
        product: order.productName,
        email: order.customerEmail,
        quantity: order.quantity,
        priceAtPurchase: order.priceAtPurchase,
        amount: order.totalAmount,
        date: formatDate(order.updatedAt),
        status: capitalizeStatus(order.orderStatus),
        raw: order
    };
}

function capitalizeStatus(status) {
    if (!status) {
        return "Pending";
    }

    return status
        .split("_")
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        )
        .join(" ");
}