import { Navigate, Outlet } from "react-router-dom";
import { getRoleFromToken } from "../../modules/admin/features/auth/service/auth.service";

export default function RoleProtectedRoute({ allowedRoles }) {
  const role = getRoleFromToken();
  
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <Outlet />;
}