import { loginAdmin } from "../api/auth.api";
import { isTokenExpired } from "../utils/token.utils";

const TOKEN_KEY = "admin_token";

const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const loginAdminService = async (credentials) => {
    const { token, admin } = await loginAdmin(credentials);
    if (!token) {
        throw new Error("Invalid response from server. Please try again.");
    }

    saveToken(token);
    
    return {
        token,
        admin,
    };
};

export const logoutAdmin = () => localStorage.removeItem(TOKEN_KEY);

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const isAuthenticated = () => {
    const token = getStoredToken();
    return Boolean(token) && !isTokenExpired(token);
};