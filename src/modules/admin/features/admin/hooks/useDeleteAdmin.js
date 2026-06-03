import { useState, useCallback } from "react";
import { deleteAdmin as deleteAdminService } from "../service/admin.service.js";

export const useDeleteAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteAdmin = useCallback(async (email) => {
    if (!email?.trim()) {
      const message = "Email is required";
      setError(message);
      throw new Error(message);
    }

    setLoading(true);
    setError(null);

    try {
      return await deleteAdminService(email);
    } catch (err) {
      setError(err?.message || "Failed to delete admin");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {loading,error,deleteAdmin,reset,};
};