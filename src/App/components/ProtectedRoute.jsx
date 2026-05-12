import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../modules/admin/features/auth/service/auth.service";

export default function ProtectedRoute() {
    if (!isAuthenticated()) {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
}
