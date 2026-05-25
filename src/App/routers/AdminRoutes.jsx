import { Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Login from "../../modules/admin/pages/AdminLoginPage.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import Dashboard from "../../modules/admin/pages/AdminDashboardPage.jsx";
import Orders from "../../modules/admin/pages/OrdersPage.jsx";
import OrderDetailPage from "../../modules/admin/pages/OrderDetailPage.jsx";
import Products from "../../modules/admin/pages/ProductsPage.jsx";
import AddProductPage from "../../modules/admin/pages/AddProductPage.jsx";
import ProductInfoPage from "../../modules/admin/pages/ProductInfoPage.jsx";
import BrandsManagement from "../../modules/admin/pages/BrandManagementPage.jsx";
import BrandCreatePage from "../../modules/admin/overlay/BrandCreateOverlay.jsx";
import PromotionsPage from "../../modules/admin/pages/PromotionsPage.jsx";
import PromotionDetailPage from "../../modules/admin/pages/PromotionDetailPage.jsx";
import AdminManagement from "../../modules/admin/pages/AdminManagementPage.jsx";
import AdminCreatePage from "../../modules/admin/pages/AdminCreatePage.jsx";
import AttributesPage from "../../modules/admin/pages/AttributesPage.jsx";

export default function AdminRoutes() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
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

      {backgroundLocation && (
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="brands/create" element={<BrandCreatePage />} />
          </Route>
        </Routes>
      )}
    </>
  );
}