import { useState } from "react";
import { deleteAdmin as deleteAdminService } from "../service/admin.service.js";

/**
 * Hook to delete an admin
 * @returns {Object} { loading, error, success, deleteAdmin }
 */
export const useDeleteAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const deleteAdminAccount = async (email) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const deletedAdmin = await deleteAdminService(email);
            setSuccess(true);
            return deletedAdmin;
        } catch (err) {
            const message = err.message || "Failed to delete admin";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, success, deleteAdmin: deleteAdminAccount };
};
