import { useState } from "react";
import { updateAdminPassword } from "../service/updatePassword.service.js";
import { handleApiError } from "../../../../../utils/apiError.js";

/**
 * Hook to handle admin password updates
 * @returns {Object} - { saving, saved, errors, updatePassword, clearErrors }
 */
export const useUpdatePassword = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  // Extract current admin ID from JWT token
  const getAdminId = () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          return payload.adminId;
        }
      }
    } catch (e) {
      console.error("Failed to parse admin_token:", e);
    }
    return null;
  };

  const handleUpdate = async (passwordData) => {
    const adminId = getAdminId();
    if (!adminId) {
      setErrors({ general: "Unable to identify admin. Please log in again." });
      return false;
    }

    setSaving(true);
    setErrors({});

    try {
      await updateAdminPassword(adminId, passwordData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      return true;
    } catch (error) {
      const apiError = handleApiError(error, "Failed to update password");
      setErrors({ general: apiError.message || "Failed to update password" });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const clearErrors = () => setErrors({});

  return {
    saving,
    saved,
    errors,
    updatePassword: handleUpdate,
    clearErrors
  };
};
