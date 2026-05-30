import { useState, useEffect } from "react";
import { getAllOrders } from "../service/order.service.js";

const normalizeOrders = (apiOrders = []) =>
    apiOrders.map((order) => ({
        id: `#${order.orderId}`,
        product: order.productName,
        email: order.customerEmail,
        date: formatDate(order.updatedAt),
        quantity: order.quantity,
        priceAtPurchase: order.priceAtPurchase,
        amount: order.totalAmount,
        status: capitalizeStatus(order.orderStatus),
    }));

export const useAllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;

        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiOrders = await getAllOrders();
                if (active) {
                    setOrders(normalizeOrders(apiOrders));
                }
            } catch (error) {
                if (active) {
                    setError(
                        error instanceof Error
                            ? error
                            : new Error("Failed to load orders data")
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };
        loadData();

        return () => {
            active = false;
        };
    }, []);

    return { orders, loading, error };
};


function formatDate(dateInput) {
    try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) {
            return "Unknown";
        }
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
        return "Unknown";
    }
}

/**
 * Capitalize status string for display
 * @param {string} status - Status from API (e.g., "pending", "completed")
 * @returns {string} Capitalized status (e.g., "Pending", "Completed")
 */
function capitalizeStatus(status) {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}
