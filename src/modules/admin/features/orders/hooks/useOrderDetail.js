import { useState, useEffect } from "react";
import { getOrderDetail } from "../service/orderDetail.service";

export const useOrderDetail = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!orderId) {
        if (active) {
          setOrder(null);
          setLoading(false);
        }
        return;
      }

      if (active) {
        setLoading(true);
        setError(null);
      }

      try {
        const data = await getOrderDetail(orderId);
        if (active) setOrder(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [orderId]);

  const refresh = async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);

    try {
      const data = await getOrderDetail(orderId);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { order, loading, error, refresh };
};
