import { useState } from "react";
import OpenInNewOutlinedIcon     from "@mui/icons-material/OpenInNewOutlined";
import KeyboardArrowLeftIcon     from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon    from "@mui/icons-material/KeyboardArrowRight";
import FilterListOutlinedIcon    from "@mui/icons-material/FilterListOutlined";

// ─── Font constants — leaf elements only ──────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_STYLE = {
  Paid:       { bg: "#dcfce7", color: "#16a34a" },
  Pending:    { bg: "#fef9c3", color: "#ca8a04" },
  Processing: { bg: "#dbeafe", color: "#1d4ed8" },
  Cancelled:  { bg: "#fee2e2", color: "#dc2626" },
  Refunded:   { bg: "#f3e8ff", color: "#7c3aed" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Pending;
  return (
    <span
      className="inline-flex items-center px-3 py-0.5 rounded-full whitespace-nowrap"
      style={{ ...INTER, fontSize: 12, fontWeight: 600, backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}

const ROWS_PER_PAGE = 10;

// ─── Column definitions ───────────────────────────────────────────────────────
const COLUMNS = [
  { key: "id",      label: "Order ID",       className: "w-[110px]" },
  { key: "product", label: "Product",        className: "flex-1 min-w-[160px]" },
  { key: "email",   label: "Customer email", className: "flex-1 min-w-[180px]" },
  { key: "date",    label: "Date",           className: "w-[90px]" },
  { key: "amount",  label: "Total Amount",   className: "w-[140px]" },
  { key: "status",  label: "Status",         className: "w-[110px]" },
];

// ─── RecentOrders ─────────────────────────────────────────────────────────────
// Props:
//   orders      — array of order objects
//   onViewOrder — (orderId) => void  called when order ID is clicked
//   title       — section heading (default "RECENT ORDERS")

const RecentOrders = ({
  orders      = [],
  onViewOrder = () => {},
  title       = "RECENT ORDERS",
}) => {
  const [page,       setPage]       = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter
  const filtered = statusFilter === "All"
    ? orders
    : orders.filter(o => o.status === statusFilter);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const startIdx   = (page - 1) * ROWS_PER_PAGE;
  const pageOrders = filtered.slice(startIdx, startIdx + ROWS_PER_PAGE);

  const handleFilter = (s) => { setStatusFilter(s); setPage(1); };
  const handlePage   = (p) => { if (p >= 1 && p <= totalPages) setPage(p); };

  // Page number buttons (show max 5)
  const pageNums = () => {
    const max = 5;
    let start = Math.max(1, page - Math.floor(max / 2));
    let end   = Math.min(totalPages, start + max - 1);
    if (end - start < max - 1) start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div
      className="w-full bg-white rounded-2xl overflow-hidden"
      style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >

      {/* ── Header row ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 gap-3 flex-wrap">
        <h2
          className="text-[#111] tracking-wide"
          style={{ ...SORA, fontSize: 13, fontWeight: 800, letterSpacing: "0.08em" }}
        >
          {title}
        </h2>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <FilterListOutlinedIcon style={{ fontSize: 16, color: "#bbb" }} />
          {["All", "Paid", "Pending", "Processing", "Cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => handleFilter(s)}
              className={`px-3 py-1 rounded-full border text-[11px] font-semibold transition-all duration-150 whitespace-nowrap
                ${statusFilter === s
                  ? "bg-[#111] border-[#111] text-white"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                }`}
              style={INTER}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table wrapper — horizontally scrollable on small screens ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-175 border-collapse">

          {/* Head */}
          <thead>
            <tr className="border-b border-[#f0f0f0]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3 text-left ${col.className}`}
                  style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#111" }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {pageOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-400" style={{ ...INTER, fontSize: 13 }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              pageOrders.map((order, idx) => (
                <tr
                  key={`${order.id}-${idx}`}
                  className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors duration-100"
                >
                  {/* Order ID — clickable link style */}
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onViewOrder(order.id)}
                      className="flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 hover:underline"
                      style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#1a73e8" }}
                    >
                      {order.id}
                      <OpenInNewOutlinedIcon style={{ fontSize: 12, opacity: 0.6 }} />
                    </button>
                  </td>

                  {/* Product */}
                  <td className="px-5 py-3.5">
                    <span style={{ ...INTER, fontSize: 13, fontWeight: 400, color: "#333" }}>
                      {order.product}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-3.5">
                    <span style={{ ...INTER, fontSize: 13, fontWeight: 400, color: "#555" }}>
                      {order.email}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5">
                    <span style={{ ...INTER, fontSize: 13, fontWeight: 400, color: "#555" }}>
                      {order.date}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-3.5">
                    <span style={{ ...INTER, fontSize: 13, fontWeight: 500, color: "#111" }}>
                      Rs {order.amount.toLocaleString()}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination footer ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#f5f5f5] flex-wrap gap-3">
          {/* Row count */}
          <p style={{ ...INTER, fontSize: 12, color: "#aaa", fontWeight: 400 }}>
            Showing {startIdx + 1}–{Math.min(startIdx + ROWS_PER_PAGE, filtered.length)} of {filtered.length} orders
          </p>

          {/* Page buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
              className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
            >
              <KeyboardArrowLeftIcon style={{ fontSize: 16 }} />
            </button>

            {pageNums().map((n) => (
              <button
                key={n}
                onClick={() => handlePage(n)}
                className={`flex items-center justify-center w-7 h-7 rounded-lg border text-[12px] font-semibold transition-all
                  ${page === n
                    ? "bg-[#111] border-[#111] text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                style={INTER}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => handlePage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
            >
              <KeyboardArrowRightIcon style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecentOrders;
