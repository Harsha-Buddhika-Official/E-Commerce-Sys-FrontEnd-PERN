import { deleteAdminByEmail } from "../api/admin.api";
import { handleApiError } from "../../../../../utils/apiError";

/**
 * Delete an admin account by email
 * @param {string} email - Admin email to delete
 * @returns {Object} Deleted admin record
 */
export const deleteAdmin = async (email) => {
    try {
        if (!email || !email.trim()) {
            throw new Error("Email is required to delete an admin");
        }

        const result = await deleteAdminByEmail(email);

        if (!result || typeof result !== "object") {
            throw new Error("Invalid response structure from API");
        }

        return result;
    } catch (error) {
        throw handleApiError(error, "Failed to delete admin");
    }
};
