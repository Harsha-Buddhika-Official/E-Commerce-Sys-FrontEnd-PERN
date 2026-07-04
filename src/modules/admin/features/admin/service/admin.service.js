import { createAdmin as createAdminAPI, deleteAdminById, getAllAdmins, updatePassword, updateAdminRole as updateAdminRoleAPI, } from "../api/admin.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";
import { extractArrayPayload, extractObjectPayload, } from "../../../../../utils/payloadExtractors.js";
import { normalizeCreateAdmin, normalizeAdminList, normalizePasswordPayload, normalizeAdminRole, normalizeAdminId, } from "./admin.normalizer.js";


// ==================== CREATE ADMIN ====================

export const createNewAdmin = async (payload) => {
  try {
    const data = normalizeCreateAdmin(payload);

    if (!data.fullname || !data.email || !data.password) {
      throw new Error("Full name, email, and password are required");
    }

    const response = await createAdminAPI(data);
    return extractObjectPayload(response);
  } catch (error) {
    throw handleServiceError(error, "Failed to create admin", {
      service: "admin",
      operation: "createNewAdmin",
    });
  }
};


// ==================== GET ALL ADMINS ====================

export const fetchAllAdmins = async () => {
  try {
    const response = await getAllAdmins();
    const data = extractArrayPayload(response);

    return normalizeAdminList(data);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch admins", {
      service: "admin",
      operation: "fetchAllAdmins",
    });
  }
};


// ==================== UPDATE PASSWORD ====================

export const updateAdminPassword = async (adminId, passwordData) => {
  try {
    if (!adminId) throw new Error("Admin ID is required");

    const data = normalizePasswordPayload(passwordData);

    if (!data.oldPassword || !data.newPassword || !data.confirmPassword) {
      throw new Error("All password fields are required");
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const response = await updatePassword(adminId, data);
    return extractObjectPayload(response);
  } catch (error) {
    throw handleServiceError(error, "Failed to update password", {
      service: "admin",
      operation: "updateAdminPassword",
    });
  }
};


// ==================== DELETE ADMIN ====================

export const deleteAdmin = async (id) => {
  try {
    const normalizedId = normalizeAdminId(id);

    if (!normalizedId) {
      throw new Error("ID is required to delete an admin");
    }

    const response = await deleteAdminById(normalizedId);
    return extractObjectPayload(response);
  } catch (error) {
    throw handleServiceError(error, "Failed to delete admin", {
      service: "admin",
      operation: "deleteAdmin",
    });
  }
};


// ==================== UPDATE ROLE ====================

export const updateAdminRole = async (adminId, newRole) => {
  try {
    if (!adminId) throw new Error("Admin ID is required");

    const role = normalizeAdminRole(newRole);

    if (!role) throw new Error("Invalid role provided");

    const response = await updateAdminRoleAPI(adminId, role);
    return extractObjectPayload(response);
  } catch (error) {
    throw handleServiceError(error, "Failed to update admin role", {
      service: "admin",
      operation: "updateAdminRole",
    });
  }
};