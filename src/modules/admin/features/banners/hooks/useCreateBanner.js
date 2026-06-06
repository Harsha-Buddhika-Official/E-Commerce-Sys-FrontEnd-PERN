import { useState } from "react";
import { createBanner } from "../services/banner.service.js";

export const useCreateBanner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      
      return await createBanner(payload);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBanner: create,
    loading,
    error,
  };
};