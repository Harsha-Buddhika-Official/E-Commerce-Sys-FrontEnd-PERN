import { useState, useEffect, useCallback } from "react";
import { getOrderDetail } from "../service/order.service.js";

export const useOrderDetail = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState(null);

  const load = useCallback(async () => {

    if (!orderId) {
        setOrder(null);
        return;
    }

    try {
        setLoading(true);
        setError(null);
        const data = await getOrderDetail(orderId);
        setOrder(data);
    } catch (err) {
        setError(
            err?.message || "Failed to load order"
        );
    } finally {
        setLoading(false);
    }

}, [orderId]);

useEffect(() => {
    load();
}, [load]);


  return { order, loading, error, refresh: load };
};
