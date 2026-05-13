import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Login from "../../modules/admin/pages/Login.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import Dashboard from "../../modules/admin/pages/Dashboard.jsx";
import Orders from "../../modules/admin/pages/Orders.jsx";
import Products from "../../modules/admin/pages/Products.jsx";
import AddProductPage from "../../modules/admin/pages/AddProduct.jsx";

export default function AdminRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders"    element={<Orders />} />
          <Route path="/products"  element={<Products />} />
          <Route path="/products/add" element={<AddProductPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />

    </Routes>
  );
}