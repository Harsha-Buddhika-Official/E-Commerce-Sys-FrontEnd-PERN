import PendingOutlinedIcon    from "@mui/icons-material/PendingOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon      from "@mui/icons-material/CancelOutlined";
import AllInboxOutlinedIcon    from "@mui/icons-material/AllInboxOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

// ─── Font constants — leaf elements only ──────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Preset icon + colour config ─────────────────────────────────────────────
const PRESETS = {
  pending:   { icon: <PendingOutlinedIcon       style={{ fontSize: 22 }} />, bg: "#dbeafe", color: "#93c5fd" },
  completed: { icon: <CheckCircleOutlinedIcon   style={{ fontSize: 22 }} />, bg: "#dcfce7", color: "#86efac" },
  cancelled: { icon: <CancelOutlinedIcon        style={{ fontSize: 22 }} />, bg: "#fee2e2", color: "#fca5a5" },
  all:       { icon: <AllInboxOutlinedIcon      style={{ fontSize: 22 }} />, bg: "#f3f4f6", color: "#9ca3af" },
  shipping:  { icon: <LocalShippingOutlinedIcon style={{ fontSize: 22 }} />, bg: "#fef9c3", color: "#fde047" },
};

// ─── OrderStatCard ─────────────────────────────────────────────────────────────
// Props:
//   label      — e.g. "Pending"
//   count      — number shown large e.g. 3
//   preset     — "pending" | "completed" | "cancelled" | "all" | "shipping"
//   iconBg     — optional override for icon circle background
//   iconColor  — optional override for icon colour
//   onClick    — optional click handler (e.g. filter table by this status)

const OrderStatCard = ({label,count,preset,iconBg,iconColor,}) => {
  const p            = PRESETS[preset] || PRESETS.pending;
  const resolvedBg   = iconBg    || p.bg;
  const resolvedClr  = iconColor || p.color;

  return (
    <div
      className={`
        bg-white rounded-2xl flex items-center justify-between px-5 py-5 w-full
        transition-all duration-150
      `}
      style={{
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Left: label + count */}
      <div className="flex flex-col gap-1.5">
        <p
          className="text-gray-400 leading-none"
          style={{ ...INTER, fontSize: 14, fontWeight: 500 }}
        >
          {label}
        </p>
        <p
          className="text-[#111] leading-none"
          style={{ ...SORA, fontSize: 32, fontWeight: 800 }}
        >
          {count}
        </p>
      </div>

      {/* Right: icon circle */}
      <div
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{
          width: 52,
          height: 52,
          backgroundColor: resolvedBg,
          color: resolvedClr,
        }}
      >
        {p.icon}
      </div>
    </div>
  );
};

export default OrderStatCard;


// ─── Usage example (4-card row on Orders page) ───────────────────────────────
//
// import OrderStatCard from "../components/Orders/OrderStatCard";
//
// <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//   <OrderStatCard label="All Orders" count={128} preset="all"       onClick={() => setFilter("All")}       />
//   <OrderStatCard label="Pending"    count={3}   preset="pending"   onClick={() => setFilter("Pending")}   />
//   <OrderStatCard label="Completed"  count={94}  preset="completed" onClick={() => setFilter("Completed")} />
//   <OrderStatCard label="Cancelled"  count={11}  preset="cancelled" onClick={() => setFilter("Cancelled")} />
// </div>
