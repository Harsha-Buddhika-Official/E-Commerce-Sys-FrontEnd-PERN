import { useState } from "react";
import OpenInNewOutlinedIcon  from "@mui/icons-material/OpenInNewOutlined";
import KeyboardArrowLeftIcon  from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useRecentOrders } from "../../features/orders/hooks/useRecentOrders";

// ─── Font constants — leaf elements only ──────────────────────────────────────
import { SORA, INTER } from "../../../../styles/fonts";

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  Pending:    { bg: "#fef9c3", color: "#ca8a04" },
  Paid:       { bg: "#dcfce7", color: "#16a34a" },
  Processing: { bg: "#dbeafe", color: "#1d4ed8" },
  Shipped:    { bg: "#f5f3ff", color: "#7c3aed" },
  Delivered:  { bg: "#ecfeff", color: "#0e7490" },
  Cancelled:  { bg: "#fee2e2", color: "#dc2626" },
};

function normalizeStatus(status) {
  return status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
}

function StatusBadge({ status }) {
  const normalized = normalizeStatus(status);
  const s = STATUS_STYLE[normalized] || STATUS_STYLE.Pending;

  return (
    <span
      className="inline-flex items-center px-2.5 sm:px-4 py-1 rounded-full whitespace-nowrap"
      style={{
        ...INTER,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: s.bg,
        color: s.color,
      }}
    >
      {normalized}
    </span>
  );
}

const ROWS_PER_PAGE = 10;

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
  const { orders, loading, error } = useRecentOrders();
  const [page,         setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered   = statusFilter === "All" ? orders : orders.filter(o => o.status === statusFilter);
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const startIdx   = (page - 1) * ROWS_PER_PAGE;
  const pageOrders = filtered.slice(startIdx, startIdx + ROWS_PER_PAGE);

  const handlePage = (p) => { if (p >= 1 && p <= totalPages) setPage(p); };

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
        className="w-full bg-white rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", minHeight: 300 }}
      >
        <p style={{ ...INTER, fontSize: 14, color: "#999" }}>Loading orders...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div
        className="w-full bg-white rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", minHeight: 300 }}
      >
        <p style={{ ...INTER, fontSize: 14, color: "#dc2626" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white rounded-xl sm:rounded-2xl overflow-hidden"
      style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-5 gap-4 flex-wrap">
        <h2
          className="text-[#111] tracking-wide"
          style={{ ...SORA, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em" }}
        >
          {title}
        </h2>
      </div>

      {/* ── Table — horizontally scrollable on small screens ── */}
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse"
          style={{ tableLayout: "fixed", minWidth: 480 }}
        >
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
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#111",
                    paddingTop:    12,
                    paddingBottom: 12,
                    paddingLeft:   col.key === "id" ? 16 : 14,
                    paddingRight:  col.key === "status" ? 16 : 14,
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
                  style={{ ...INTER, fontSize: 14, padding: "48px 20px" }}
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
                  <td style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 14 }}>
                    <button
                      onClick={() => onViewOrder(order.id)}
                      className="flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 hover:underline"
                      style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#1a73e8" }}
                    >
                      {order.id}
                      <OpenInNewOutlinedIcon style={{ fontSize: 13, opacity: 0.6 }} />
                    </button>
                  </td>

                  {/* Product */}
                  <td style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 14, paddingRight: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>
                    <span style={{ ...INTER, fontSize: 13, fontWeight: 400, color: "#333" }}>
                      {order.product}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 14, paddingRight: 14, textAlign: "center" }}>
                    <span style={{ ...INTER, fontSize: 13, fontWeight: 500, color: "#111" }}>
                      {order.quantity}
                    </span>
                  </td>

                  {/* Amount */}
                  <td style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 14, paddingRight: 14 }}>
                    <span style={{ ...INTER, fontSize: 13, fontWeight: 500, color: "#111" }}>
                      Rs {order.totalAmount.toLocaleString()}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 14, paddingRight: 16 }}>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-t border-[#f5f5f5] gap-3">
          <p style={{ ...INTER, fontSize: 12, color: "#aaa", fontWeight: 400 }}>
            Showing {startIdx + 1}–{Math.min(startIdx + ROWS_PER_PAGE, filtered.length)} of {filtered.length} orders
          </p>

          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
            >
              <KeyboardArrowLeftIcon style={{ fontSize: 16 }} />
            </button>

            {pageNums().map((n) => (
              <button
                key={n}
                onClick={() => handlePage(n)}
                className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border text-[12px] sm:text-[13px] font-semibold transition-all
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
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
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