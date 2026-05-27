import { updatePassword } from "../api/admin.api";

/**
 * Update admin password
 * @param {number} adminId - The admin ID (from URL param)
 * @param {Object} passwordData - Password fields: { oldPassword, newPassword, confirmPassword }
 * @returns {Promise<Object>} Updated admin object (password hash omitted)
 * @throws {Error} API errors (400, 401, 409, 422)
 */
export const updateAdminPassword = async (adminId, passwordData) => {
    return updatePassword(adminId, passwordData);
};