import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Login from "../../modules/admin/pages/Login.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import Dashboard from "../../modules/admin/pages/Dashboard.jsx";
import Orders from "../../modules/admin/pages/Orders.jsx";
import OrderDetailPage from "../../modules/admin/pages/OrderDetailPage.jsx";
import Products from "../../modules/admin/pages/Products.jsx";
import AddProductPage from "../../modules/admin/pages/AddProduct.jsx";
import ProductInfoPage from "../../modules/admin/pages/ProductInfoPage.jsx";
import BrandsManagement from "../../modules/admin/pages/BrandsManagement.jsx";
import BrandCreatePage from "../../modules/admin/pages/BrandCreatePage.jsx";
import PromotionsPage from "../../modules/admin/pages/PromotionPage.jsx";
import PromotionDetailPage from "../../modules/admin/pages/PromotinDetailPage.jsx";
import AdminManagement from "../../modules/admin/pages/AdminManagement.jsx";
import AdminCreatePage from "../../modules/admin/pages/AdminCreatePage.jsx";

export default function AdminRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="products/:id" element={<ProductInfoPage />} />
          <Route path="brands" element={<BrandsManagement />} />
          <Route path="brands/create" element={<BrandCreatePage />} />
          <Route path="admin-management" element={<AdminManagement />} />
          <Route path="admin-management/admin-create" element={<AdminCreatePage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="promotions/:id" element={<PromotionDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />

    </Routes>
  );
}