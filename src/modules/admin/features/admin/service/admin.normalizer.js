import { safeNumber, safeText, safeDate, normalizePassword, normalizeRole, normalizeBoolean, } from "../../../../../utils/normalizers.js";


// ==================== CREATE ADMIN ====================

export const normalizeCreateAdmin = (data = {}) => ({
  fullname: safeText(data.fullName || data.fullname) || "",
  email: safeText(data.email) || "",
  password: normalizePassword(data.password) || "",
  role: normalizeRole(data.role) || "manager",
});


// ==================== ADMIN ENTITY ====================

export const normalizeAdmin = (admin = {}) => ({
  admin_id: safeNumber(admin.admin_id),
  name: safeText(admin.full_name || admin.name) || "",
  username:
    safeText(admin.username) ||
    (admin.email ? admin.email.split("@")[0] : ""),
  email: safeText(admin.email) || "",
  role: (normalizeRole(admin.role) || "manager").toUpperCase(),
  is_active: normalizeBoolean(admin.is_active),
  last_login: safeDate(admin.last_login),
  created_at: safeDate(admin.created_at),
  updated_at: safeDate(admin.updated_at),
});


// ==================== LIST ====================

export const normalizeAdminList = (admins = []) =>
  Array.isArray(admins)
    ? admins.filter(Boolean).map(normalizeAdmin)
    : [];


// ==================== PASSWORD ====================

export const normalizePasswordPayload = (data = {}) => ({
  oldPassword: normalizePassword(data.oldPassword),
  newPassword: normalizePassword(data.newPassword),
  confirmPassword: normalizePassword(data.confirmPassword),
});


// ==================== ROLE ====================

export const normalizeAdminRole = (role) =>
  normalizeRole(role);


// ==================== EMAIL ====================

export const normalizeAdminEmail = (email) =>
  safeText(email);