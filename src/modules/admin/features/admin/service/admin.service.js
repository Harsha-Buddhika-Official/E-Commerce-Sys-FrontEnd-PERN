import {
  createAdmin as createAdminAPI,
  deleteAdminByEmail,
  getAllAdmins,
  updatePassword,
  updateAdminRole as updateAdminRoleAPI,
} from "../api/admin.api";

import { handleServiceError } from "../../../../../utils/serviceError.js";

import {
  safeNumber,
  safeText,
  safeDate,
  normalizePassword,
  normalizeRole,
  normalizeBoolean,
} from "../../../../../utils/normalizers.js";

  //  CREATE ADMIN
export const createNewAdmin = async (payload) => {
  try {
    if (!payload || typeof payload !== "object") {
      throw new Error("Admin payload is required");
    }

    const normalized = {
      fullname:
        safeText(payload.fullName) ||
        safeText(payload.fullname) ||
        "",

      email:
        safeText(payload.email) ||
        "",

      password:
        normalizePassword(payload.password) ||
        "",

      role:
        normalizeRole(payload.role) ||
        "manager",
    };

    if (!normalized.fullname) {
      throw new Error("Full name is required");
    }

    if (!normalized.email) {
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


  //  DELETE ADMIN
export const deleteAdmin = async (email) => {
  try {
    const normalizedEmail = safeText(email);

    if (!normalizedEmail) {
      throw new Error("Email is required to delete an admin");
    }

    const result = await deleteAdminByEmail(normalizedEmail);

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


  //  FETCH ALL ADMINS
export const fetchAllAdmins = async () => {
  try {
    const admins = await getAllAdmins();

    if (!admins || !Array.isArray(admins)) {
      throw new Error("Invalid response structure from API");
    }

    const normalizeAdmin = (a = {}) => ({
      admin_id: safeNumber(a.admin_id),

      name:
        safeText(a.full_name) ||
        safeText(a.name) ||
        "",

      username:
        safeText(a.username) ||
        (safeText(a.email)
          ? a.email.split("@")[0]
          : ""),

      email:
        safeText(a.email) ||
        "",

      role:
        (normalizeRole(a.role) || "manager").toUpperCase(),

      is_active:
        normalizeBoolean(a.is_active),

      last_login:
        safeDate(a.last_login),

      created_at:
        safeDate(a.created_at),

      updated_at:
        safeDate(a.updated_at),
    });

    return admins.map(normalizeAdmin);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch admins", {
      service: "admin",
      operation: "fetchAllAdmins",
    });
  }
};


  //  UPDATE PASSWORD
export const updateAdminPassword = async (adminId, passwordData) => {
  try {
    if (adminId == null) {
      throw new Error("Admin ID is required");
    }

    if (!passwordData || typeof passwordData !== "object") {
      throw new Error("Password data is required");
    }

    const oldPassword = normalizePassword(passwordData.oldPassword);
    const newPassword = normalizePassword(passwordData.newPassword);
    const confirmPassword = normalizePassword(passwordData.confirmPassword);

    if (!oldPassword) {
      throw new Error("Current password is required");
    }

    if (!newPassword) {
      throw new Error("New password is required");
    }

    if (!confirmPassword) {
      throw new Error("Password confirmation is required");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const response = await updatePassword(adminId, {
      oldPassword,
      newPassword,
      confirmPassword,
    });

    if (!response || typeof response !== "object") {
      throw new Error("Invalid response structure from API");
    }

    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to update password", {
      service: "admin",
      operation: "updateAdminPassword",
    });
  }
};

//  UPDATE ROLE
export const updateAdminRole = async (adminId, newRole) => {
  try {
    if (adminId == null) {
      throw new Error("Admin ID is required");
    }
    if (!newRole) {
      throw new Error("New role is required");
    }
    const normalizedRole = normalizeRole(newRole);
    if (!normalizedRole) {
      throw new Error("Invalid role value");
    }
    const response = await updateAdminRoleAPI(adminId, normalizedRole);
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response structure from API");
    }
    return response;
  } catch (error) {
    throw handleServiceError(error, "Failed to update admin role", {
      service: "admin",
      operation: "updateAdminRole",
    });
  }
};