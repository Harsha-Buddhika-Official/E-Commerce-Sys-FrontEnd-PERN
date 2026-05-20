import { useState } from "react";
import EmailOutlinedIcon         from "@mui/icons-material/EmailOutlined";
import ShieldOutlinedIcon        from "@mui/icons-material/ShieldOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import WarningAmberOutlinedIcon  from "@mui/icons-material/WarningAmberOutlined";
import PersonOutlinedIcon        from "@mui/icons-material/PersonOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SupervisorAccountOutlinedIcon  from "@mui/icons-material/SupervisorAccountOutlined";
import ManageAccountsOutlinedIcon     from "@mui/icons-material/ManageAccountsOutlined";

// ─── Font constants ───────────────────────────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Role config ──────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  SUPER_ADMIN: {
    label: "Super Admin",
    bg: "#fef9c3", color: "#a16207", border: "#fde047",
    icon: <AdminPanelSettingsOutlinedIcon style={{ fontSize: 12 }} />,
  },
  ADMIN: {
    label: "Admin",
    bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd",
    icon: <SupervisorAccountOutlinedIcon style={{ fontSize: 12 }} />,
  },
  MODERATOR: {
    label: "Moderator",
    bg: "#f3e8ff", color: "#7e22ce", border: "#d8b4fe",
    icon: <ManageAccountsOutlinedIcon style={{ fontSize: 12 }} />,
  },
};

// ─── Format date ─────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

// ─── Avatar initials ─────────────────────────────────────────────────────────
const getInitials = (name = "") =>
  name.trim().split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

// ─── Avatar bg from name ─────────────────────────────────────────────────────
const AVATAR_COLORS = [
  ["#111", "#fff"],
  ["#1d4ed8", "#fff"],
  ["#15803d", "#fff"],
  ["#7e22ce", "#fff"],
  ["#c2410c", "#fff"],
  ["#0f766e", "#fff"],
];
const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteModal({ admin, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="bg-white rounded-2xl p-7 flex flex-col gap-4 w-full"
        style={{ maxWidth: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 flex-shrink-0">
            <WarningAmberOutlinedIcon style={{ fontSize: 20, color: "#e53935" }} />
          </div>
          <h3 style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Remove Admin</h3>
        </div>
        <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
          Are you sure you want to remove <strong>"{admin.name}"</strong>? They will lose all admin access immediately.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
            style={{ ...INTER, fontSize: 13, fontWeight: 600, background: "#fff" }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(admin)}
            className="flex-1 py-2.5 rounded-xl text-white hover:bg-red-600 transition-all cursor-pointer"
            style={{ ...INTER, fontSize: 13, fontWeight: 700, background: "#e53935", border: "none" }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN CARD
// ══════════════════════════════════════════════════════════════════════════════
export default function AdminCard({ admin, onDelete, isSelf = false }) {
  const [showDelete, setShowDelete] = useState(false);

  const roleCfg     = ROLE_CONFIG[admin.role] || ROLE_CONFIG.ADMIN;
  const initials    = getInitials(admin.name);
  const [bg, fg]    = getAvatarColor(admin.name);

  return (
    <>
      {showDelete && (
        <DeleteModal
          admin={admin}
          onConfirm={(a) => { setShowDelete(false); onDelete(a); }}
          onCancel={() => setShowDelete(false)}
        />
      )}

      <div
        className="bg-white rounded-2xl p-5 flex flex-col gap-4 transition-all"
        style={{
          border: "1px solid #ebebeb",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        {/* ── Top row: avatar + name + role badge ── */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className="flex items-center justify-center rounded-2xl flex-shrink-0"
            style={{ width: 48, height: 48, backgroundColor: bg }}
          >
            {admin.avatar_url ? (
              <img
                src={admin.avatar_url}
                alt={admin.name}
                className="w-full h-full rounded-2xl object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <span style={{ ...SORA, fontSize: 16, fontWeight: 800, color: fg }}>
                {initials}
              </span>
            )}
          </div>

          {/* Name + username */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="truncate" style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111" }}>
                {admin.name}
              </h3>
              {isSelf && (
                <span
                  className="px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ ...INTER, fontSize: 9, fontWeight: 700, backgroundColor: "#f0f0f0", color: "#888" }}
                >
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <PersonOutlinedIcon style={{ fontSize: 11, color: "#bbb" }} />
              <span className="truncate" style={{ ...INTER, fontSize: 11, fontWeight: 500, color: "#bbb" }}>
                @{admin.username}
              </span>
            </div>
          </div>

          {/* Delete button */}
          {!isSelf && (
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center justify-center w-8 h-8 rounded-xl cursor-pointer border-none transition-all hover:bg-red-50 flex-shrink-0"
              style={{ backgroundColor: "#fef2f2" }}
              title="Remove admin"
            >
              <DeleteOutlineOutlinedIcon style={{ fontSize: 16, color: "#e53935" }} />
            </button>
          )}
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, backgroundColor: "#f5f5f5" }} />

        {/* ── Info rows ── */}
        <div className="flex flex-col gap-2.5">
          {/* Email */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <EmailOutlinedIcon style={{ fontSize: 13, color: "#888" }} />
            </div>
            <span className="truncate" style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#555" }}>
              {admin.email}
            </span>
          </div>

          {/* Role */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <ShieldOutlinedIcon style={{ fontSize: 13, color: "#888" }} />
            </div>
            <span
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full"
              style={{
                ...INTER, fontSize: 11, fontWeight: 700,
                backgroundColor: roleCfg.bg, color: roleCfg.color,
                border: `1px solid ${roleCfg.border}`,
              }}
            >
              {roleCfg.icon} {roleCfg.label}
            </span>
          </div>

          {/* Joined */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <CalendarTodayOutlinedIcon style={{ fontSize: 12, color: "#888" }} />
            </div>
            <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}>
              Joined {formatDate(admin.created_at)}
            </span>
          </div>
        </div>

        {/* ── Status pill ── */}
        <div
          className="flex items-center justify-between px-3 py-2 rounded-xl mt-auto"
          style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: admin.is_active ? "#16a34a" : "#e53935" }}
            />
            <span style={{ ...INTER, fontSize: 11, fontWeight: 700, color: admin.is_active ? "#15803d" : "#dc2626" }}>
              {admin.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <span style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#ccc" }}>
            #{admin.admin_id}
          </span>
        </div>
      </div>
    </>
  );
}
