import { useCallback, useState } from "react";
import { createAttributeService } from "../service/attributes.service.js";

export const useCreateAttributes = () => {
  const [createdAttribute, setCreatedAttribute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAttribute = useCallback(async (attributeData) => {
    setLoading(true);
    setError(null);

    try {
      const attribute = await createAttributeService(attributeData);
      setCreatedAttribute(attribute);
      return attribute;
    } catch (err) {
      setError(err?.message || "Failed to create attribute");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCreatedAttribute(null);
    setError(null);
  }, []);

  return { createdAttribute, loading, error, createAttribute, reset };
};