import { useCallback, useState } from "react";
import { updateAdminPassword } from "../service/admin.service.js";
import { getCurrentAdminId } from "../utils/auth.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useUpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePassword = useCallback(async (passwordData) => {
    const adminId = getCurrentAdminId();

    if (!adminId) {
      const hookError = new Error(
        "Unable to identify admin. Please log in again."
      );

      setError(hookError.message);
      throw hookError;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updateAdminPassword(adminId, passwordData);
      return result;

    } catch (err) {
      const hookError = handleHookError(err, "Failed to update password");
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
    updatePassword,
    loading,
    error,
    reset,
  };
};