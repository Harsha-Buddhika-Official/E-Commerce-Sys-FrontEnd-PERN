import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../service/auth.service";

const INITIAL_STATE = {
    loading: false,
    error: null,
};

export const useAdminLogin = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const navigate = useNavigate();

    const login = async ({ email, password }) => {
        setState({ loading: true, error: null });

        try {
            await loginAdmin({ email, password });
            navigate("/admin/dashboard");
        } catch (err) {
            setState({
                loading: false,
                error: err.message ?? "Login failed. Please check your credentials.",
            });
        }
    };

    return { ...state, login };
};
