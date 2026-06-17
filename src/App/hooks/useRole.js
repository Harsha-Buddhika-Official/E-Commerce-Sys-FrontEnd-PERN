import { getRoleFromToken } from "../../modules/admin/features/auth/utils/token.utils";

export const useRole = () => {
  const role = getRoleFromToken();
  return {
    role,
    isSuperAdmin: role === "super_admin",
    isAdmin:      role === "admin" || role === "super_admin",
    isManager:    role === "manager" || role === "admin" || role === "super_admin",
    hasRole: (allowedRoles) => allowedRoles.includes(role),
    can: (allowedRoles) => allowedRoles.includes(role),
  };
};