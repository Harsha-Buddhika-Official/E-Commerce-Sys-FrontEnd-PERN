import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Pending:    { bg: "#fef9c3", color: "#ca8a04" },
  Paid:       { bg: "#dcfce7", color: "#16a34a" },
  Processing: { bg: "#dbeafe", color: "#1d4ed8" },
  Shipped:    { bg: "#f5f3ff", color: "#7c3aed" },
  Delivered:  { bg: "#ecfeff", color: "#0e7490" },
  Cancelled:  { bg: "#fee2e2", color: "#dc2626" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Pending;
  return (
    <span
      className="inline-flex items-center px-2.5 sm:px-3 py-0.5 rounded-full whitespace-nowrap"
      style={{ ...INTER, fontSize: 12, fontWeight: 600, backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}

// ─── Column definitions ──────────────────────────────────────────────────────
const COLUMNS = [
  { key: "id",               label: "Order ID",          w: "11%" },
  { key: "product",          label: "Product",           w: "18%" },
  { key: "email",            label: "Customer email",    w: "18%" },
  { key: "date",             label: "Date",              w: "10%" },
  { key: "quantity",         label: "Quantity",          w: "8%" },
  { key: "priceAtPurchase",  label: "Price at Purchase", w: "12%" },
  { key: "amount",           label: "Total Amount",      w: "12%" },
  { key: "status",           label: "Status",            w: "11%" },
];

const STATUS_FILTERS = ["All", "Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];
const ROWS_PER_PAGE  = 16;

// ─── Grid card for grid-view mode ─────────────────────────────────────────────
function OrderCard({ order, selected, onClick }) {
  const s = STATUS_STYLE[order.status] || STATUS_STYLE.Pending;
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border cursor-pointer transition-all duration-150 p-3 sm:p-4 flex flex-col gap-2"
      style={{
        borderColor: selected ? "#1a73e8" : "#f0f0f0",
        backgroundColor: selected ? "#eff6ff" : "#fff",
        boxShadow: selected ? "0 0 0 2px #1a73e820" : "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-bold truncate"
          style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#1a73e8" }}
        >
          {order.id}
        </span>
        <span
          className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full shrink-0"
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
      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
        <span>{order.date}</span>
        <span>Qty: {order.quantity}</span>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
        <div className="flex flex-col gap-0.5 text-left">
          <span style={{ ...INTER, fontSize: 10, color: "#aaa" }}>Total</span>
          <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#111" }}>
            Rs {order.amount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── OrdersTable ──────────────────────────────────────────────────────────────
const OrdersTable = ({ orders = [] }) => {
  const [page,          setPage]          = useState(1);
  const [activeFilter,  setActiveFilter]  = useState("All");
  const [search,        setSearch]        = useState("");
  const [selectedRow,   setSelectedRow]   = useState(null);
  const [viewMode,      setViewMode]      = useState("list"); // "list" | "grid"

  // Group orders by order id
  const groupedMap = orders.reduce((acc, o) => {
    const key = String(o.id);
    if (!acc[key]) {
      acc[key] = {
        id: key,
        product: o.product,
        email: o.email,
        date: o.date,
        quantity: Number(o.quantity) || 0,
        priceAtPurchase: Number(o.priceAtPurchase) || 0,
        amount: Number(o.amount) || 0,
        status: o.status,
        itemCount: 1,
        products: [o.product],
      };
    } else {
      acc[key].quantity += Number(o.quantity) || 0;
      acc[key].amount += Number(o.amount) || 0;
      acc[key].itemCount += 1;
      if (!acc[key].products.includes(o.product)) acc[key].products.push(o.product);
      if (o.date && acc[key].date && new Date(o.date) > new Date(acc[key].date)) {
        acc[key].date = o.date;
      }
    }
    return acc;
  }, {});

  const grouped = Object.values(groupedMap).map((g) => ({
    ...g,
    product: g.products.length > 1 ? `${g.products[0]} (+${g.products.length - 1} more)` : g.products[0],
  }));

  const filtered = grouped.filter((o) => {
    const matchFilter = activeFilter === "All" ? true : o.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
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

  const navigate = useNavigate();

  const navigateToOrder = (orderId) => {
    const rawId = String(orderId).replace(/^#/, "");
    navigate(`/admin/orders/${rawId}`);
  };

  return (
    <div
      className="w-full bg-white rounded-xl sm:rounded-2xl overflow-hidden flex flex-col"
      style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[#f5f5f5]">

        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 rounded-xl border transition-all duration-150 w-full sm:w-auto"
          style={{ height: 38, minWidth: 0, maxWidth: 240, borderColor: "#e5e7eb", backgroundColor: "#fafafa" }}
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

        {/* Filter tabs — horizontally scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto sm:flex-wrap pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0" style={{ scrollbarWidth: "none" }}>
          {STATUS_FILTERS.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                className="px-3.5 sm:px-4 py-1.5 rounded-full border text-[12px] sm:text-[13px] font-semibold transition-all duration-150 whitespace-nowrap shrink-0"
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
          className="flex items-center rounded-xl overflow-hidden border self-start sm:self-auto shrink-0"
          style={{ borderColor: "#e5e7eb" }}
        >
          <button
            onClick={() => setViewMode("list")}
            className="flex items-center justify-center transition-all duration-150"
            style={{
              width: 34, height: 34,
              backgroundColor: viewMode === "list" ? "#1a73e8" : "#fff",
              color:           viewMode === "list" ? "#fff"    : "#888",
              border: "none", cursor: "pointer",
            }}
          >
            <ViewListOutlinedIcon style={{ fontSize: 17 }} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className="flex items-center justify-center transition-all duration-150"
            style={{
              width: 34, height: 34,
              backgroundColor: viewMode === "grid" ? "#1a73e8" : "#fff",
              color:           viewMode === "grid" ? "#fff"    : "#888",
              border: "none", cursor: "pointer",
              borderLeft: "1px solid #e5e7eb",
            }}
          >
            <GridViewOutlinedIcon style={{ fontSize: 16 }} />
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

            <thead>
              <tr className="border-b border-[#f0f0f0]">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={col.key === "quantity" ? "text-center" : "text-left"}
                    style={{
                      ...INTER,
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#111",
                      padding: "12px 14px",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {pageOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
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
                      onClick={() => navigateToOrder(order.id)}
                      className="border-b border-[#f5f5f5] cursor-pointer transition-colors duration-100 hover:bg-gray-50"
                      style={{ backgroundColor: isSelected ? "#eff6ff" : "transparent" }}
                    >
                      <td style={{ padding: "12px 14px", overflow: "hidden" }}>
                        <span
                          className="flex items-center gap-1"
                          style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#1a73e8" }}
                        >
                          {order.id}
                          <OpenInNewOutlinedIcon style={{ fontSize: 12, opacity: 0.6 }} />
                        </span>
                      </td>

                      <td style={{ padding: "12px 14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>
                        <span style={{ ...INTER, fontSize: 13, fontWeight: 400, color: "#333" }}>
                          {order.product}
                        </span>
                      </td>

                      <td style={{ padding: "12px 14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>
                        <span style={{ ...INTER, fontSize: 13, fontWeight: 400, color: "#555" }}>
                          {order.email}
                        </span>
                      </td>

                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ ...INTER, fontSize: 13, fontWeight: 400, color: "#555" }}>
                          {order.date}
                        </span>
                      </td>

                      <td style={{ padding: "12px 14px", textAlign: "center" }}>
                        <span style={{ ...INTER, fontSize: 13, fontWeight: 500, color: "#333" }}>
                          {order.quantity}
                        </span>
                      </td>

                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ ...INTER, fontSize: 13, fontWeight: 400, color: "#555" }}>
                          Rs {order.priceAtPurchase.toLocaleString()}
                        </span>
                      </td>

                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ ...INTER, fontSize: 13, fontWeight: 500, color: "#111" }}>
                          Rs {order.amount.toLocaleString()}
                        </span>
                      </td>

                      <td style={{ padding: "12px 14px" }}>
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
        <div className="p-3 sm:p-5 flex-1">
          {pageOrders.length === 0 ? (
            <p className="text-center text-gray-400 py-16" style={{ ...INTER, fontSize: 14 }}>
              No orders found.
            </p>
          ) : (
            <div className="grid gap-3 sm:gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
            >
              {pageOrders.map((order, idx) => (
                <OrderCard
                  key={`${order.id}-${idx}`}
                  order={order}
                  selected={selectedRow === order.id}
                  onClick={() => navigateToOrder(order.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-t border-[#f5f5f5] gap-3">
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
                className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border text-[12px] font-semibold transition-all
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

export default OrdersTable;