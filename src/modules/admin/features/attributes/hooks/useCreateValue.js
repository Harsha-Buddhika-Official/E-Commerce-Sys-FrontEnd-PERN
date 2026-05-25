import { createAttributeValueService } from "../service/createValue.service";
import { useState } from "react";

export const useCreateValue = () => {
    const [createdValue, setCreatedValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createValue = async (attributeId, valueData) => {
        setLoading(true);
        setError(null);

        try {
            const newValue = await createAttributeValueService(attributeId, valueData);
            setCreatedValue(newValue);
            return newValue;
        } catch (err) {
            setError(err?.message || "Failed to create attribute value.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createValue, loading, error, createdValue };
};