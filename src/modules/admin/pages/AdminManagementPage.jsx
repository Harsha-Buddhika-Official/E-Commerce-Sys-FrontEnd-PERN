import { useState, useMemo } from "react";
import AddOutlinedIcon           from "@mui/icons-material/AddOutlined";
import SearchOutlinedIcon        from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon         from "@mui/icons-material/CloseOutlined";
import PeopleOutlinedIcon        from "@mui/icons-material/PeopleOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SupervisorAccountOutlinedIcon  from "@mui/icons-material/SupervisorAccountOutlined";
import ManageAccountsOutlinedIcon     from "@mui/icons-material/ManageAccountsOutlined";
import FilterListOutlinedIcon         from "@mui/icons-material/FilterListOutlined";
import PersonOffOutlinedIcon          from "@mui/icons-material/PersonOffOutlined";
import AdminCard from "./AdminCard";

// ─── Font constants ───────────────────────────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ADMINS = [
  { admin_id: 1,  name: "Ashan Fernando",   username: "ashan_f",    email: "ashan@xmobile.lk",    role: "SUPER_ADMIN", is_active: true,  created_at: "2024-01-10T08:00:00Z" },
  { admin_id: 2,  name: "Kasun Perera",     username: "kasun_p",    email: "kasun@xmobile.lk",    role: "ADMIN",       is_active: true,  created_at: "2024-02-14T09:30:00Z" },
  { admin_id: 3,  name: "Dilani Silva",     username: "dilani_s",   email: "dilani@xmobile.lk",   role: "ADMIN",       is_active: true,  created_at: "2024-03-01T11:00:00Z" },
  { admin_id: 4,  name: "Ruwan Jayasena",   username: "ruwan_j",    email: "ruwan@xmobile.lk",    role: "MODERATOR",   is_active: false, created_at: "2024-04-20T10:15:00Z" },
  { admin_id: 5,  name: "Thisari Bandara",  username: "thisari_b",  email: "thisari@xmobile.lk",  role: "MODERATOR",   is_active: true,  created_at: "2024-05-05T14:00:00Z" },
  { admin_id: 6,  name: "Malith Gamage",    username: "malith_g",   email: "malith@xmobile.lk",   role: "ADMIN",       is_active: true,  created_at: "2024-06-18T08:45:00Z" },
  { admin_id: 7,  name: "Sachini Wijesiri", username: "sachini_w",  email: "sachini@xmobile.lk",  role: "MODERATOR",   is_active: false, created_at: "2024-07-22T13:20:00Z" },
  { admin_id: 8,  name: "Nuwan Rathnayake", username: "nuwan_r",    email: "nuwan@xmobile.lk",    role: "ADMIN",       is_active: true,  created_at: "2024-08-30T09:00:00Z" },
];

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, bg, color }) {
  return (
    <div
      className="bg-white rounded-2xl p-5 flex items-center gap-4"
      style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      <div
        className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0"
        style={{ backgroundColor: bg }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
        <p style={{ ...SORA, fontSize: 22, fontWeight: 900, color: "#111" }}>{value}</p>
      </div>
    </div>
  );
}

// ─── Filter chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer"
      style={{
        ...INTER,
        fontSize: 12,
        fontWeight: 700,
        backgroundColor: active ? "#111" : "#fff",
        color: active ? "#fff" : "#555",
        borderColor: active ? "#111" : "#e5e5e5",
      }}
    >
      {label}
      <span
        className="flex items-center justify-center min-w-[20px] h-5 rounded-full px-1"
        style={{ backgroundColor: active ? "rgba(255,255,255,0.2)" : "#f0f0f0", fontSize: 10, fontWeight: 800, color: active ? "#fff" : "#888" }}
      >
        {count}
      </span>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN MANAGEMENT PAGE
// ══════════════════════════════════════════════════════════════════════════════
const CURRENT_ADMIN_ID = 1; // simulate logged-in admin

export default function AdminManagementPage({ onCreateNew = () => {} }) {
  const [admins,       setAdmins]       = useState(MOCK_ADMINS);
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ── Derived stats ──────────────────────────────────────────────────────────
  const total       = admins.length;
  const superAdmins = admins.filter((a) => a.role === "SUPER_ADMIN").length;
  const adminCount  = admins.filter((a) => a.role === "ADMIN").length;
  const moderators  = admins.filter((a) => a.role === "MODERATOR").length;
  const activeCount = admins.filter((a) => a.is_active).length;

  // ── Filter counts ──────────────────────────────────────────────────────────
  const roleCounts = {
    ALL:         admins.length,
    SUPER_ADMIN: superAdmins,
    ADMIN:       adminCount,
    MODERATOR:   moderators,
  };
  const statusCounts = {
    ALL:      admins.length,
    ACTIVE:   activeCount,
    INACTIVE: admins.length - activeCount,
  };

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return admins.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.username.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q);
      const matchRole   = roleFilter   === "ALL" || a.role === roleFilter;
      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && a.is_active) ||
        (statusFilter === "INACTIVE" && !a.is_active);
      return matchSearch && matchRole && matchStatus;
    });
  }, [admins, search, roleFilter, statusFilter]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = (admin) => {
    setAdmins((prev) => prev.filter((a) => a.admin_id !== admin.admin_id));
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>System / Admins</p>
          <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Admin Management</h1>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all hover:bg-[#222] cursor-pointer"
          style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
        >
          <AddOutlinedIcon style={{ fontSize: 18 }} /> Add New Admin
        </button>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Admins"
          value={total}
          icon={<PeopleOutlinedIcon style={{ fontSize: 22 }} />}
          bg="#f5f5f5" color="#111"
        />
        <StatCard
          label="Super Admins"
          value={superAdmins}
          icon={<AdminPanelSettingsOutlinedIcon style={{ fontSize: 22 }} />}
          bg="#fef9c3" color="#a16207"
        />
        <StatCard
          label="Admins"
          value={adminCount}
          icon={<SupervisorAccountOutlinedIcon style={{ fontSize: 22 }} />}
          bg="#dbeafe" color="#1d4ed8"
        />
        <StatCard
          label="Moderators"
          value={moderators}
          icon={<ManageAccountsOutlinedIcon style={{ fontSize: 22 }} />}
          bg="#f3e8ff" color="#7e22ce"
        />
      </div>

      {/* ── Search + filters ── */}
      <div
        className="bg-white rounded-2xl p-4 mb-5 flex flex-col gap-4"
        style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
      >
        {/* Search bar */}
        <div className="relative flex items-center">
          <SearchOutlinedIcon style={{ position: "absolute", left: 14, fontSize: 18, color: "#bbb" }} />
          <input
            type="text"
            placeholder="Search by name, username or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none transition-all"
            style={{
              ...INTER,
              fontSize: 13,
              fontWeight: 600,
              color: "#111",
              backgroundColor: "#f9f9f9",
              border: "1.5px solid #ebebeb",
              borderRadius: 12,
              padding: "10px 38px",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
            onBlur={(e)  => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 flex items-center justify-center w-5 h-5 rounded-md cursor-pointer border-none bg-transparent"
              style={{ color: "#bbb" }}
            >
              <CloseOutlinedIcon style={{ fontSize: 14 }} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 mr-1">
            <FilterListOutlinedIcon style={{ fontSize: 15, color: "#bbb" }} />
            <span style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.07em" }}>Role</span>
          </div>
          {["ALL", "SUPER_ADMIN", "ADMIN", "MODERATOR"].map((r) => (
            <FilterChip
              key={r}
              label={r === "ALL" ? "All Roles" : r.replace("_", " ")}
              active={roleFilter === r}
              count={roleCounts[r]}
              onClick={() => setRoleFilter(r)}
            />
          ))}

          <div className="w-px h-5 mx-2" style={{ backgroundColor: "#e5e5e5" }} />

          <div className="flex items-center gap-1.5 mr-1">
            <span style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.07em" }}>Status</span>
          </div>
          {["ALL", "ACTIVE", "INACTIVE"].map((s) => (
            <FilterChip
              key={s}
              label={s === "ALL" ? "All Status" : s}
              active={statusFilter === s}
              count={statusCounts[s]}
              onClick={() => setStatusFilter(s)}
            />
          ))}
        </div>
      </div>

      {/* ── Results header ── */}
      <div className="flex items-center justify-between mb-4">
        <p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}>
          Showing <span style={{ color: "#111", fontWeight: 800 }}>{filtered.length}</span> of {total} admins
        </p>
        {(search || roleFilter !== "ALL" || statusFilter !== "ALL") && (
          <button
            onClick={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); }}
            className="flex items-center gap-1.5 cursor-pointer border-none bg-transparent"
            style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#e53935" }}
          >
            <CloseOutlinedIcon style={{ fontSize: 13 }} /> Clear filters
          </button>
        )}
      </div>

      {/* ── Admin grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((admin) => (
            <AdminCard
              key={admin.admin_id}
              admin={admin}
              onDelete={handleDelete}
              isSelf={admin.admin_id === CURRENT_ADMIN_ID}
            />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div
          className="bg-white rounded-2xl flex flex-col items-center justify-center py-20 gap-4"
          style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl"
            style={{ backgroundColor: "#f5f5f5" }}
          >
            <PersonOffOutlinedIcon style={{ fontSize: 32, color: "#ccc" }} />
          </div>
          <div className="text-center">
            <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>No admins found</p>
            <p style={{ ...INTER, fontSize: 13, color: "#bbb", marginTop: 4 }}>
              {search ? `No results for "${search}"` : "Try adjusting your filters"}
            </p>
          </div>
          <button
            onClick={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all"
            style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#555", backgroundColor: "#fff" }}
          >
            <CloseOutlinedIcon style={{ fontSize: 15 }} /> Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
