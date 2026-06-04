import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdminService } from "../service/auth.service";

const INITIAL_STATE = {
    adminData: null,
    loading: false,
    error: null,
};

export const useAdminLogin = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const navigate = useNavigate();

    const login = async ({ email, password }) => {
        setState((prev) => ({
            ...prev,
            loading: true,
            error: null,
        }));

        try {
            const adminData = await loginAdminService({email,password,});

            setState({adminData,loading: false,error: null,});

            navigate("/admin/dashboard", {
                state: {
                    role: adminData.admin?.role,
                    email: adminData.admin?.email,
                },
            });
        } catch (error) {
            setState({
                adminData: null,
                loading: false,
                error:error.message ||"Login failed. Please check your credentials.",
            });
        }
    };

    return {
        ...state,
        login,
    };
};