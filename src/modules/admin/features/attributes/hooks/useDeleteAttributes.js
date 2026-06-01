import { useCallback, useState } from "react";
import { deleteAttributesService } from "../service/attributes.service.js";

export const useDeleteAttributes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteAttribute = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const deleteAttribute = await deleteAttributesService(id);
      return deleteAttribute;
    } catch (err) {
      const message = err?.message || "Failed to delete attribute.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {loading,error,deleteAttribute };
};