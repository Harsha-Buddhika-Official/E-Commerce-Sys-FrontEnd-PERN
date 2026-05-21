import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../service/auth.service";

const INITIAL_STATE = {
    AdminData: null,
    loading: false,
    error: null,
};

export const useAdminLogin = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const navigate = useNavigate();

    const login = async ({ email, password }) => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const AdminData = await loginAdmin({ email, password });
            setState((prev) => ({ ...prev, AdminData, loading: false, error: null }));
            navigate("/admin/dashboard", {
                state: {
                    role: AdminData?.admin?.role ?? "admin",
                    email: AdminData?.admin?.email ?? "admin@example.com",
                },
            });
        } catch (err) {
            setState({
                AdminData: null,
                loading: false,
                error: err.message ?? "Login failed. Please check your credentials.",
            });
        }
    };

    return { ...state, login };
};
