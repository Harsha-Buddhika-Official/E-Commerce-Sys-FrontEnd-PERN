import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardOutlinedIcon    from "@mui/icons-material/DashboardOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CategoryOutlinedIcon     from "@mui/icons-material/CategoryOutlined";
import PeopleAltOutlinedIcon    from "@mui/icons-material/PeopleAltOutlined";
import Inventory2OutlinedIcon   from "@mui/icons-material/Inventory2Outlined";
import CampaignOutlinedIcon     from "@mui/icons-material/CampaignOutlined";
import AssessmentOutlinedIcon   from "@mui/icons-material/AssessmentOutlined";
import SettingsOutlinedIcon     from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon       from "@mui/icons-material/LogoutOutlined";
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import { logout } from "../features/auth/hooks/useAuth";
import Ozone_Logo from "../../../assets/Ozone_Logo.png"

// ─── Font constants — leaf elements only ──────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Nav structure ────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    group: "MAIN",
    items: [
      { id: "dashboard",  label: "Dashboard",  icon: <DashboardOutlinedIcon    style={{ fontSize: 20 }} /> },
      { id: "orders",     label: "Orders",     icon: <ShoppingCartOutlinedIcon style={{ fontSize: 20 }} /> },
      { id: "products",   label: "Products",   icon: <CategoryOutlinedIcon     style={{ fontSize: 20 }} /> },
      { id: "customers",  label: "Customers",  icon: <PeopleAltOutlinedIcon    style={{ fontSize: 20 }} /> },
    ],
  },
  {
    group: "STORE",
    items: [
      { id: "inventory",   label: "Inventory",   icon: <Inventory2OutlinedIcon  style={{ fontSize: 20 }} /> },
      { id: "promotions",  label: "Promotions",  icon: <CampaignOutlinedIcon    style={{ fontSize: 20 }} /> },
      { id: "reports",     label: "Reports",     icon: <AssessmentOutlinedIcon  style={{ fontSize: 20 }} /> },
    ],
  },
  {
    group: "SYSTEM",
    items: [
      { id: "settings",  label: "Settings",  icon: <SettingsOutlinedIcon style={{ fontSize: 20 }} /> },
      { id: "Admin Management",  label: "Admin Management",  icon: <SupervisorAccountOutlinedIcon style={{ fontSize: 20 }} /> },

    ],
  },
];

// ─── Route mapping ────────────────────────────────────────────────────────────
const ROUTE_MAP = {
  dashboard:  "/admin/dashboard",
  orders:     "/admin/orders",
  products:   "/admin/products",
  customers:  "/admin/customers",
  inventory:  "/admin/inventory",
  promotions: "/admin/promotions",
  reports:    "/admin/reports",
  settings:   "/admin/settings",
  "Admin Management": "/admin/admin-management",
};

// ─── AdminSidebar ─────────────────────────────────────────────────────────────
// Props:
//   activeItem    — id string of the currently active nav item
//   onNavigate    — (id) => void  called when a nav item is clicked
//   adminName     — display name shown in the footer
//   adminEmail    — email shown in the footer
//   onLogout      — callback for logout
//   isOpen        — boolean, controls mobile drawer visibility
//   onClose       — called when backdrop is clicked (mobile)

const AdminSidebar = ({
  activeItem = "dashboard",
  onNavigate  = () => {},
  adminName   = "Super Admin",
  adminEmail  = "admin@example.com",
  isOpen      = true,
  onClose     = () => {},
}) => {
  const [active, setActive] = useState(activeItem);
  const navigate = useNavigate();

  useEffect(() => {
    setActive(activeItem);
  }, [activeItem]);

  const onLogout = () => {
    logout();
  };

  const handleNav = (id) => {
    setActive(id);
    const route = ROUTE_MAP[id];
    if (route) {
      navigate(route);
    }
    onNavigate(id);
  };

  return (
    <>
      {/* ── Mobile backdrop ── */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* ── Sidebar panel ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          lg:relative lg:flex lg:flex-col
          flex flex-col bg-white
          overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          width: isOpen ? 240 : 0,
          borderRight: isOpen ? "1px solid #f0f0f0" : "none",
        }}
      >

        {/* ── Logo area ── */}
        <div
          className="flex items-center gap-3 px-5 border-b border-[#f0f0f0]"
          style={{ height: 52, flexShrink: 0 }}
        >
          <img src={Ozone_Logo} alt="Ozone Logo" className="w-6 h-6" />
          <span style={{ ...SORA, fontSize: 16, fontWeight: 600, color: "#333" }}>
            Ozone Admin
          </span>
        </div>

        {/* ── Nav groups ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
          {NAV_GROUPS.map(({ group, items }) => (
            <div key={group} className="flex flex-col gap-0.5">
              {/* Group label */}
              <p
                className="text-gray-400 mb-1 px-2"
                style={{ ...INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em" }}
              >
                {group}
              </p>

              {/* Nav items */}
              {items.map(({ id, label, icon }) => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleNav(id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                      border-none cursor-pointer text-left
                      transition-all duration-150
                      ${isActive
                        ? "bg-[#1a73e8] text-white"
                        : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      }
                    `}
                  >
                    {/* Icon */}
                    <span className={isActive ? "text-white" : "text-gray-400"}>
                      {icon}
                    </span>
                    {/* Label */}
                    <span style={{ ...SORA, fontSize: 14, fontWeight: isActive ? 600 : 500 }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Logout button ── */}
        <div className="px-3 pb-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-none cursor-pointer text-left bg-transparent text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
          >
            <LogoutOutlinedIcon style={{ fontSize: 20 }} />
            <span style={{ ...SORA, fontSize: 14, fontWeight: 500 }}>Logout</span>
          </button>
        </div>

        {/* ── Admin profile footer ── */}
        <div
          className="flex items-center gap-3 px-4 py-4 border-t border-[#f0f0f0] shrink-0"
        >
          {/* Avatar — Admin initial */}
          <div className="shrink-0">
            <svg width="38" height="38" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="38" stroke="#333" strokeWidth="2" fill="#111" />
              <circle cx="40" cy="40" r="36" stroke="#888" strokeWidth="2" fill="none" />
              <path d="M 40 4 A 36 36 0 0 1 72 56" stroke="#e53935" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="40" cy="40" r="24" stroke="#555" strokeWidth="1.5" fill="#1a1a1a" />
              <text x="40" y="45" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800"
                fontFamily="'Sora','Segoe UI',sans-serif" letterSpacing="1">{adminName.charAt(0).toUpperCase()}</text>
              <path d="M 22 34 A 7 7 0 0 0 22 46" stroke="#e53935" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Name + email */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <p
              className="text-[#111] leading-tight truncate"
              style={{ ...INTER, fontSize: 13, fontWeight: 700 }}
            >
              {adminName}
            </p>
            <p
              className="text-gray-400 leading-tight truncate"
              style={{ ...INTER, fontSize: 11, fontWeight: 400 }}
            >
              {adminEmail}
            </p>
          </div>
        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;
