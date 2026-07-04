import { useState, useCallback } from "react";
import { deleteAdmin as deleteAdminService } from "../service/admin.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useDeleteAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteAdmin = useCallback(async (id) => {
    if (!id) {
      const hookError = handleHookError(
        new Error("ID is required"),
        "ID is required"
      );
      setError(hookError);
      throw hookError;
    }

    setLoading(true);
    setError(null);

    try {
      return await deleteAdminService(id);

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

  return {
    deleteAdmin,
    loading,
    error,
    reset,
  };
};