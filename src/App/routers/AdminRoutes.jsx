import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLayout from "../components/AdminLayout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

import Login from "../../modules/admin/pages/admin/AdminLoginPage.jsx";
import Dashboard from "../../modules/admin/pages/admin/AdminDashboardPage.jsx";

import AdminManagement from "../../modules/admin/pages/admin/AdminManagementPage.jsx";
import AdminCreatePage from "../../modules/admin/pages/admin/AdminCreatePage.jsx";

import AttributesPage from "../../modules/admin/pages/attribute/AttributesPage.jsx";

import BrandsManagement from "../../modules/admin/pages/brand/BrandPage.jsx";

import Orders from "../../modules/admin/pages/order/OrdersPage.jsx";
import OrderDetailPage from "../../modules/admin/pages/order/OrderDetailPage.jsx";

import Products from "../../modules/admin/pages/product/ProductsPage.jsx";
import AddProductPage from "../../modules/admin/pages/product/AddProductPage.jsx";
import ProductInfoPage from "../../modules/admin/pages/product/ProductInfoPage.jsx";

import PromotionsPage from "../../modules/admin/pages/promotion/PromotionsPage.jsx";
import PromotionDetailPage from "../../modules/admin/pages/promotion/PromotionDetailPage.jsx";


export default function AdminRoutes() {
  const location = useLocation();

  return (
    <>
      <Routes location={location}>
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
            <Route path="admin" element={<AdminManagement />} />
            <Route path="admin/create" element={<AdminCreatePage />} />
            <Route path="promotions" element={<PromotionsPage />} />
            <Route path="promotions/:id" element={<PromotionDetailPage />} />
            <Route path="attributes" element={<AttributesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>

    </>
  );
}