import { useState, useEffect, useCallback } from "react";
import { fetchAllAdmins } from "../service/admin.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

const INITIAL_ADMINS = [];

export const useGetAdmins = () => {
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAllAdmins();
      setAdmins(data);
    } catch (err) {
      const hookError = handleHookError(err, "Failed to fetch admins");
      setError(hookError);
      setAdmins(INITIAL_ADMINS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  return {admins,loading,error,refresh: fetchAdmins,};
};