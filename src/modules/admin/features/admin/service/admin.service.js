import { createAdmin as createAdminAPI, deleteAdminByEmail, getAllAdmins, updatePassword, updateAdminRole as updateAdminRoleAPI, } from "../api/admin.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";
import { extractArrayPayload } from "../../../../../utils/payloadExtractors.js";
import { ensurePayload } from "../../../../../utils/validators.js";
import { normalizeCreateAdmin, normalizeAdminList, normalizePasswordPayload, normalizeAdminRole, normalizeAdminEmail, } from "./admin.normalizer.js";

// ---------------- CREATE ADMIN ----------------
export const createNewAdmin = async (payload) => {
  try {
    const data = ensurePayload(payload, "Admin payload is required");
    const normalized = normalizeCreateAdmin(data);

    if (
      !normalized.fullname ||
      !normalized.email ||
      !normalized.password
    ) {
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

// ---------------- FETCH ALL ADMINS ----------------
export const fetchAllAdmins = async () => {
  try {
    const admins = extractArrayPayload(
      await getAllAdmins(),
      "Invalid admins response"
    );

    return normalizeAdminList(admins);
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

    const data = ensurePayload(
      passwordData,
      "Password data is required"
    );

    const normalized = normalizePasswordPayload(data);

    if (
      !normalized.oldPassword ||
      !normalized.newPassword ||
      !normalized.confirmPassword
    ) {
      throw new Error("All password fields are required");
    }

    if (
      normalized.newPassword !== normalized.confirmPassword
    ) {
      throw new Error("Passwords do not match");
    }

    return await updatePassword(adminId, normalized);
  } catch (error) {
    throw handleServiceError(error, "Failed to update password", {
      service: "admin",
      operation: "updateAdminPassword",
    });
  }
};

// ---------------- DELETE ADMIN ----------------
export const deleteAdmin = async (email) => {
  try {
    const normalizedEmail = normalizeAdminEmail(email);

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

// ---------------- UPDATE ROLE ----------------
export const updateAdminRole = async (adminId, newRole) => {
  try {
    if (!adminId) {
      throw new Error("Admin ID is required");
    }

    const role = normalizeAdminRole(newRole);

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