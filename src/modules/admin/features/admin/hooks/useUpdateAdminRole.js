import { useState } from "react";
import { updateAdminRole as updateAdminRoleAPI } from "../api/admin.api";

/**
 * Hook to update an admin's role
 * @returns {Object} { loading, error, success, updateRole }
 */
export const useUpdateAdminRole = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const updateRole = async (adminId, newRole) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const updatedAdmin = await updateAdminRoleAPI(adminId, newRole);
            setSuccess(true);
            return updatedAdmin;
        } catch (err) {
            const message = err.message || "Failed to update admin role";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, success, updateRole };
};
