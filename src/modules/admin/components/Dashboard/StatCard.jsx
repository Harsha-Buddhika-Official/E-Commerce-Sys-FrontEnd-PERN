import AttachMoneyOutlinedIcon    from "@mui/icons-material/AttachMoneyOutlined";
import ShoppingCartOutlinedIcon   from "@mui/icons-material/ShoppingCartOutlined";
import PeopleAltOutlinedIcon      from "@mui/icons-material/PeopleAltOutlined";
import Inventory2OutlinedIcon     from "@mui/icons-material/Inventory2Outlined";
import TrendingUpOutlinedIcon     from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon   from "@mui/icons-material/TrendingDownOutlined";
import TrendingFlatOutlinedIcon   from "@mui/icons-material/TrendingFlatOutlined";

// ─── Font constants — leaf elements only ──────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Icon + colour presets ────────────────────────────────────────────────────
const ICON_PRESETS = {
  revenue:   { icon: <AttachMoneyOutlinedIcon   style={{ fontSize: 22 }} />, bg: "#dbeafe", color: "#3b82f6" },
  orders:    { icon: <ShoppingCartOutlinedIcon  style={{ fontSize: 22 }} />, bg: "#dcfce7", color: "#22c55e" },
  customers: { icon: <PeopleAltOutlinedIcon     style={{ fontSize: 22 }} />, bg: "#fef9c3", color: "#eab308" },
  inventory: { icon: <Inventory2OutlinedIcon    style={{ fontSize: 22 }} />, bg: "#fce7f3", color: "#ec4899" },
};

// ─── AdminStatCard ────────────────────────────────────────────────────────────
// Props:
//   title         — e.g. "Total Revenue"
//   value         — e.g. "LKR 1,40,689.00"
//   change        — number  e.g. 8.5  (positive = up, negative = down, 0 = flat)
//   changeLabel   — e.g. "Up from last month" / "Down from last week"
//   preset        — "revenue" | "orders" | "customers" | "inventory"
//   customIcon    — optional JSX to override preset icon
//   iconBg        — optional hex to override preset icon background colour
//   iconColor     — optional hex to override preset icon colour

const StatCard = ({
  title        = "Total Revenue",
  value        = "LKR 1,40,689.00",
  change       = 8.5,
  changeLabel  = "Up from last month",
  preset       = "revenue",
  customIcon   = null,
  iconBg       = null,
  iconColor    = null,
}) => {
  const presetData  = ICON_PRESETS[preset] || ICON_PRESETS.revenue;
  const resolvedBg  = iconBg    || presetData.bg;
  const resolvedClr = iconColor || presetData.color;
  const resolvedIcon = customIcon || presetData.icon;

  // Trend
  const isUp   = change > 0;
  const isDown = change < 0;
  const isFlat = change === 0;

  const trendColor = isUp ? "#10b981" : isDown ? "#ef4444" : "#6b7280";
  const TrendIcon  = isUp
    ? <TrendingUpOutlinedIcon   style={{ fontSize: 18, color: trendColor }} />
    : isDown
    ? <TrendingDownOutlinedIcon style={{ fontSize: 18, color: trendColor }} />
    : <TrendingFlatOutlinedIcon style={{ fontSize: 18, color: trendColor }} />;

  const trendText = isFlat
    ? `No change`
    : `${Math.abs(change)}% ${changeLabel}`;

  return (
    <div
      className="bg-white rounded-2xl p-5 flex flex-col gap-3 w-full"
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1px solid #f0f0f0" }}
    >
      {/* ── Row 1: label + icon ── */}
      <div className="flex items-start justify-between gap-3">
        <p
          className="text-gray-400 leading-tight"
          style={{ ...INTER, fontSize: 14, fontWeight: 500 }}
        >
          {title}
        </p>

        {/* Icon circle */}
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: 44,
            height: 44,
            backgroundColor: resolvedBg,
            color: resolvedClr,
          }}
        >
          {resolvedIcon}
        </div>
      </div>

      {/* ── Row 2: value ── */}
      <p
        className="text-[#111] leading-none"
        style={{ ...SORA, fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}
      >
        {value}
      </p>

      {/* ── Row 3: trend ── */}
      <div className="flex items-center gap-1.5">
        {TrendIcon}
        <span style={{ ...INTER, fontSize: 13, fontWeight: 500, color: trendColor }}>
          {trendText}
        </span>
      </div>
    </div>
  );
};

export default StatCard;


// ─── Usage example (4-card dashboard row) ────────────────────────────────────
//
// import AdminStatCard from "./AdminStatCard";
//
// <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//   <AdminStatCard
//     title="Total Revenue"
//     value="LKR 1,40,689.00"
//     change={8.5}
//     changeLabel="Up from last month"
//     preset="revenue"
//   />
//   <AdminStatCard
//     title="Total Orders"
//     value="1,284"
//     change={3.2}
//     changeLabel="Up from last week"
//     preset="orders"
//   />
//   <AdminStatCard
//     title="Total Customers"
//     value="9,430"
//     change={-1.4}
//     changeLabel="Down from last month"
//     preset="customers"
//   />
//   <AdminStatCard
//     title="Low Stock Items"
//     value="24"
//     change={0}
//     changeLabel=""
//     preset="inventory"
//   />
// </div>
