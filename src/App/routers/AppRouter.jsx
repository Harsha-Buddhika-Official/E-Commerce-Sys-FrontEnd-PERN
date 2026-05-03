import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";

function AppRouter() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<PublicRoutes />} />
    </Routes>
  );
}

export default AppRouter;