import { useState } from "react";
import EmailOutlinedIcon         from "@mui/icons-material/EmailOutlined";
import ShieldOutlinedIcon        from "@mui/icons-material/ShieldOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PersonOutlinedIcon        from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import WarningAmberOutlinedIcon  from "@mui/icons-material/WarningAmberOutlined";
import UpdateOutlinedIcon            from "@mui/icons-material/UpdateOutlined";
import AccessTimeOutlinedIcon        from "@mui/icons-material/AccessTimeOutlined";
import { useUpdateAdminRole } from "../../features/admin/hooks/useUpdateAdminRole";

// ─── Font constants ───────────────────────────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const ROLE_OPTIONS = ["super_admin", "admin", "manager"];

const ROLE_STYLES = {
  super_admin: {
    label: "Super Admin",
    badgeBg: "#fef2f2",
    badgeColor: "#dc2626",
    badgeBorder: "#fca5a5",
    badgeRadius: "9999px",
    optionBg: "#fff1f2",
    optionColor: "#be123c",
    optionBorder: "#fecdd3",
    optionRadius: "9999px",
  },
  admin: {
    label: "Admin",
    badgeBg: "#eff6ff",
    badgeColor: "#2563eb",
    badgeBorder: "#93c5fd",
    badgeRadius: "14px",
    optionBg: "#eff6ff",
    optionColor: "#1d4ed8",
    optionBorder: "#bfdbfe",
    optionRadius: "14px",
  },
  manager: {
    label: "Manager",
    badgeBg: "#ecfdf5",
    badgeColor: "#16a34a",
    badgeBorder: "#86efac",
    badgeRadius: "10px",
    optionBg: "#f0fdf4",
    optionColor: "#15803d",
    optionBorder: "#bbf7d0",
    optionRadius: "10px",
  },
};

const getRoleVisuals = (role = "admin") => ROLE_STYLES[role] || ROLE_STYLES.admin;

// ─── Format date ─────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const formatDateTime = (iso) => {
  if (!iso) return "—";
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }) + " " + date.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit", hour12: true,
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
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 shrink-0">
            <WarningAmberOutlinedIcon style={{ fontSize: 20, color: "#e53935" }} />
          </div>
          <h3 style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Remove Admin</h3>
        </div>
        <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
          Are you sure you want to remove <strong>"{admin.full_name || admin.name}"</strong>? They will lose all admin access immediately.
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
export default function AdminCard({ admin, onDelete, onRoleChange = () => {}, isSelf = false }) {
  const [showDelete, setShowDelete] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const { updateRole, loading: roleUpdating, error: roleError } = useUpdateAdminRole();
  const [localError, setLocalError] = useState(null);
  const initials    = getInitials(admin.full_name || admin.name);
  const [bg, fg]    = getAvatarColor(admin.full_name || admin.name);
  const normalizedRole = String(admin.role || "admin").toLowerCase();
  const roleVisuals = getRoleVisuals(normalizedRole);

  const handleRoleChange = async (newRole) => {
    setLocalError(null);
    
    if (newRole === normalizedRole) {
      setShowRoleDropdown(false);
      return;
    }

    try {
      const updatedAdmin = await updateRole(admin.admin_id, newRole);
      onRoleChange(updatedAdmin);
      setShowRoleDropdown(false);
    } catch (err) {
      const errorMsg = err.message || "Failed to update role";
      setLocalError(errorMsg);
      console.error("Failed to update role:", err);
      // Keep dropdown open so user can retry
    }
  };

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
            className="flex items-center justify-center rounded-2xl shrink-0"
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
                {admin.full_name || admin.name}
              </h3>
              {isSelf && (
                <span
                  className="px-2 py-0.5 rounded-full shrink-0"
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
              className="flex items-center justify-center w-8 h-8 rounded-xl cursor-pointer border-none transition-all hover:bg-red-50 shrink-0"
              style={{ backgroundColor: "#fef2f2" }}
              title="Remove admin"
            >
              <DeleteOutlineOutlinedIcon style={{ fontSize: 16, color: "#e53935" }} />
            </button>
          )}
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, backgroundColor: "#f5f5f5" }} />

        {/* ── Error message ── */}
        {(localError || roleError) && (
          <div
            className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
            style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
          >
            <WarningAmberOutlinedIcon style={{ fontSize: 14, color: "#e53935", flexShrink: 0, marginTop: 2 }} />
            <div className="flex-1">
              <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#e53935", marginBottom: 2 }}>
                Error updating role
              </p>
              <p style={{ ...INTER, fontSize: 11, color: "#e53935", lineHeight: 1.4 }}>
                {localError || roleError}
              </p>
            </div>
          </div>
        )}

        {/* ── Info rows ── */}
        <div className="flex flex-col gap-2.5">
          {/* Email */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-6 h-6 rounded-lg shrink-0"
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
              className="flex items-center justify-center w-6 h-6 rounded-lg shrink-0"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <ShieldOutlinedIcon style={{ fontSize: 13, color: "#888" }} />
            </div>
            <span
              className="px-2.5 py-0.5"
              style={{
                ...INTER, fontSize: 11, fontWeight: 700,
                backgroundColor: roleVisuals.badgeBg,
                color: roleVisuals.badgeColor,
                border: `1px solid ${roleVisuals.badgeBorder}`,
                borderRadius: roleVisuals.badgeRadius,
              }}
            >
              {roleVisuals.label}
            </span>
          </div>

          {/* Change Role Button */}
          {!isSelf && (
            <div className="flex items-center gap-2.5 relative">
              <div
                className="flex items-center justify-center w-6 h-6 rounded-lg shrink-0"
                style={{ backgroundColor: "#f5f5f5" }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: "#888" }}>⚙</span>
              </div>
              <button
                onClick={() => {
                  if (!roleUpdating) {
                    setShowRoleDropdown((p) => !p);
                    setLocalError(null);
                  }
                }}
                disabled={roleUpdating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 border border-gray-200 flex-1"
                style={{
                  ...INTER, fontSize: 11, fontWeight: 600,
                  color: "#555", background: "#f9f9f9", outline: "none",
                }}
              >
                {roleUpdating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Updating…</span>
                  </>
                ) : (
                  <span>Change Role</span>
                )}
              </button>

              {/* Role dropdown menu */}
              {showRoleDropdown && !roleUpdating && (
                <div
                  className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
                  style={{ minWidth: 160, right: "auto" }}
                >
                  <div style={{ padding: "8px 0", backgroundColor: "#f9f9f9", borderBottom: "1px solid #f0f0f0" }}>
                    <p style={{ ...INTER, fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", paddingLeft: "12px", paddingRight: "12px", letterSpacing: "0.05em" }}>
                      Select new role
                    </p>
                  </div>
                  {ROLE_OPTIONS.map((role) => {
                    const isSelected = role === normalizedRole;
                    const optionVisuals = getRoleVisuals(role);
                    return (
                      <button
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        disabled={roleUpdating}
                        className="w-full flex items-center gap-2 px-3 py-3 text-left transition-all hover:bg-blue-50 disabled:opacity-50"
                        style={{
                          borderBottom: role !== ROLE_OPTIONS[ROLE_OPTIONS.length - 1] ? "1px solid #f0f0f0" : "none",
                          backgroundColor: isSelected ? optionVisuals.optionBg : "transparent",
                        }}
                      >
                        <div
                          className="w-2.5 h-2.5 shrink-0"
                          style={{
                            backgroundColor: optionVisuals.optionColor,
                            borderRadius: optionVisuals.optionRadius,
                            border: `1px solid ${optionVisuals.optionBorder}`,
                          }}
                        />
                        <div className="flex-1">
                          <span
                            style={{
                              ...INTER, fontSize: 12, fontWeight: 600,
                              color: isSelected ? optionVisuals.optionColor : "#555",
                            }}
                          >
                            {optionVisuals.label}
                          </span>
                        </div>
                        {isSelected && (
                          <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: optionVisuals.optionColor }}>
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Created At */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-6 h-6 rounded-lg shrink-0"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <CalendarTodayOutlinedIcon style={{ fontSize: 12, color: "#888" }} />
            </div>
            <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}>
              Joined {formatDate(admin.created_at)}
            </span>
          </div>

          {/* Last Login */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-6 h-6 rounded-lg shrink-0"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <AccessTimeOutlinedIcon style={{ fontSize: 12, color: "#888" }} />
            </div>
            <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}>
              Last login {admin.last_login ? formatDateTime(admin.last_login) : "Never"}
            </span>
          </div>

          {/* Updated At */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-6 h-6 rounded-lg shrink-0"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <UpdateOutlinedIcon style={{ fontSize: 12, color: "#888" }} />
            </div>
            <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}>
              Updated {formatDateTime(admin.updated_at)}
            </span>
          </div>
        </div>

        {/* ── Status pill ── */}
        <div
          className="flex items-center justify-center px-3 py-2.5 rounded-xl mt-auto"
          style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
        >
          <span style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#888" }}>
            Admin ID: <span style={{ fontWeight: 700, color: "#111" }}>#{admin.admin_id}</span>
          </span>
        </div>
      </div>
    </>
  );
}
