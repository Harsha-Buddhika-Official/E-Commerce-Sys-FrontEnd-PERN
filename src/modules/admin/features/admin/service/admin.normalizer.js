import {
  safeNumber,
  safeText,
  safeDate,
  normalizePassword,
  normalizeRole,
  normalizeBoolean,
} from "../../../../../utils/normalizers.js";

export const normalizeCreateAdmin = (data = {}) => ({
  fullname: safeText(data.fullName) || safeText(data.fullname) || "",
  email: safeText(data.email) || "",
  password: normalizePassword(data.password) || "",
  role: normalizeRole(data.role) || "manager",
});

export const normalizeAdmin = (admin = {}) => ({
  admin_id: safeNumber(admin.admin_id),
  name: safeText(admin.full_name) || safeText(admin.name) || "",
  username:
    safeText(admin.username) ||
    (safeText(admin.email) ? admin.email.split("@")[0] : ""),
  email: safeText(admin.email) || "",
  role: (normalizeRole(admin.role) || "manager").toUpperCase(),
  is_active: normalizeBoolean(admin.is_active),
  last_login: safeDate(admin.last_login),
  created_at: safeDate(admin.created_at),
  updated_at: safeDate(admin.updated_at),
});

export const normalizeAdminList = (admins = []) =>
  admins.filter(Boolean).map(normalizeAdmin);

export const normalizePasswordPayload = (data = {}) => ({
  oldPassword: normalizePassword(data.oldPassword),
  newPassword: normalizePassword(data.newPassword),
  confirmPassword: normalizePassword(data.confirmPassword),
});

export const normalizeAdminRole = (role) =>
  normalizeRole(role);

export const normalizeAdminEmail = (email) =>
  safeText(email);