import { useState, useEffect, useRef, useCallback } from "react";
import { getOrderDetail } from "../service/order.service.js";

export const useOrderDetail = (orderId) => {
  const mounted = useRef(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!orderId) {
      if (mounted.current) {
        setOrder(null);
        setLoading(false);
      }
      return null;
    }

    if (mounted.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await getOrderDetail(orderId);
      if (mounted.current) setOrder(data);
      return data;
    } catch (err) {
      // preserve structured service errors (do not convert to plain Error here)
      if (mounted.current) setError(err);
      throw err;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        await load();
      } catch (e) {
        // intentionally ignore load errors here; they are reflected in state
        void e;
      }
    })();
    return () => {
      mounted.current = false;
    };
  }, [load]);

  const refresh = useCallback(async () => {
    if (!orderId) return null;
    return load();
  }, [orderId, load]);

  return { order, loading, error, refresh };
};
