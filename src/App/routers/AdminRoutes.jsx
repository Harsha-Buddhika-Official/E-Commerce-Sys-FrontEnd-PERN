import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Login from "../../modules/admin/pages/Login.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import Dashboard from "../../modules/admin/pages/Dashboard.jsx";
import Orders from "../../modules/admin/pages/Orders.jsx";
import Products from "../../modules/admin/pages/Products.jsx";

// routes/AdminRoutes.jsx
// Public route  → /admin         (Login page)
// Protected routes → /admin/dashboard, /admin/orders, etc.
// Anyone hitting a protected route without a token is sent back to /admin.
// After login, useAdminLogin hook navigates to /admin/dashboard automatically.

export default function AdminRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders"    element={<Orders />} />
          <Route path="/products"  element={<Products />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />

    </Routes>
  );
}