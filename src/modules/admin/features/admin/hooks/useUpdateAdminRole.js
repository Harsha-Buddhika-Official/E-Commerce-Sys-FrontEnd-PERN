import { useState, useCallback } from "react";
import { updateAdminRole } from "../service/admin.service.js";

export const useUpdateAdminRole = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const updateRole = useCallback(async (adminId, newRole) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const updatedAdmin = await updateAdminRole(adminId, newRole);
            setSuccess(true);
            return updatedAdmin;
        } catch (err) {
            const message = err?.message || "Failed to update admin role";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setError(null);
        setSuccess(false);
    }, []);

    return {loading,error,success,updateRole,reset,};
};