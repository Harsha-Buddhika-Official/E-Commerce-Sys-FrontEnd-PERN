import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";

function AppRouter() {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}

export default AppRouter;
