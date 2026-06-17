import { useState, useCallback } from "react";
import { updateAdminRole } from "../service/admin.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useUpdateAdminRole = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRole = useCallback(async (adminId, newRole) => {
    if (!adminId || !newRole) {
      const hookError = new Error("Admin ID and role are required");
      setError(hookError.message);
      throw hookError;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedAdmin = await updateAdminRole(adminId, newRole);
      return updatedAdmin;

    } catch (err) {
      const hookError = handleHookError(err, "Failed to update admin role");
      setError(hookError);
      throw hookError;

    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    updateRole,
    loading,
    error,
    reset,
  };
};