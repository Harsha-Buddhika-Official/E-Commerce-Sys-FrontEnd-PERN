import { Routes, Route } from "react-router-dom";
import Login from "../../modules/admin/pages/Login.jsx";
import Dashboard from "../../modules/admin/pages/Dashboard.jsx";
import Orders from "../../modules/admin/pages/Orders.jsx";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  );
}
