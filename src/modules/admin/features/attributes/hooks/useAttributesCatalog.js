import { useCallback, useEffect, useState } from "react";
import { getAttributesCatalog } from "../service/attributes.service";
import { handleHookError } from "../../../../../utils/handleHookError.js";

const INITIAL_CATALOG = {
  categories: [],
  attributes: [],
  groupedCategories: [],
  totalCategories: 0,
  totalAttributes: 0,
};

export const useAttributesCatalog = () => {
  const [catalog, setCatalog] = useState(INITIAL_CATALOG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAttributesCatalog();

      setCatalog({
        categories: data?.categories ?? [],
        attributes: data?.attributes ?? [],
        groupedCategories: data?.groupedCategories ?? [],
        totalCategories: data?.totalCategories ?? 0,
        totalAttributes: data?.totalAttributes ?? 0,
      });
    } catch (err) {
      setCatalog(INITIAL_CATALOG);
      const hookError = handleHookError(err, "Failed to fetch attributes catalog");
      setError(hookError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return {
    ...catalog,
    loading,
    error,
    refresh: fetchCatalog,
  };
};