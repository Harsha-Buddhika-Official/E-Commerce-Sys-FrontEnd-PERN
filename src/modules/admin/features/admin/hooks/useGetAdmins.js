import { useState, useEffect, useCallback } from "react";
import { fetchAllAdmins } from "../service/admin.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useGetAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAllAdmins();
      setAdmins(data ?? []);

    } catch (err) {
      setAdmins([]);
      setError(handleHookError(err, "Failed to fetch admins"));

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  return {
    admins,
    loading,
    error,
    refresh: fetchAdmins,
  };
};