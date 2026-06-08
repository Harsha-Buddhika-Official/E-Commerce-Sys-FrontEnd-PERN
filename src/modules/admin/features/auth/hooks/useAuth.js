import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenExpiryTime, getRoleFromToken } from "../utils/token.utils";
import { isAuthenticated } from "../service/auth.service";
const TOKEN_KEY = "admin_token";

export const useAutoLogout = () => {
    const navigate = useNavigate();
    useEffect(() => {

        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return;
        const expiryTime = getTokenExpiryTime(token);
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

const ROLE_HIERARCHY = ["manager", "admin", "super_admin"];

export const useAuth = () => {
    const role          = getRoleFromToken();
    const authenticated = isAuthenticated();

    const hasRole = (...allowedRoles) => {
        if (!role) return false;
        return allowedRoles.includes(role);
    };

    const hasMinRole = (minRole) => {
        if (!role) return false;
        return ROLE_HIERARCHY.indexOf(role) >= ROLE_HIERARCHY.indexOf(minRole);
    };

    return {
        role,
        authenticated,
        hasRole,
        hasMinRole,
        isSuperAdmin: role === "super_admin",
        isAdmin:      role === "admin" || role === "super_admin",
        isManager:    role === "manager" || role === "admin" || role === "super_admin",
    };
};