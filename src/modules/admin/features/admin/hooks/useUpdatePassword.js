import { useCallback, useState } from "react";
import { updateAdminPassword } from "../service/admin.service.js";
import { getCurrentAdminId } from "../utils/auth.js";

export const useUpdatePassword = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const updatePassword = useCallback(async (passwordData) => {
    const adminId = getCurrentAdminId();

    if (!adminId) {
      const message = "Unable to identify admin. Please log in again.";
      setError(message);
      return false;
    }

    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await updateAdminPassword(adminId, passwordData);

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);

      return true;
    } catch (err) {
      setError(err?.message || "Failed to update password");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSaved(false);
  }, []);

  return {saving,saved,error,updatePassword,reset,};
};