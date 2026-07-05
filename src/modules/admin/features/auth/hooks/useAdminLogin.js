import { useState } from "react";
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
  const navigate = useNavigate();

  const login = async ({ email, password }) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const adminData = await loginAdminService({ email, password });

      setState({ adminData, loading: false, error: null });

      navigate("/admin/dashboard", {
        state: {
          role:  adminData.admin?.role,
          email: adminData.admin?.email,
        },
      });
    } catch (error) {
      setState({
        adminData: null,
        loading: false,
        error: handleHookError(error, "Login failed. Please check your credentials."),
      });

      throw error;
    }
  };

  return {
    ...state,
    login,
  };
};