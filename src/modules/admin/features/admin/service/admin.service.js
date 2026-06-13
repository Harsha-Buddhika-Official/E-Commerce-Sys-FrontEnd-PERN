import {createAdmin as createAdminAPI,deleteAdminByEmail,getAllAdmins,updatePassword,updateAdminRole as updateAdminRoleAPI,} from "../api/admin.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";
import {safeNumber,safeText,safeDate,normalizePassword,normalizeRole,normalizeBoolean,} from "../../../../../utils/normalizers.js";
import {extractArrayPayload,extractObjectPayload,} from "../../../../../utils/payloadExtractors.js";

// ---------------- CREATE ADMIN ----------------
export const createNewAdmin = async (payload) => {
  try {
    const data = extractObjectPayload(payload, "Admin payload is required");

    const normalized = {
      fullname: safeText(data.fullName) || safeText(data.fullname) || "",
      email: safeText(data.email) || "",
      password: normalizePassword(data.password) || "",
      role: normalizeRole(data.role) || "manager",
    };

    if (!normalized.fullname || !normalized.email || !normalized.password) {
      throw new Error("Full name, email, and password are required");
    }

    return await createAdminAPI(normalized);
  } catch (error) {
    throw handleServiceError(error, "Failed to create admin", {
      service: "admin",
      operation: "createNewAdmin",
    });
  }
};


// ---------------- DELETE ADMIN ----------------
export const deleteAdmin = async (email) => {
  try {
    const normalizedEmail = safeText(email);

    if (!normalizedEmail) {
      throw new Error("Email is required to delete an admin");
    }

    return await deleteAdminByEmail(normalizedEmail);
  } catch (error) {
    throw handleServiceError(error, "Failed to delete admin", {
      service: "admin",
      operation: "deleteAdmin",
    });
  }
};


// ---------------- FETCH ALL ADMINS ----------------
export const fetchAllAdmins = async () => {
  try {
    const admins = extractArrayPayload(
      await getAllAdmins(),
      "Invalid admins response"
    );

    return admins.map((a = {}) => ({
      admin_id: safeNumber(a.admin_id),
      name: safeText(a.full_name) || safeText(a.name) || "",
      username: safeText(a.username) || (a.email ? a.email.split("@")[0] : ""),
      email: safeText(a.email) || "",
      role: (normalizeRole(a.role) || "manager").toUpperCase(),
      is_active: normalizeBoolean(a.is_active),
      last_login: safeDate(a.last_login),
      created_at: safeDate(a.created_at),
      updated_at: safeDate(a.updated_at),
    }));
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch admins", {
      service: "admin",
      operation: "fetchAllAdmins",
    });
  }
};


// ---------------- UPDATE PASSWORD ----------------
export const updateAdminPassword = async (adminId, passwordData) => {
  try {
    if (!adminId) {
      throw new Error("Admin ID is required");
    }

    const data = extractObjectPayload(
      passwordData,
      "Password data is required"
    );

    const oldPassword = normalizePassword(data.oldPassword);
    const newPassword = normalizePassword(data.newPassword);
    const confirmPassword = normalizePassword(data.confirmPassword);

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new Error("All password fields are required");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    return await updatePassword(adminId, {
      oldPassword,
      newPassword,
      confirmPassword,
    });
  } catch (error) {
    throw handleServiceError(error, "Failed to update password", {
      service: "admin",
      operation: "updateAdminPassword",
    });
  }
};


// ---------------- UPDATE ROLE ----------------
export const updateAdminRole = async (adminId, newRole) => {
  try {
    if (!adminId) {
      throw new Error("Admin ID is required");
    }

    const role = normalizeRole(newRole);

    if (!role) {
      throw new Error("Invalid role provided");
    }

    return await updateAdminRoleAPI(adminId, role);
  } catch (error) {
    throw handleServiceError(error, "Failed to update admin role", {
      service: "admin",
      operation: "updateAdminRole",
    });
  }
};