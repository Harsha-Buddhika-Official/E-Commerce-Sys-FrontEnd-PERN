import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import { useRole } from "../../App/hooks/useRole.js";

import Login from "../../modules/admin/pages/admin/AdminLoginPage.jsx";
import Dashboard from "../../modules/admin/pages/admin/AdminDashboardPage.jsx";

import Orders from "../../modules/admin/pages/order/OrdersPage.jsx";
import OrderDetailPage from "../../modules/admin/pages/order/OrderDetailPage.jsx";
import OrderReceiptPage from "../../modules/admin/pages/order/OrderReceiptPage.jsx";

import Products from "../../modules/admin/pages/product/ProductsPage.jsx";
import ProductInfoPage from "../../modules/admin/pages/product/ProductInfoPage.jsx";
import AddProductBasicPage from "../../modules/admin/pages/product/AddProductBasicPage.jsx";
import EditProductPage from "../../modules/admin/pages/product/EditProductPage.jsx";

import BrandsManagement from "../../modules/admin/pages/brand/BrandPage.jsx";

import AttributesPage from "../../modules/admin/pages/attribute/AttributesPage.jsx";
import AddProductAttributes from "../../modules/admin/pages/product/AddProductAttributes.jsx";

import CategoriesPage from "../../modules/admin/pages/categories/CategoriesPage.jsx";

import BannerListPage from "../../modules/admin/pages/banners/BannerListPage.jsx";
import ViewBannerPage from "../../modules/admin/pages/banners/ViewBannerPage.jsx";

import PromotionsPage from "../../modules/admin/pages/promotion/PromotionsPage.jsx";
import PromotionDetailPage from "../../modules/admin/pages/promotion/PromotionDetailPage.jsx";

import AdminManagement from "../../modules/admin/pages/admin/AdminManagementPage.jsx";
import AdminCreatePage from "../../modules/admin/pages/admin/AdminCreatePage.jsx";

import SettingsPage from "../../modules/admin/pages/settings/SettingsPage.jsx";


// ─── Role-gated route — redirects to dashboard if role not allowed ─────────────
function RoleRoute({ element, allowed }) {
  const { can } = useRole();
  return can(allowed) ? element : <Navigate to="/admin/dashboard" replace />;
}


export default function AdminRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>

          {/* ── All roles ── */}
          <Route path="dashboard"  element={<Dashboard />} />

          <Route path="orders"     element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="orders/:id/receipt" element={<OrderReceiptPage />} />

          <Route path="products"                   element={<Products />} />
          <Route path="products/:id"               element={<ProductInfoPage />} />

          {/* Add / Edit — admin + super_admin only */}
          <Route path="products/add"
            element={<RoleRoute allowed={["admin", "super_admin"]} element={<AddProductBasicPage />} />}
          />
          <Route path="products/add/attributes"
            element={<RoleRoute allowed={["admin", "super_admin"]} element={<AddProductAttributes />} />}
          />
          <Route path="products/:id/edit"
            element={<RoleRoute allowed={["admin", "super_admin"]} element={<EditProductPage product={location.state?.product} />} />}
          />

          {/* ── admin + super_admin only pages ── */}
          <Route path="brands"
            element={<RoleRoute allowed={["admin", "super_admin"]} element={<BrandsManagement />} />}
          />
          <Route path="attributes"
            element={<RoleRoute allowed={["admin", "super_admin"]} element={<AttributesPage />} />}
          />
          <Route path="categories"
            element={<RoleRoute allowed={["admin", "super_admin"]} element={<CategoriesPage />} />}
          />

          {/* ── super_admin only pages ── */}
          <Route path="admin"
            element={<RoleRoute allowed={["super_admin"]} element={<AdminManagement />} />}
          />
          <Route path="admin/create"
            element={<RoleRoute allowed={["super_admin"]} element={<AdminCreatePage />} />}
          />

          {/* ── All roles ── */}
          <Route path="promotions"    element={<PromotionsPage />} />
          <Route path="promotions/:id" element={<PromotionDetailPage />} />

          <Route path="banners"          element={<BannerListPage />} />
          <Route path="banners/view/:id" element={<ViewBannerPage />} />

          <Route path="settings" element={<SettingsPage />} />

        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}