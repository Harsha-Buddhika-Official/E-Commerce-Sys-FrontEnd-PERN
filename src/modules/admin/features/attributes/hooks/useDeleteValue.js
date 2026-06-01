import { useState,useCallback } from "react";
import { deleteValueService } from "../service/attributes.service.js";

export const useDeleteValue = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteValue = useCallback(async (attributeId, attributeValueId) => {
        setLoading(true);
        setError(null);

        try {
            const deletedValue = await deleteValueService(attributeId, attributeValueId);
            return deletedValue;
        } catch (err) {
            const message = err?.message || "Failed to delete attribute value.";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, deleteValue };
};
