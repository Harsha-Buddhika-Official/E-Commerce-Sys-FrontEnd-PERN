import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const getTokenExpiryTime = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000;
    } catch {
        return 0;
    }
};

export const getRoleFromToken = () => {
    try {
        const token = localStorage.getItem("admin_token");
        if (!token) return null;
        const decoded = jwtDecode(token);
        return decoded.role ?? decoded.admin?.role ?? null;
    } catch {
        return null;
    }
};