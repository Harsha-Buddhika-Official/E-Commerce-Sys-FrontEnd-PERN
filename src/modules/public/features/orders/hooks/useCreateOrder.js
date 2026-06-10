import { useState } from "react";
import { createOrder } from "../services/orders.service.js";

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const create = async (payload) => {
    
    setLoading(true);
    setError(null);

    try {
      const order = await createOrder(payload);

      return order;
    } catch (err) {
      setError(err);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder: create,
    loading,
    error,
  };
};