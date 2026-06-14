import { useState, useCallback } from "react";
import { createNewAdmin } from "../service/admin.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useCreateAdmin = () => {
    const [createdAdmin, setCreatedAdmin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createAdmin = useCallback(async (payload) => {
        setLoading(true);
        setError(null);

        try {
            const admin = await createNewAdmin(payload);
            setCreatedAdmin(admin);
            return admin;
        } catch (err) {
            const hookError = handleHookError(err, "Failed to create admin");
            setError(hookError);
            throw hookError;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setCreatedAdmin(null);
        setError(null);
    }, []);

    return { createdAdmin, loading, error, createAdmin, reset };
};
