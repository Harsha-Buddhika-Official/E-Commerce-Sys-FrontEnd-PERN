import { Routes, Route } from "react-router-dom";
import AdminLogin from "../../modules/admin/pages/AdminLogin.jsx";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
    </Routes>
  );
}
