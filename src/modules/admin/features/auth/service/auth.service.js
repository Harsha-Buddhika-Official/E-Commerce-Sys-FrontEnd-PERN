import { getAdminLogin } from "../api/auth.api";

const TOKEN_KEY = "admin_token";

/**
 * Sends credentials to the backend and stores the returned JWT.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, admin: object }>}
 */
export const loginAdmin = async (credentials) => {
    const response = await getAdminLogin(credentials);

    const token = response?.data?.token ?? response?.data?.data?.token ?? null;

    if (!token) {
        throw new Error("Invalid response from server. Please try again.");
    }

    // Store token for subsequent authenticated requests.
    localStorage.setItem(TOKEN_KEY, token);

    return {
        token,
        admin: response?.data?.admin ?? response?.data?.data?.admin ?? null,
    };
};

/** Removes the stored token (logout). */
export const logoutAdmin = () => localStorage.removeItem(TOKEN_KEY);

/** Returns the stored JWT or null if not logged in. */
export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

/** Returns true if a token exists in storage. */
export const isAuthenticated = () => Boolean(getStoredToken());