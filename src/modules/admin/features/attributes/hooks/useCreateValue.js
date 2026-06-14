import { useCallback, useState } from "react";
import { createAttributeValueService } from "../service/attributes.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

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
      const hookError = handleHookError(err, "Failed to create attribute value");
      setError(hookError);
      throw hookError;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCreatedValue(null);
    setError(null);
  }, []);

  return { createdValue, loading, error, createValue, reset, };
};