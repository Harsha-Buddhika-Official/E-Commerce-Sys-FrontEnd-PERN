import { useState } from "react";
import { createNewAdmin } from "../service/createAdmin.service";

/**
 * Hook to create a new admin
 * @returns {Object} { loading, error, success, createAdmin }
 */
export const useCreateAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const create = async (payload) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const newAdmin = await createNewAdmin(payload);
            setSuccess(true);
            return newAdmin;
        } catch (err) {
            const message = err.message || "Failed to create admin";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, success, createAdmin: create };
};
