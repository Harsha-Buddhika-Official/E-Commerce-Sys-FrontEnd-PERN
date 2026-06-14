import { useCallback, useState } from "react";
import { deleteAttributesService } from "../service/attributes.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useDeleteAttributes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteAttribute = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const deletedValue = await deleteAttributesService(id);
      return deletedValue;
    } catch (err) {
      const hookError = handleHookError(err, "Failed to delete attribute");
      setError(hookError);
      throw hookError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, deleteAttribute };
};