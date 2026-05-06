// ─── Font constants — leaf elements only ──────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Status options config ────────────────────────────────────────────────────
const STATUSES = [
  { value: "Paid",       bg: "#dcfce7", color: "#16a34a" },
  { value: "Pending",    bg: "#fef9c3", color: "#ca8a04" },
  { value: "Processing", bg: "#dbeafe", color: "#1d4ed8" },
  { value: "Cancelled",  bg: "#fee2e2", color: "#dc2626" },
];

// ─── OrderStatusChanger ───────────────────────────────────────────────────────
// Props:
//   currentStatus — string  e.g. "Paid"
//   onStatusChange — (newStatus: string) => void
//   title          — heading (default "Order status change")
//   orderId        — optional, shown in heading for context

const OrderStatusChanger = ({
  currentStatus  = "Paid",
  onStatusChange = () => {},
  title          = "Order status change",
  orderId        = null,
}) => {
  return (
    <div
      className="bg-white rounded-2xl p-5 flex flex-col gap-3"
      style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {/* Heading */}
      <div className="mb-1">
        <h3
          className="text-[#111] leading-tight"
          style={{ ...SORA, fontSize: 15, fontWeight: 800 }}
        >
          {title}
          {orderId && (
            <span
              className="ml-2 text-gray-400"
              style={{ ...INTER, fontSize: 13, fontWeight: 500 }}
            >
              {orderId}
            </span>
          )}
        </h3>
      </div>

      {/* Status buttons */}
      <div className="flex flex-col gap-2.5">
        {STATUSES.map(({ value, bg, color }) => {
          const isActive = currentStatus === value;
          return (
            <button
              key={value}
              onClick={() => onStatusChange(value)}
              className="w-full py-3 rounded-2xl text-center transition-all duration-150 border-none cursor-pointer"
              style={{
                ...INTER,
                fontSize: 16,
                fontWeight: 700,
                backgroundColor: bg,
                color: color,
                // Active: slight ring + scale up
                outline: isActive ? `2.5px solid ${color}` : "none",
                outlineOffset: isActive ? "2px" : "0",
                transform: isActive ? "scale(1.02)" : "scale(1)",
                opacity: isActive ? 1 : 0.75,
              }}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusChanger;
