import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenExpiryTime } from "../utils/token.utils";
const TOKEN_KEY = "admin_token";

export const useAutoLogout = () => {
    const navigate = useNavigate();
    useEffect(() => {

        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) return;

        const expiryTime = getTokenExpiryTime(token);
        console.log("⏰ Token Expiry Time:", new Date(expiryTime).toLocaleString());
        const timeout = expiryTime - Date.now();

        if (timeout <= 0) {
            logout(navigate);
            return;
        }

        const timer = setTimeout(() => {
            logout(navigate);
        }, timeout);

        return () => clearTimeout(timer);
    }, [navigate]);
};

export const logout = (navigate = null) => {

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("user");

    if (navigate) {
        navigate("/admin");
    } else {
        window.location.href = "/admin";
    }
};