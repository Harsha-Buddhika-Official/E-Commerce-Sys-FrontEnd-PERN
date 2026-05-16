import { useState } from "react";
import OpenInNewOutlinedIcon  from "@mui/icons-material/OpenInNewOutlined";
import KeyboardArrowLeftIcon  from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { useOrders } from "../../features/orders/hooks/useOrders";

// ─── Font constants — leaf elements only ──────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Status badge ─────────────────────────────────────────────────────────────
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
      className="inline-flex items-center px-4 py-1 rounded-full whitespace-nowrap"
      style={{ ...INTER, fontSize: 14, fontWeight: 600, backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}


const ROWS_PER_PAGE  = 10;
const STATUS_FILTERS = ["All", "Paid", "Pending", "Processing", "Cancelled"];

// ─── Columns — percentage widths + table-layout:fixed ────────────────────────
// table-layout:fixed is REQUIRED — without it browsers ignore colgroup widths
// and let content stretch columns freely (the gap problem in the screenshot).
const COLUMNS = [
  { key: "id",       label: "Order ID",     w: "18%" },
  { key: "product",  label: "Product",      w: "36%" },
  { key: "quantity", label: "Quantity",     w: "10%" },
  { key: "amount",   label: "Total Amount", w: "20%" },
  { key: "status",   label: "Status",       w: "16%" },
];

// ─── RecentOrders ─────────────────────────────────────────────────────────────
const RecentOrders = ({
  onViewOrder = () => {},
  title       = "RECENT ORDERS",
}) => {
  const { orders, loading, error } = useOrders();
  const [page,         setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered   = statusFilter === "All" ? orders : orders.filter(o => o.status === statusFilter);
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const startIdx   = (page - 1) * ROWS_PER_PAGE;
  const pageOrders = filtered.slice(startIdx, startIdx + ROWS_PER_PAGE);

  const handleFilter = (s) => { setStatusFilter(s); setPage(1); };
  const handlePage   = (p) => { if (p >= 1 && p <= totalPages) setPage(p); };

  const pageNums = () => {
    const max   = 5;
    let start   = Math.max(1, page - Math.floor(max / 2));
    let end     = Math.min(totalPages, start + max - 1);
    if (end - start < max - 1) start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Handle loading state
  if (loading) {
    return (
      <div
        className="w-full bg-white rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", minHeight: 400 }}
      >
        <p style={{ ...INTER, fontSize: 15, color: "#999" }}>Loading orders...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div
        className="w-full bg-white rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", minHeight: 400 }}
      >
        <p style={{ ...INTER, fontSize: 15, color: "#dc2626" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white rounded-2xl overflow-hidden"
      style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-5 gap-4 flex-wrap">
        <h2
          className="text-[#111] tracking-wide"
          style={{ ...SORA, fontSize: 16, fontWeight: 800, letterSpacing: "0.08em" }}
        >
          {title}
        </h2>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <FilterListOutlinedIcon style={{ fontSize: 18, color: "#bbb" }} />
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => handleFilter(s)}
              className={`px-4 py-1.5 rounded-full border text-[12px] font-semibold transition-all duration-150 whitespace-nowrap
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

      {/* ── Table — horizontally scrollable on small screens ── */}
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse"
          style={{ tableLayout: "fixed", minWidth: 480 }}
        >
          {/* ── Explicit column widths via <colgroup> for reliable gaps ── */}
          <colgroup>
            {COLUMNS.map((col) => (
              <col key={col.key} style={{ width: col.w }} />
            ))}
          </colgroup>

          {/* Head */}
          <thead>
            <tr className="border-b border-[#f0f0f0]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="text-left"
                  style={{
                    ...INTER,
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#111",
                    // Consistent horizontal padding on every cell = the column "gap"
                    paddingTop:    14,
                    paddingBottom: 14,
                    paddingLeft:   col.key === "id" ? 24 : 20,
                    paddingRight:  col.key === "status" ? 24 : 20,
                  }}
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
                <td
                  colSpan={5}
                  className="text-center text-gray-400"
                  style={{ ...INTER, fontSize: 15, padding: "64px 24px" }}
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              pageOrders.map((order, idx) => (
                <tr
                  key={`${order.id}-${idx}`}
                  className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors duration-100"
                >
                  {/* Order ID */}
                  <td style={{ paddingTop: 14, paddingBottom: 14, paddingLeft: 24, paddingRight: 20 }}>
                    <button
                      onClick={() => onViewOrder(order.id)}
                      className="flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 hover:underline"
                      style={{ ...INTER, fontSize: 15, fontWeight: 600, color: "#1a73e8" }}
                    >
                      {order.id}
                      <OpenInNewOutlinedIcon style={{ fontSize: 14, opacity: 0.6 }} />
                    </button>
                  </td>

                  {/* Product */}
                  <td style={{ paddingTop: 14, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>
                    <span
                      style={{ ...INTER, fontSize: 15, fontWeight: 400, color: "#333" }}
                    >
                      {order.product}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td style={{ paddingTop: 14, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, textAlign: "center" }}>
                    <span style={{ ...INTER, fontSize: 15, fontWeight: 500, color: "#111" }}>
                      {order.quantity}
                    </span>
                  </td>

                  {/* Amount */}
                  <td style={{ paddingTop: 14, paddingBottom: 14, paddingLeft: 20, paddingRight: 20 }}>
                    <span style={{ ...INTER, fontSize: 15, fontWeight: 500, color: "#111" }}>
                      Rs {order.totalAmount.toLocaleString()}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ paddingTop: 14, paddingBottom: 14, paddingLeft: 20, paddingRight: 24 }}>
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#f5f5f5] flex-wrap gap-3">
          <p style={{ ...INTER, fontSize: 13, color: "#aaa", fontWeight: 400 }}>
            Showing {startIdx + 1}–{Math.min(startIdx + ROWS_PER_PAGE, filtered.length)} of {filtered.length} orders
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
            >
              <KeyboardArrowLeftIcon style={{ fontSize: 16 }} />
            </button>

            {pageNums().map((n) => (
              <button
                key={n}
                onClick={() => handlePage(n)}
                className={`flex items-center justify-center w-8 h-8 rounded-lg border text-[13px] font-semibold transition-all
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
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
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