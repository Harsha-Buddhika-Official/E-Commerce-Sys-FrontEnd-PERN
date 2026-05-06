import { useState } from "react";
import OpenInNewOutlinedIcon  from "@mui/icons-material/OpenInNewOutlined";
import KeyboardArrowLeftIcon  from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SearchOutlinedIcon     from "@mui/icons-material/SearchOutlined";
import ViewListOutlinedIcon   from "@mui/icons-material/ViewListOutlined";
import GridViewOutlinedIcon   from "@mui/icons-material/GridViewOutlined";

// ─── Font constants — leaf elements only ──────────────────────────────────────
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  Paid:       { bg: "#dcfce7", color: "#16a34a" },
  Pending:    { bg: "#fef9c3", color: "#ca8a04" },
  Completed:  { bg: "#dbeafe", color: "#1d4ed8" },
  Cancelled:  { bg: "#fee2e2", color: "#dc2626" },
  Refunded:   { bg: "#f3e8ff", color: "#7c3aed" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Pending;
  return (
    <span
      className="inline-flex items-center px-3 py-0.5 rounded-full whitespace-nowrap"
      style={{ ...INTER, fontSize: 13, fontWeight: 600, backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = Array.from({ length: 48 }, (_, i) => ({
  id:      `#${4231 + i}`,
  product: ["RTX 4080 Super 16GB", "Intel Core i9-14900K", "Samsung 990 Pro 2TB", "G.Skill Trident Z5 32GB", "ASUS ROG B650-E"][i % 5],
  email:   ["customer@example.com", "john.doe@gmail.com", "alice@company.lk", "buyer@email.com"][i % 4],
  date:    ["May 1", "May 2", "May 3", "Apr 30", "Apr 28"][i % 5],
  amount:  [351000, 189900, 62900, 38900, 99900][i % 5],
  status:  ["Paid", "Paid", "Pending", "Completed", "Paid", "Cancelled", "Paid", "Paid"][i % 8],
}));

// ─── Column definitions — 6 cols matching screenshot ─────────────────────────
const COLUMNS = [
  { key: "id",      label: "Order ID",       w: "14%" },
  { key: "product", label: "Product",        w: "22%" },
  { key: "email",   label: "Customer email", w: "22%" },
  { key: "date",    label: "Date",           w: "10%" },
  { key: "amount",  label: "Total Amount",   w: "16%" },
  { key: "status",  label: "Status",         w: "16%" },
];

const STATUS_FILTERS = ["All", "Recent", "Pending", "Completed", "Cancelled"];
const ROWS_PER_PAGE  = 16;

// ─── Grid card for grid-view mode ─────────────────────────────────────────────
function OrderCard({ order, selected, onClick, onViewOrder }) {
  const s = STATUS_STYLE[order.status] || STATUS_STYLE.Pending;
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border cursor-pointer transition-all duration-150 p-4 flex flex-col gap-2"
      style={{
        borderColor: selected ? "#1a73e8" : "#f0f0f0",
        backgroundColor: selected ? "#eff6ff" : "#fff",
        boxShadow: selected ? "0 0 0 2px #1a73e820" : "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={(e) => { e.stopPropagation(); onViewOrder(order.id); }}
          className="bg-transparent border-none cursor-pointer p-0 hover:underline"
          style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#1a73e8" }}
        >
          {order.id}
        </button>
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full"
          style={{ ...INTER, fontSize: 11, fontWeight: 600, backgroundColor: s.bg, color: s.color }}
        >
          {order.status}
        </span>
      </div>
      <p className="truncate" style={{ ...INTER, fontSize: 13, fontWeight: 500, color: "#111" }}>
        {order.product}
      </p>
      <p className="truncate" style={{ ...INTER, fontSize: 12, fontWeight: 400, color: "#888" }}>
        {order.email}
      </p>
      <div className="flex items-center justify-between mt-1">
        <span style={{ ...INTER, fontSize: 12, color: "#aaa" }}>{order.date}</span>
        <span style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#111" }}>
          Rs {order.amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// ─── OrdersTable ──────────────────────────────────────────────────────────────
// Props:
//   orders       — array of order objects (defaults to mock data)
//   onViewOrder  — (orderId) => void
const OrdersTable = ({
  orders      = MOCK_ORDERS,
  onViewOrder = () => {},
}) => {
  const [page,          setPage]          = useState(1);
  const [activeFilter,  setActiveFilter]  = useState("All");
  const [search,        setSearch]        = useState("");
  const [selectedRow,   setSelectedRow]   = useState(null);
  const [viewMode,      setViewMode]      = useState("list"); // "list" | "grid"

  // Filter + search
  const filtered = orders.filter((o) => {
    const matchFilter =
      activeFilter === "All"     ? true :
      activeFilter === "Recent"  ? true : // treat Recent as All for demo
      o.status === activeFilter;

    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.id.toLowerCase().includes(q)      ||
      o.product.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q);

    return matchFilter && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const startIdx   = (page - 1) * ROWS_PER_PAGE;
  const pageOrders = filtered.slice(startIdx, startIdx + ROWS_PER_PAGE);

  const handleFilter = (f) => { setActiveFilter(f); setPage(1); setSelectedRow(null); };
  const handleSearch = (v) => { setSearch(v);        setPage(1); setSelectedRow(null); };
  const handlePage   = (p) => { if (p >= 1 && p <= totalPages) setPage(p); };

  const pageNums = () => {
    const max   = 5;
    let start   = Math.max(1, page - Math.floor(max / 2));
    let end     = Math.min(totalPages, start + max - 1);
    if (end - start < max - 1) start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div
      className="w-full bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap border-b border-[#f5f5f5]">

        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 rounded-xl border transition-all duration-150"
          style={{ height: 38, minWidth: 180, maxWidth: 240, borderColor: "#e5e7eb", backgroundColor: "#fafafa" }}
        >
          <SearchOutlinedIcon style={{ fontSize: 17, color: "#bbb", flexShrink: 0 }} />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search orders…"
            className="flex-1 bg-transparent outline-none border-none text-[#111] placeholder-gray-300 min-w-0"
            style={{ ...INTER, fontSize: 13 }}
          />
        </div>

        {/* Filter tabs — matching screenshot pill style */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                className="px-4 py-1.5 rounded-full border text-[13px] font-semibold transition-all duration-150 whitespace-nowrap"
                style={{
                  ...INTER,
                  backgroundColor: isActive ? "#1a73e8" : "#f3f4f6",
                  borderColor:     isActive ? "#1a73e8" : "#e5e7eb",
                  color:           isActive ? "#fff"    : "#555",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* View toggle */}
        <div
          className="flex items-center rounded-xl overflow-hidden border"
          style={{ borderColor: "#e5e7eb" }}
        >
          <button
            onClick={() => setViewMode("list")}
            className="flex items-center justify-center transition-all duration-150"
            style={{
              width: 36, height: 36,
              backgroundColor: viewMode === "list" ? "#1a73e8" : "#fff",
              color:           viewMode === "list" ? "#fff"    : "#888",
              border: "none", cursor: "pointer",
            }}
          >
            <ViewListOutlinedIcon style={{ fontSize: 18 }} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className="flex items-center justify-center transition-all duration-150"
            style={{
              width: 36, height: 36,
              backgroundColor: viewMode === "grid" ? "#1a73e8" : "#fff",
              color:           viewMode === "grid" ? "#fff"    : "#888",
              border: "none", cursor: "pointer",
              borderLeft: "1px solid #e5e7eb",
            }}
          >
            <GridViewOutlinedIcon style={{ fontSize: 17 }} />
          </button>
        </div>
      </div>

      {/* ── LIST VIEW ── */}
      {viewMode === "list" && (
        <div className="overflow-x-auto flex-1">
          <table
            className="w-full border-collapse"
            style={{ tableLayout: "fixed", minWidth: 700 }}
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
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#111",
                      padding: "13px 16px",
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
                    colSpan={6}
                    className="text-center text-gray-400 py-16"
                    style={{ ...INTER, fontSize: 14 }}
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                pageOrders.map((order, idx) => {
                  const isSelected = selectedRow === order.id;
                  return (
                    <tr
                      key={`${order.id}-${idx}`}
                      onClick={() => setSelectedRow(isSelected ? null : order.id)}
                      className="border-b border-[#f5f5f5] cursor-pointer transition-colors duration-100"
                      style={{ backgroundColor: isSelected ? "#eff6ff" : "transparent" }}
                    >
                      {/* Order ID */}
                      <td style={{ padding: "13px 16px", overflow: "hidden" }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); onViewOrder(order.id); }}
                          className="flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 hover:underline"
                          style={{ ...INTER, fontSize: 14, fontWeight: 600, color: "#1a73e8" }}
                        >
                          {order.id}
                          <OpenInNewOutlinedIcon style={{ fontSize: 12, opacity: 0.6 }} />
                        </button>
                      </td>

                      {/* Product */}
                      <td style={{ padding: "13px 16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>
                        <span style={{ ...INTER, fontSize: 14, fontWeight: 400, color: "#333" }}>
                          {order.product}
                        </span>
                      </td>

                      {/* Email */}
                      <td style={{ padding: "13px 16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>
                        <span style={{ ...INTER, fontSize: 14, fontWeight: 400, color: "#555" }}>
                          {order.email}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ ...INTER, fontSize: 14, fontWeight: 400, color: "#555" }}>
                          {order.date}
                        </span>
                      </td>

                      {/* Amount */}
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ ...INTER, fontSize: 14, fontWeight: 500, color: "#111" }}>
                          Rs {order.amount.toLocaleString()}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "13px 16px" }}>
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === "grid" && (
        <div className="p-5 flex-1">
          {pageOrders.length === 0 ? (
            <p className="text-center text-gray-400 py-16" style={{ ...INTER, fontSize: 14 }}>
              No orders found.
            </p>
          ) : (
            <div className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
            >
              {pageOrders.map((order, idx) => (
                <OrderCard
                  key={`${order.id}-${idx}`}
                  order={order}
                  selected={selectedRow === order.id}
                  onClick={() => setSelectedRow(selectedRow === order.id ? null : order.id)}
                  onViewOrder={onViewOrder}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#f5f5f5] flex-wrap gap-3">
          <p style={{ ...INTER, fontSize: 12, color: "#aaa", fontWeight: 400 }}>
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
                className={`flex items-center justify-center w-8 h-8 rounded-lg border text-[12px] font-semibold transition-all
                  ${page === n
                    ? "bg-[#1a73e8] border-[#1a73e8] text-white"
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

export default OrdersTable;
