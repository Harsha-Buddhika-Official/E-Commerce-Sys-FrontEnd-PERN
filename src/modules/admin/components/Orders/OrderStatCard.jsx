import PendingOutlinedIcon       from "@mui/icons-material/PendingOutlined";
import CheckCircleOutlinedIcon   from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon        from "@mui/icons-material/CancelOutlined";
import AllInboxOutlinedIcon      from "@mui/icons-material/AllInboxOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import InventoryOutlinedIcon     from "@mui/icons-material/InventoryOutlined";
import TaskAltOutlinedIcon       from "@mui/icons-material/TaskAltOutlined";

// ─── Font constants — leaf elements only ──────────────────────────────────────
import { SORA, INTER } from "../../../../styles/fonts";

// ─── Preset icon + colour config ─────────────────────────────────────────────
const PRESETS = {
  pending:    { icon: <PendingOutlinedIcon        style={{ fontSize: 22 }} />, bg: "#dbeafe", color: "#93c5fd" },
  paid:       { icon: <CheckCircleOutlinedIcon    style={{ fontSize: 22 }} />, bg: "#dcfce7", color: "#86efac" },
  processing: { icon: <InventoryOutlinedIcon      style={{ fontSize: 22 }} />, bg: "#fef9c3", color: "#fde047" },
  shipped:    { icon: <LocalShippingOutlinedIcon  style={{ fontSize: 22 }} />, bg: "#ede9fe", color: "#c4b5fd" },
  completed:  { icon: <TaskAltOutlinedIcon        style={{ fontSize: 22 }} />, bg: "#dcfce7", color: "#86efac" },
  cancelled:  { icon: <CancelOutlinedIcon         style={{ fontSize: 22 }} />, bg: "#fee2e2", color: "#fca5a5" },
  all:        { icon: <AllInboxOutlinedIcon       style={{ fontSize: 22 }} />, bg: "#f3f4f6", color: "#9ca3af" },
};

const OrderStatCard = ({ label, count, preset, iconBg, iconColor, loading = false, error = null }) => {
  const p           = PRESETS[preset] || PRESETS.pending;
  const resolvedBg  = iconBg    || p.bg;
  const resolvedClr = iconColor || p.color;

  const renderCount = () => {
    if (loading) return <span style={{ ...SORA, fontSize: 16, fontWeight: 700 }}>...</span>;
    if (error) return <span style={{ ...SORA, fontSize: 16, fontWeight: 700, color: '#dc2626' }}>!</span>;
    return <span style={{ ...SORA, fontSize: 22, fontWeight: 800 }}>{count ?? 0}</span>;
  };

  return (
    <div
      className="bg-white rounded-xl sm:rounded-2xl flex items-center justify-between px-3 sm:px-5 py-3 sm:py-5 w-full transition-all duration-150"
      style={{
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Left: label + count */}
      <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0">
        <p
          className="text-gray-400 leading-none truncate"
          style={{ ...INTER, fontSize: 11, fontWeight: 500 }}
        >
          {label}
        </p>
        {renderCount()}
      </div>

      {/* Right: icon circle */}
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{
          width: 38,
          height: 38,
          backgroundColor: resolvedBg,
          color: resolvedClr,
        }}
      >
        <span style={{ transform: "scale(0.78)" }} className="sm:!scale-100 flex items-center justify-center">
          {p.icon}
        </span>
      </div>
    </div>
  );
};

export default OrderStatCard;