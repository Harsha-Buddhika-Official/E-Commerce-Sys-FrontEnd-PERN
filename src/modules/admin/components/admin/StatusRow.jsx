import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";

const SORA = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

function StatCard({ label, value, icon, bg, color }) {
  return (
    <div
      className="bg-white rounded-2xl p-5 flex items-center gap-4"
      style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0" style={{ backgroundColor: bg }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
        <p style={{ ...SORA, fontSize: 22, fontWeight: 900, color: "#111" }}>{value}</p>
      </div>
    </div>
  );
}

export default function StatusRow({ total = 0, superAdmins = 0, admins = 0, managers = 0 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="Total Admins" value={total} icon={<PeopleOutlinedIcon style={{ fontSize: 22 }} />} bg="#f5f5f5" color="#111" />
      <StatCard label="Super Admins" value={superAdmins} icon={<AdminPanelSettingsOutlinedIcon style={{ fontSize: 22 }} />} bg="#fef9c3" color="#a16207" />
      <StatCard label="Admins" value={admins} icon={<SupervisorAccountOutlinedIcon style={{ fontSize: 22 }} />} bg="#dbeafe" color="#1d4ed8" />
      <StatCard label="Managers" value={managers} icon={<ManageAccountsOutlinedIcon style={{ fontSize: 22 }} />} bg="#f3e8ff" color="#7e22ce" />
    </div>
  );
}
