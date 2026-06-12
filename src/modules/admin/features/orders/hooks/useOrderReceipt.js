import { useState, useCallback } from "react";
import { getOrderReceiptService } from "../service/order.service";

export const useOrderReceipt = () => {
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const fetchReceipt = useCallback(async (orderId) => {
        if (!orderId) return;
        try {
            setLoading(true);
            setError(null);
            const data = await getOrderReceiptService(orderId);
            setReceipt(data);
        } catch (err) {
            setError(err.message || "Failed to fetch receipt");
            setReceipt(null);
        } finally {
            setLoading(false);
        }
    }, []);

    return { receipt, loading, error, fetchReceipt };
};