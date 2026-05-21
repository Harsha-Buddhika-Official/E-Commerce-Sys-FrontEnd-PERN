import { createAdmin as createAdminAPI } from "../api/admin.api";
import { handleApiError } from "../../../../../utils/apiError";

/**
 * Create a new admin account
 * Maps frontend form (fullName) to backend field (fullname)
 * @param {Object} payload - { fullName, email, password, role }
 * @returns {Object} Created admin record without password_hash
 */
export const createNewAdmin = async (payload) => {
    try {
        const normalized = {
            fullname: payload.fullName || payload.fullname || "",
            email: payload.email || "",
            password: payload.password || "",
            role: payload.role || "manager",
        };

        if (!normalized.fullname.trim()) {
            throw new Error("Full name is required");
        }
        if (!normalized.email.trim()) {
            throw new Error("Email is required");
        }
        if (!normalized.password) {
            throw new Error("Password is required");
        }

        const admin = await createAdminAPI(normalized);
        
        if (!admin || typeof admin !== "object") {
            throw new Error("Invalid response structure from API");
        }

        return admin;
    } catch (error) {
        throw handleApiError(error, "Failed to create admin");
    }
};
