import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

// ─── Font constants — leaf elements only ──────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Stock progress bar ───────────────────────────────────────────────────────
function StockBar({ stock, maxStock }) {
  const pct = Math.min((stock / maxStock) * 100, 100);
  // Colour thresholds
  const fillColor = stock <= 3 ? "#ef4444" : stock <= 8 ? "#f97316" : "#22c55e";

  return (
    <div className="flex items-center gap-2">
      {/* Track */}
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: 8, backgroundColor: "#fecaca" }}
      >
        {/* Fill */}
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: fillColor }}
        />
      </div>
      {/* Count */}
      <span
        className="shrink-0 w-6 text-right"
        style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#ef4444" }}
      >
        {stock}
      </span>
    </div>
  );
}

// ─── LowStockAlert ────────────────────────────────────────────────────────────
// Props:
//   items       — array of { id, name, stock, maxStock }
//   onRestock   — (item) => void  called when Restock is clicked
//   title       — section heading

const LowStockAlert = ({
  items = [],
  title = "LOW STOCK ALERT",
}) => (
  <div
    className="w-full bg-white rounded-2xl p-5 flex flex-col gap-4"
    style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
  >
    {/* ── Header ── */}
    <div className="flex items-center gap-2">
      <WarningAmberOutlinedIcon style={{ fontSize: 18, color: "#ef4444" }} />
      <h2
        className="text-[#111] tracking-wide"
        style={{ ...SORA, fontSize: 13, fontWeight: 800, letterSpacing: "0.08em" }}
      >
        {title}
      </h2>
    </div>

    {/* ── Item list ── */}
    <div className="flex flex-col divide-y divide-[#f5f5f5]">
      {items.length === 0 ? (
        <p className="text-gray-400 py-6 text-center" style={{ ...INTER, fontSize: 13 }}>
          No low stock items 🎉
        </p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-3.5">

            {/* Left: name + bar */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <p
                className="text-[#111] leading-tight truncate"
                style={{ ...SORA, fontSize: 13, fontWeight: 700 }}
              >
                {item.name}
              </p>
              <StockBar stock={item.stock_quantity} maxStock={5} />
            </div>
          </div>
        ))
      )}
    </div>

    {/* ── Footer count ── */}
    {items.length > 0 && (
      <p
        className="text-gray-400 text-right"
        style={{ ...INTER, fontSize: 11, fontWeight: 500 }}
      >
        {items.length} item{items.length !== 1 ? "s" : ""} need restocking
      </p>
    )}
  </div>
);

export default LowStockAlert;
