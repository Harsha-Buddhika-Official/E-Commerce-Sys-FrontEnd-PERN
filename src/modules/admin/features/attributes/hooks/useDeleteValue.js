import { useState } from "react";
import { deleteValueService } from "../service/deleteValue.service";

export const useDeleteValue = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const deleteValue = async (attributeId, attributeValueId) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const deletedValue = await deleteValueService(attributeId, attributeValueId);
            setSuccess(true);
            return deletedValue;
        } catch (err) {
            const message = err?.message || "Failed to delete attribute value.";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, success, deleteValue };
};
