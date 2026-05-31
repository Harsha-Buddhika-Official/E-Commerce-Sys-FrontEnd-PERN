import { useState } from "react";
import { changeOrderStatus } from "../service/order.service.js";

export const useChangeOrderStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const changeStatus = async (orderId, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      const data = await changeOrderStatus(orderId, newStatus);
      setLoading(false);
      return { data };
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      throw err;
    }
  };

  return { changeStatus, loading, error };
};
