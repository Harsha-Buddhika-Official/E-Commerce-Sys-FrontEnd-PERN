import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AddOutlinedIcon           from "@mui/icons-material/AddOutlined";
import SearchOutlinedIcon        from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon         from "@mui/icons-material/CloseOutlined";
import FilterListOutlinedIcon    from "@mui/icons-material/FilterListOutlined";
import PersonOffOutlinedIcon     from "@mui/icons-material/PersonOffOutlined";
import CircularProgress          from "@mui/material/CircularProgress";
import { useGetAdmins } from "../features/admin/hooks/useGetAdmins.js";
import { useDeleteAdmin } from "../features/admin/hooks/useDeleteAdmin.js";
import StatusRow from "../components/admin/StatusRow.jsx";
import AdminGrid from "../components/admin/AdminGrid.jsx";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

function FilterChip({ label, active, onClick, count }) {
	return (
		<button onClick={onClick} className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer" style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: active ? "#111" : "#fff", color: active ? "#fff" : "#555", borderColor: active ? "#111" : "#e5e5e5" }}>
			{label}
			<span className="flex items-center justify-center min-w-5 h-5 rounded-full px-1" style={{ backgroundColor: active ? "rgba(255,255,255,0.2)" : "#f0f0f0", fontSize: 10, fontWeight: 800, color: active ? "#fff" : "#888" }}>{count}</span>
		</button>
	);
}

export default function AdminManagement({ onCreateNew } = {}) {
	const { admins, loading, error, refresh } = useGetAdmins();
	const { deleteAdmin } = useDeleteAdmin();
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("ALL");
	const [statusFilter, setStatusFilter] = useState("ALL");

	const total = admins.length;
	const superAdmins = admins.filter((a) => a.role === "SUPER_ADMIN").length;
	const adminCount = admins.filter((a) => a.role === "ADMIN").length;
	const managers = admins.filter((a) => a.role === "MANAGER").length;
	const activeCount = admins.filter((a) => a.is_active).length;

	const handleCreateAdmin = useCallback(() => { if (onCreateNew) { onCreateNew(); return; } navigate("/admin/admin/create"); }, [navigate, onCreateNew]);

	const roleCounts = { ALL: admins.length, SUPER_ADMIN: superAdmins, ADMIN: adminCount, MANAGER: managers };
	const statusCounts = { ALL: admins.length, ACTIVE: activeCount, INACTIVE: admins.length - activeCount };

	const filtered = useMemo(() => admins.filter((a) => { const q = search.toLowerCase(); const matchSearch = !q || a.name.toLowerCase().includes(q) || a.username.toLowerCase().includes(q) || a.email.toLowerCase().includes(q); const matchRole = roleFilter === "ALL" || a.role === roleFilter; const matchStatus = statusFilter === "ALL" || (statusFilter === "ACTIVE" && a.is_active) || (statusFilter === "INACTIVE" && !a.is_active); return matchSearch && matchRole && matchStatus; }), [admins, search, roleFilter, statusFilter]);

	const handleDelete = async (admin) => { try { await deleteAdmin(admin.email); await refresh(); } catch (err) { console.error("Delete failed:", err.message); } };

	return (
		<div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">
			<div className="flex items-center justify-between mb-6 flex-wrap gap-3">
				<div><p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>System / Admins</p><h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Admin Management</h1></div>
				<button onClick={handleCreateAdmin} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all hover:bg-[#222] cursor-pointer" style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}><AddOutlinedIcon style={{ fontSize: 18 }} /> Add New Admin</button>
			</div>
			{loading ? (<div className="flex items-center justify-center py-20"><div className="flex flex-col items-center gap-3"><CircularProgress /><p style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#666" }}>Loading admins…</p></div></div>) : error ? (<div className="bg-white rounded-2xl p-6 mb-6" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}><p style={{ ...INTER, fontSize: 14, fontWeight: 800, color: "#e53935" }}>Failed to load admins</p><p style={{ ...INTER, fontSize: 13, color: "#555", marginTop: 6 }}>{error.message || String(error)}</p><div className="mt-4"><button onClick={() => refresh()} className="px-4 py-2 rounded-xl text-white" style={{ backgroundColor: "#111", fontWeight: 700 }}>Retry</button></div></div>) : (<StatusRow total={total} superAdmins={superAdmins} admins={adminCount} managers={managers} />)}
			<div className="bg-white rounded-2xl p-4 mb-5 flex flex-col gap-4" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
				<div className="relative flex items-center"><SearchOutlinedIcon style={{ position: "absolute", left: 14, fontSize: 18, color: "#bbb" }} /><input type="text" placeholder="Search by name, username or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full outline-none transition-all" style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#111", backgroundColor: "#f9f9f9", border: "1.5px solid #ebebeb", borderRadius: 12, padding: "10px 38px" }} onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }} onBlur={(e) => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }} />{search && (<button onClick={() => setSearch("")} className="absolute right-3 flex items-center justify-center w-5 h-5 rounded-md cursor-pointer border-none bg-transparent" style={{ color: "#bbb" }}><CloseOutlinedIcon style={{ fontSize: 14 }} /></button>)}</div>
				<div className="flex items-center gap-2 flex-wrap"><div className="flex items-center gap-1.5 mr-1"><FilterListOutlinedIcon style={{ fontSize: 15, color: "#bbb" }} /><span style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.07em" }}>Role</span></div>{["ALL", "SUPER_ADMIN", "ADMIN", "MANAGER"].map((r) => (<FilterChip key={r} label={r === "ALL" ? "All Roles" : r.split("_").map((w) => w[0] + w.slice(1).toLowerCase()).join(" ")} active={roleFilter === r} count={roleCounts[r]} onClick={() => setRoleFilter(r)} />))}<div className="w-px h-5 mx-2" style={{ backgroundColor: "#e5e5e5" }} /><div className="flex items-center gap-1.5 mr-1"><span style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.07em" }}>Status</span></div>{["ALL", "ACTIVE", "INACTIVE"].map((s) => (<FilterChip key={s} label={s === "ALL" ? "All Status" : s} active={statusFilter === s} count={statusCounts[s]} onClick={() => setStatusFilter(s)} />))}</div>
			</div>
			<div className="flex items-center justify-between mb-4"><p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}>Showing <span style={{ color: "#111", fontWeight: 800 }}>{filtered.length}</span> of {total} admins</p>{(search || roleFilter !== "ALL" || statusFilter !== "ALL") && (<button onClick={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); }} className="flex items-center gap-1.5 cursor-pointer border-none bg-transparent" style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#e53935" }}><CloseOutlinedIcon style={{ fontSize: 13 }} /> Clear filters</button>)}</div>
			{filtered.length > 0 ? <AdminGrid admins={filtered} onDelete={handleDelete} /> : <div className="bg-white rounded-2xl flex flex-col items-center justify-center py-20 gap-4" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}><div className="flex items-center justify-center w-16 h-16 rounded-2xl" style={{ backgroundColor: "#f5f5f5" }}><PersonOffOutlinedIcon style={{ fontSize: 32, color: "#ccc" }} /></div><div className="text-center"><p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>No admins found</p><p style={{ ...INTER, fontSize: 13, color: "#bbb", marginTop: 4 }}>{search ? `No results for "${search}"` : "Try adjusting your filters"}</p></div><button onClick={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all" style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#555", backgroundColor: "#fff" }}><CloseOutlinedIcon style={{ fontSize: 15 }} /> Clear filters</button></div>}
		</div>
	);
}
