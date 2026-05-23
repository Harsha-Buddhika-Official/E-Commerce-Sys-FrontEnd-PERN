import { createAttributeService } from "../service/createAttributes.service";
import { useState } from "react";

export const useCreateAttributes = () => {
    const[createdAttribute, setCreatedAttribute] = useState(null);
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState(null);

    const createAttribute = async (attributeData) => {
        setLoading(true);
        setError(null);
        try{
            const newAttribute = await createAttributeService(attributeData);
            setCreatedAttribute(newAttribute);
            return newAttribute;
        } catch (err) {
            setError(err?.message || "Failed to create attribute.");
            throw err;
        } finally {
            setLoading(false);
        }
    };
     return { createdAttribute, loading, error, createAttribute };
};