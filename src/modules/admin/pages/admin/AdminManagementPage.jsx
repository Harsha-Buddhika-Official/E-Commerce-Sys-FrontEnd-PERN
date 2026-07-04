import { useState, useMemo, useCallback } from "react";
import { useNavigate }                    from "react-router-dom";
import AddOutlinedIcon                    from "@mui/icons-material/AddOutlined";
import SearchOutlinedIcon                 from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon                  from "@mui/icons-material/CloseOutlined";
import FilterListOutlinedIcon             from "@mui/icons-material/FilterListOutlined";
import PersonOffOutlinedIcon              from "@mui/icons-material/PersonOffOutlined";
import CircularProgress                   from "@mui/material/CircularProgress";
import { useGetAdmins }                   from "../../features/admin/hooks/useGetAdmins.js";
import { useDeleteAdmin }                 from "../../features/admin/hooks/useDeleteAdmin.js";
import StatusRow                          from "../../components/admin/StatusRow.jsx";
import AdminGrid                          from "../../components/admin/AdminGrid.jsx";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

function FilterChip({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap"
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
        className="flex items-center justify-center min-w-5 h-5 rounded-full px-1"
        style={{
          backgroundColor: active ? "rgba(255,255,255,0.2)" : "#f0f0f0",
          fontSize: 10,
          fontWeight: 800,
          color: active ? "#fff" : "#888",
        }}
      >
        {count}
      </span>
    </button>
  );
}

// MOBILE — inline section label used inside the filter chip row
function FilterGroupLabel({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {icon}
      <span
        style={{
          ...INTER,
          fontSize: 11,
          fontWeight: 700,
          color: "#bbb",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function AdminManagement({ onCreateNew } = {}) {
  const { admins, loading, error, refresh } = useGetAdmins();
  const { deleteAdmin } = useDeleteAdmin();
  const navigate = useNavigate();

  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Extract current logged-in admin ID from JWT token
  const currentAdminId = (() => {
    try {
      const token = localStorage.getItem("admin_token");
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          return payload.adminId;
        }
      }
    } catch (e) {
      console.error("Failed to parse admin_token:", e);
    }
    return null;
  })();

  const total       = admins.length;
  const superAdmins = admins.filter((a) => a.role === "SUPER_ADMIN").length;
  const adminCount  = admins.filter((a) => a.role === "ADMIN").length;
  const managers    = admins.filter((a) => a.role === "MANAGER").length;
  const activeCount = admins.filter((a) => a.is_active).length;

  const handleCreateAdmin = useCallback(() => {
    if (onCreateNew) { onCreateNew(); return; }
    navigate("/admin/admin/create");
  }, [navigate, onCreateNew]);

  const roleCounts = {
    ALL: admins.length,
    SUPER_ADMIN: superAdmins,
    ADMIN: adminCount,
    MANAGER: managers,
  };
  const statusCounts = {
    ALL: admins.length,
    ACTIVE: activeCount,
    INACTIVE: admins.length - activeCount,
  };

  const filtered = useMemo(() =>
    admins.filter((a) => {
      const q           = search.toLowerCase();
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.username.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
      const matchRole   = roleFilter === "ALL" || a.role === roleFilter;
      const matchStatus = statusFilter === "ALL" || (statusFilter === "ACTIVE" && a.is_active) || (statusFilter === "INACTIVE" && !a.is_active);
      return matchSearch && matchRole && matchStatus;
    }),
  [admins, search, roleFilter, statusFilter]);

  const handleDelete = async (admin) => {
    try {
      await deleteAdmin(admin.admin_id);
      await refresh();
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  };

  const hasActiveFilters = search || roleFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-4 sm:p-5 lg:p-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-5 sm:mb-6 flex-wrap gap-3">
        <div className="min-w-0">
          <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
            System / Admins
          </p>
          <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
            Admin Management
          </h1>
        </div>
        <button
          onClick={handleCreateAdmin}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-white transition-all hover:bg-[#222] cursor-pointer shrink-0"
          style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
        >
          <AddOutlinedIcon style={{ fontSize: 18 }} />
          Add New Admin
        </button>
      </div>

      {/* ── Loading / Error / Stats row ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16 sm:py-20">
          <div className="flex flex-col items-center gap-3">
            <CircularProgress />
            <p style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#666" }}>Loading admins…</p>
          </div>
        </div>
      ) : error ? (
        <div
          className="bg-white rounded-2xl p-5 sm:p-6 mb-5"
          style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <p style={{ ...INTER, fontSize: 14, fontWeight: 800, color: "#e53935" }}>Failed to load admins</p>
          <p style={{ ...INTER, fontSize: 13, color: "#555", marginTop: 6 }}>{error.message || String(error)}</p>
          <div className="mt-4">
            <button
              onClick={() => refresh()}
              className="px-4 py-2 rounded-xl text-white cursor-pointer"
              style={{ backgroundColor: "#111", fontWeight: 700 }}
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <StatusRow total={total} superAdmins={superAdmins} admins={adminCount} managers={managers} />
      )}

      {/* ── Filter bar ── */}
      <div
        className="bg-white rounded-2xl p-4 mb-4 sm:mb-5 flex flex-col gap-4"
        style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
      >
        {/* Search input */}
        <div className="relative flex items-center">
          <SearchOutlinedIcon
            style={{ position: "absolute", left: 14, fontSize: 18, color: "#bbb", pointerEvents: "none" }}
          />
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

        {/* MOBILE FIX — Role and Status chip groups each get their own label + chips row.
            Previously a single `flex-wrap` row with a vertical separator div between them;
            when the row wrapped on narrow screens the separator floated in the middle of
            chips. Now each group is its own sub-row that wraps independently. */}
        <div className="flex flex-col gap-2.5">

          {/* Role filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <FilterGroupLabel
              icon={<FilterListOutlinedIcon style={{ fontSize: 14, color: "#bbb" }} />}
              label="Role"
            />
            {["ALL", "SUPER_ADMIN", "ADMIN", "MANAGER"].map((r) => (
              <FilterChip
                key={r}
                label={r === "ALL" ? "All Roles" : r.split("_").map((w) => w[0] + w.slice(1).toLowerCase()).join(" ")}
                active={roleFilter === r}
                count={roleCounts[r]}
                onClick={() => setRoleFilter(r)}
              />
            ))}
          </div>

          {/* Divider between groups */}
          <div className="h-px w-full" style={{ backgroundColor: "#f5f5f5" }} />

          {/* Status filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <FilterGroupLabel label="Status" />
            {["ALL", "ACTIVE", "INACTIVE"].map((s) => (
              <FilterChip
                key={s}
                label={s === "ALL" ? "All Status" : s[0] + s.slice(1).toLowerCase()}
                active={statusFilter === s}
                count={statusCounts[s]}
                onClick={() => setStatusFilter(s)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Results count + Clear ── */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}>
          Showing{" "}
          <span style={{ color: "#111", fontWeight: 800 }}>{filtered.length}</span>
          {" "}of {total} admins
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 cursor-pointer border-none bg-transparent"
            style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#e53935" }}
          >
            <CloseOutlinedIcon style={{ fontSize: 13 }} /> Clear filters
          </button>
        )}
      </div>

      {/* ── Grid or empty state ── */}
      {filtered.length > 0 ? (
        <AdminGrid
          admins={filtered}
          currentAdminId={currentAdminId}
          onDelete={handleDelete}
        />
      ) : (
        <div
          className="bg-white rounded-2xl flex flex-col items-center justify-center py-16 sm:py-20 gap-4 px-4 text-center"
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
            onClick={clearFilters}
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