import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../modules/admin/components/Navbar.jsx";
import Sidebar from "../../modules/admin/components/Sidebar.jsx";
import { getAdminNotifications } from "../../modules/admin/features/notifications/api/notificationsService.js";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  orders: "Orders",
  products: "Products",
};

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadNotifications = async () => {
      try {
        const data = await getAdminNotifications();
        if (mounted) {
          setNotifications(data);
        }
      } catch (error) {
        if (mounted) {
          setNotifications([]);
        }
      }
    };

    loadNotifications();

    return () => {
      mounted = false;
    };
  }, []);

  const title = useMemo(() => {
    const segment = location.pathname.split("/").filter(Boolean).at(-1);
    return PAGE_TITLES[segment] || "Dashboard";
  }, [location.pathname]);

  const activeItem = useMemo(() => {
    const segment = location.pathname.split("/").filter(Boolean).at(-1);
    return segment || "dashboard";
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f5f5f5]">
      <Navbar
        title={title}
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        notifications={notifications}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar
          activeItem={activeItem}
          onNavigate={() => {}}
          onLogout={() => console.log("Logout")}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          adminName="Super Admin"
          adminEmail="admin@example.com"
        />

        <div className="flex-1 min-w-0 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
