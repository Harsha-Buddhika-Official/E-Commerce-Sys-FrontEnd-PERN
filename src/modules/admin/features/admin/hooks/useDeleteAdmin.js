import { useState, useCallback } from "react";
import { deleteAdmin as deleteAdminService } from "../service/admin.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

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
      const hookError = handleHookError(err, "Failed to delete admin");
      setError(hookError);
      throw hookError;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {loading,error,deleteAdmin,reset,};
};