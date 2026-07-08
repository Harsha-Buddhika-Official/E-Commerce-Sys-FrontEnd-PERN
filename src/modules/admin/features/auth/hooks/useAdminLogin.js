import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdminService } from "../service/auth.service";
import { handleHookError } from "../../../../../utils/handleHookError.js";

const INITIAL_STATE = {
  adminData: null,
  loading: false,
  error: null,
};

export const useAdminLogin = () => {
  const [state, setState] = useState(INITIAL_STATE);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (lockoutSeconds <= 0) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setLockoutSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [lockoutSeconds]);

  const login = async ({ email, password }) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const adminData = await loginAdminService({ email, password });
      setState({ adminData, loading: false, error: null });
      navigate("/admin/dashboard", {
        state: { role: adminData.admin?.role, email: adminData.admin?.email },
      });
    } catch (error) {
      const hookError = handleHookError(error, "Login failed. Please check your credentials.");

      if (hookError.status === 429 && hookError.body?.retryAfter) {
        setLockoutSeconds(hookError.body.retryAfter);
      }

      setState({ adminData: null, loading: false, error: hookError });
      throw error;
    }
  };

  return {
    ...state,
    login,
    lockoutSeconds,
  };
};