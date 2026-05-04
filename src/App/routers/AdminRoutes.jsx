import { Routes, Route } from "react-router-dom";
import Login from "../..../../modules/admin/pages/Login.jsx
import Dashboard from "../../modules/admin/pages/Dashboard.jsx";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
