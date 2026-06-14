import { useCallback, useState } from "react";
import { deleteBrandService } from "../services/brand.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useDeleteBrand = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteBrand = useCallback(async (brandId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await deleteBrandService(brandId);
      return result;
    } catch (err) {
      const hookError = handleHookError(err, "Failed to delete brand");
      setError(hookError);
      throw hookError;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    deleteBrand,
    loading,
    error,
    reset,
  };
};