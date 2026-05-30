import { createAdmin as createAdminAPI, deleteAdminByEmail, getAllAdmins, updatePassword } from "../api/admin.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";

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
    throw handleServiceError(error, "Failed to create admin", {
      service: "admin",
      operation: "createNewAdmin",
    });
  }
};

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
    throw handleServiceError(error, "Failed to delete admin", {
      service: "admin",
      operation: "deleteAdmin",
    });
  }
};

export const fetchAllAdmins = async () => {
  try {
    const admins = await getAllAdmins();

    if (!admins || !Array.isArray(admins)) {
      throw new Error("Invalid response structure from API");
    }

    // Normalize backend admin shape to frontend-friendly fields
    const normalize = (a) => ({
      admin_id: typeof a.admin_id === "number" ? a.admin_id : Number(a.admin_id) || null,
      name: a.full_name || a.name || "",
      username: a.username || (a.email ? a.email.split("@")[0] : ""),
      email: a.email || "",
      role: (a.role).toUpperCase(),
      is_active: Boolean(a.is_active),
      last_login: a.last_login || null,
      created_at: a.created_at || null,
      updated_at: a.updated_at || null,
    });

    return admins.map((it) => normalize(it));
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch admins", {
      service: "admin",
      operation: "fetchAllAdmins",
    });
  }
};

/**
 * Update admin password
 * @param {number} adminId
 * @param {Object} passwordData
 * @returns {Promise<Object>}
 */
export const updateAdminPassword = async (adminId, passwordData) => {
  try {
    return await updatePassword(adminId, passwordData);
  } catch (error) {
    throw handleServiceError(error, "Failed to update password", {
      service: "admin",
      operation: "updateAdminPassword",
    });
  }
};
