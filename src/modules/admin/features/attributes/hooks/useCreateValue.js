import { useCallback, useState } from "react";
import { createAttributeValueService } from "../service/attributes.service.js";

export const useCreateValue = () => {
  const [createdValue, setCreatedValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createValue = useCallback(async (attributeId, valueData) => {
    setLoading(true);
    setError(null);

    try {
      const value = await createAttributeValueService(attributeId, valueData);
      setCreatedValue(value);
      return value;
    } catch (err) {
      setError(err?.message || "Failed to create attribute value");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCreatedValue(null);
    setError(null);
  }, []);

  return {createdValue,loading,error,createValue,reset,};
};