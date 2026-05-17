import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderDetail } from "../features/orders/hooks/useOrderDetail";
import { useChangeOrderStatus } from "../features/orders/hooks/useChangeOrderStatus";
import ArrowBackOutlinedIcon        from "@mui/icons-material/ArrowBackOutlined";
import ContentCopyOutlinedIcon      from "@mui/icons-material/ContentCopyOutlined";
import CheckCircleOutlinedIcon      from "@mui/icons-material/CheckCircleOutlined";
import LocalShippingOutlinedIcon    from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlinedIcon           from "@mui/icons-material/PersonOutlined";
import LocationOnOutlinedIcon       from "@mui/icons-material/LocationOnOutlined";
import ReceiptOutlinedIcon          from "@mui/icons-material/ReceiptOutlined";
import InventoryOutlinedIcon        from "@mui/icons-material/InventoryOutlined";
import VerifiedOutlinedIcon         from "@mui/icons-material/VerifiedOutlined";
import CategoryOutlinedIcon         from "@mui/icons-material/CategoryOutlined";
import KeyboardArrowDownIcon        from "@mui/icons-material/KeyboardArrowDown";
import AccessTimeOutlinedIcon       from "@mui/icons-material/AccessTimeOutlined";
import TagOutlinedIcon              from "@mui/icons-material/TagOutlined";

// ─── Font constants — leaf elements only, never on wrapper divs ───────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// NOTE: mock data removed — page fetches real order data from API via `useOrderDetail`.

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:    { bg: "#fef9c3", color: "#ca8a04", border: "#fde047", label: "Pending"    },
  paid:       { bg: "#dcfce7", color: "#16a34a", border: "#86efac", label: "Paid"        },
  processing: { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd", label: "Processing" },
  shipped:    { bg: "#fef3c7", color: "#d97706", border: "#facc15", label: "Shipped"    },
  delivered:  { bg: "#d1fae5", color: "#059669", border: "#34d399", label: "Delivered"  },
  cancelled:  { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5", label: "Cancelled"  },
};

const STATUS_OPTIONS = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (amount) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 2 }).format(Number(amount) ?? 0);

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    "  " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 ${className}`}
      style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#f0f0f0]">
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
        style={{ backgroundColor: "#f5f5f5", color: "#111" }}
      >
        {icon}
      </div>
      <span style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111", letterSpacing: "0.02em" }}>
        {children}
      </span>
    </div>
  );
}

function InfoRow({ label, value, accent = false, copyable = false, mono = false }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(String(value ?? ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#f8f8f8] last:border-0">
      <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa", flexShrink: 0, minWidth: 140 }}>
        {label}
      </span>
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="text-right break-all"
          style={{
            ...INTER,
            fontSize: mono ? 12 : 13,
            fontWeight: 600,
            color: accent ? "#e53935" : "#111",
            fontFamily: mono ? "'Courier New', monospace" : INTER.fontFamily,
            letterSpacing: mono ? "0.03em" : 0,
          }}
        >
          {value ?? "—"}
        </span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="shrink-0 flex items-center justify-center w-5 h-5 rounded-md bg-transparent border-none cursor-pointer text-gray-300 hover:text-gray-600 transition-colors"
          >
            {copied
              ? <CheckCircleOutlinedIcon style={{ fontSize: 14, color: "#16a34a" }} />
              : <ContentCopyOutlinedIcon style={{ fontSize: 13 }} />
            }
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Status badge (inline display) ───────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{
        ...INTER,
        fontSize: 12,
        fontWeight: 700,
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
      {cfg.label}
    </span>
  );
}

// ─── Status changer ───────────────────────────────────────────────────────────
function StatusChanger({ currentStatus, onStatusChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;

  return (
    <div className="relative">
      <SectionTitle icon={<LocalShippingOutlinedIcon style={{ fontSize: 16 }} />}>
        Order Status
      </SectionTitle>

      {/* Current status display */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl mb-4 cursor-pointer border transition-all"
        style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
        onClick={() => { if (!disabled) setOpen((p) => !p); }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
          <span style={{ ...SORA, fontSize: 14, fontWeight: 800, color: cfg.color }}>
            {cfg.label}
          </span>
        </div>
        <KeyboardArrowDownIcon
          style={{
            fontSize: 20,
            color: cfg.color,
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>

      {/* Dropdown options */}
      {open && (
        <div
          className="absolute left-0 right-0 z-30 bg-white rounded-2xl overflow-hidden flex flex-col"
          style={{ top: "calc(100% - 8px)", border: "1px solid #f0f0f0", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
        >
          {STATUS_OPTIONS.map((s) => {
            const c = STATUS_CONFIG[s];
            const isActive = s === currentStatus;
            return (
              <button
                key={s}
                onClick={() => { if (!disabled) { onStatusChange(s); setOpen(false); } }}
                className="flex items-center gap-3 px-4 py-3 border-none cursor-pointer transition-all hover:bg-gray-50 text-left"
                style={{
                  backgroundColor: isActive ? c.bg : "transparent",
                  borderLeft: isActive ? `3px solid ${c.color}` : "3px solid transparent",
                }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span style={{ ...INTER, fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? c.color : "#555" }}>
                  {c.label}
                </span>
                {isActive && (
                  <CheckCircleOutlinedIcon style={{ fontSize: 16, color: c.color, marginLeft: "auto" }} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Status change buttons */}
      <div className="flex flex-col gap-2 mt-3">
        {STATUS_OPTIONS.filter(s => s !== currentStatus).map((s) => {
          const c = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => { if (!disabled) onStatusChange(s); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all cursor-pointer hover:opacity-80"
              style={{
                ...INTER,
                fontSize: 12,
                fontWeight: 700,
                backgroundColor: c.bg,
                color: c.color,
                borderColor: c.border,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
              Mark as {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Product item row ─────────────────────────────────────────────────────────
function ProductItem({ item, index }) {
  return (
    <div
      className="flex items-start gap-4 p-4 rounded-xl"
      style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
    >
      {/* Image / placeholder */}
      <div
        className="flex items-center justify-center rounded-xl overflow-hidden shrink-0"
        style={{ width: 70, height: 70, backgroundColor: "#f0f0f0", border: "1px solid #ebebeb" }}
      >
        {item.image ? (
          <img src={item.image} alt={item.product_name} className="w-full h-full object-contain p-1" />
        ) : (
          <InventoryOutlinedIcon style={{ fontSize: 28, color: "#ccc" }} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p
              className="leading-snug line-clamp-2 mb-1"
              style={{ ...SORA, fontSize: 13, fontWeight: 800, color: "#111" }}
            >
              {item.product_name}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-2 py-0.5 rounded-md"
                style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#f0f0f0", color: "#555" }}
              >
                {item.brand_name}
              </span>
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#f0f0f0", color: "#555" }}
              >
                <CategoryOutlinedIcon style={{ fontSize: 11 }} />
                {item.category_name}
              </span>
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#dcfce7", color: "#16a34a" }}
              >
                <VerifiedOutlinedIcon style={{ fontSize: 11 }} />
                {item.warranty_months}m Warranty
              </span>
            </div>
          </div>

          {/* Price + qty */}
          <div className="flex flex-col items-end gap-0.5 shrink-0">
            <span style={{ ...SORA, fontSize: 15, fontWeight: 900, color: "#e53935" }}>
              {fmt(item.price_at_purchase)}
            </span>
            <span style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
              Qty: {item.quantity}
            </span>
            <span style={{ ...INTER, fontSize: 11, color: "#111", fontWeight: 600 }}>
              Subtotal: {fmt(Number(item.price_at_purchase) * item.quantity)}
            </span>
          </div>
        </div>

        {/* Product ID */}
        <p className="mt-2" style={{ ...INTER, fontSize: 10, color: "#ccc", fontWeight: 500 }}>
          Product ID #{item.product_id}
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ORDER DETAIL PAGE
// ══════════════════════════════════════════════════════════════════════════════

const OrderDetailPage = ({
  order: orderProp = null,
  onBack = null,
  onStatusChange = () => {},
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const orderId = id ?? (orderProp?.order_id ? String(orderProp.order_id) : null);

  const { order: fetchedOrder, loading, error, refresh } = useOrderDetail(orderId);
  const { changeStatus, loading: statusUpdating } = useChangeOrderStatus();
  const displayOrder = fetchedOrder || orderProp || {};

  if (!loading && !displayOrder?.order_id) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #eee" }}>
          <p style={{ ...INTER, fontSize: 16, fontWeight: 700, color: "#111" }}>Order not found</p>
          <p style={{ ...INTER, fontSize: 13, color: "#666", marginTop: 8 }}>No order data was returned for ID {orderId}</p>
          <div className="mt-4 flex gap-2">
            <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border">Go back</button>
            <button onClick={() => refresh()} className="px-4 py-2 rounded-lg bg-[#1a73e8] text-white">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const [orderStatus, setOrderStatus] = useState(displayOrder.order_status || "pending");

  useEffect(() => {
    setOrderStatus(displayOrder.order_status || "pending");
  }, [displayOrder.order_status]);

  const handleStatusChange = async (newStatus) => {
    if (!displayOrder?.order_id) return;
    if (statusUpdating) return;

    try {
      const result = await changeStatus(displayOrder.order_id, newStatus);
      const updated = result?.data ?? null;
      const serverStatus = updated?.order_status ?? updated?.orderStatus ?? null;

      // set status from server or fallback to requested status
      setOrderStatus(serverStatus || newStatus);

      // refresh to ensure full record sync (best-effort)
      try { await refresh(); } catch {}
      try { onStatusChange(displayOrder.order_id, newStatus); } catch {}
      console.log(`Order #${displayOrder.order_id} status → ${newStatus}`);
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const items = displayOrder.items || [];
  const totalItems = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const cfg = STATUS_CONFIG[orderStatus] || STATUS_CONFIG.pending;

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="bg-white/90 rounded-xl p-6">Loading order…</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="bg-white/90 rounded-xl p-6 text-red-600">Error loading order: {error.message}</div>
        </div>
      )}

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (onBack) return onBack();
              navigate(-1);
            }}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer"
          >
            <ArrowBackOutlinedIcon style={{ fontSize: 18 }} />
          </button>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
              Orders / #{displayOrder.order_id}
            </p>
            <div className="flex items-center gap-2.5 mt-0.5">
              <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
                Order #{displayOrder.order_id}
              </h1>
              <StatusBadge status={orderStatus} />
            </div>
          </div>
        </div>

        {/* Tracking code pill */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl border"
          style={{ backgroundColor: "#f9f9f9", borderColor: "#ebebeb" }}
        >
          <TagOutlinedIcon style={{ fontSize: 15, color: "#aaa" }} />
          <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#555", letterSpacing: "0.04em" }}>
            {displayOrder.tracking_code}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(displayOrder.tracking_code)}
            className="bg-transparent border-none cursor-pointer text-gray-300 hover:text-gray-600 transition-colors"
          >
            <ContentCopyOutlinedIcon style={{ fontSize: 13 }} />
          </button>
        </div>
      </div>

      {/* ── Main 3-col grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ══ LEFT + CENTRE (col-span-2) ══ */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* Order summary banner */}
          <div
            className="flex items-center justify-between flex-wrap gap-4 px-6 py-4 rounded-2xl"
            style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
          >
            {[
              { label: "Total Amount",  value: fmt(displayOrder.total_amount), large: true },
              { label: "Items",         value: `${totalItems} item${totalItems !== 1 ? "s" : ""}` },
              { label: "Products",      value: `${items.length} SKU${items.length !== 1 ? "s" : ""}` },
              { label: "Order Date",    value: formatDate(displayOrder.created_at).split("  ")[0] },
            ].map(({ label, value, large }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span style={{ ...INTER, fontSize: 11, fontWeight: 600, color: cfg.color, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {label}
                </span>
                <span style={{ ...SORA, fontSize: large ? 22 : 16, fontWeight: 900, color: cfg.color, letterSpacing: large ? "-0.5px" : 0 }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Products in this order */}
          <SectionCard>
            <SectionTitle icon={<InventoryOutlinedIcon style={{ fontSize: 16 }} />}>
              Ordered Products ({items.length})
            </SectionTitle>

            <div className="flex flex-col gap-3">
              {items.map((item, idx) => (
                <ProductItem key={item.product_id} item={item} index={idx} />
              ))}
            </div>

            {/* Order total row */}
            <div
              className="flex items-center justify-between mt-4 pt-4 border-t border-[#f0f0f0]"
            >
              <span style={{ ...SORA, fontSize: 13, fontWeight: 800, color: "#111" }}>
                Order Total
              </span>
              <span style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#e53935", letterSpacing: "-0.5px" }}>
                {fmt(displayOrder.total_amount)}
              </span>
            </div>
          </SectionCard>

          {/* Customer + Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Customer info */}
            <SectionCard>
              <SectionTitle icon={<PersonOutlinedIcon style={{ fontSize: 16 }} />}>
                Customer Info
              </SectionTitle>
              <InfoRow label="Email"  value={displayOrder.customer_email} copyable />
              <InfoRow label="Phone"  value={displayOrder.phone_number}   copyable />
            </SectionCard>

            {/* Shipping address */}
            <SectionCard>
              <SectionTitle icon={<LocationOnOutlinedIcon style={{ fontSize: 16 }} />}>
                Shipping Address
              </SectionTitle>
              <InfoRow label="Address"     value={displayOrder.shipping_address} />
              <InfoRow label="City"        value={displayOrder.city}             />
              <InfoRow label="Postal Code" value={displayOrder.postal_code}      />
            </SectionCard>
          </div>

          {/* Order meta */}
          <SectionCard>
            <SectionTitle icon={<ReceiptOutlinedIcon style={{ fontSize: 16 }} />}>
              Order Details
            </SectionTitle>
            <InfoRow label="Order ID"      value={`#${displayOrder.order_id}`}   copyable />
            <InfoRow label="Tracking Code" value={displayOrder.tracking_code}    copyable mono />
            <InfoRow label="Total Amount"  value={fmt(displayOrder.total_amount)} accent />
            <InfoRow label="Created At"    value={formatDate(displayOrder.created_at)} />
            <InfoRow label="Updated At"    value={formatDate(displayOrder.updated_at)} />
          </SectionCard>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="flex flex-col gap-5">

          {/* Status changer */}
          <SectionCard className="relative overflow-visible">
            <StatusChanger
              currentStatus={orderStatus}
              onStatusChange={handleStatusChange}
              disabled={statusUpdating}
            />
          </SectionCard>

          {/* Timeline */}
          <SectionCard>
            <SectionTitle icon={<AccessTimeOutlinedIcon style={{ fontSize: 16 }} />}>
              Order Timeline
            </SectionTitle>
            <div className="flex flex-col gap-0">
              {[
                { label: "Order Placed",  date: displayOrder.created_at, done: true },
                { label: "Processing",    date: ["processing","shipped","delivered"].includes(orderStatus) ? displayOrder.updated_at : null, done: ["processing","shipped","delivered"].includes(orderStatus) },
                { label: "Shipped",       date: ["shipped","delivered"].includes(orderStatus) ? displayOrder.updated_at : null, done: ["shipped","delivered"].includes(orderStatus) },
                { label: "Delivered",     date: orderStatus === "delivered" ? displayOrder.updated_at : null, done: orderStatus === "delivered" },
              ].map(({ label, date, done }, i, arr) => (
                <div key={label} className="flex gap-3">
                  {/* Dot + line */}
                  <div className="flex flex-col items-center">
                    <div
                      className="flex items-center justify-center w-7 h-7 rounded-full shrink-0 border-2 transition-all duration-300"
                      style={{
                        backgroundColor: done ? "#111"     : "#f5f5f5",
                        borderColor:     done ? "#111"     : "#e5e5e5",
                      }}
                    >
                      {done && <CheckCircleOutlinedIcon style={{ fontSize: 14, color: "#fff" }} />}
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        className="w-0.5 flex-1 my-1 transition-all duration-300"
                        style={{ backgroundColor: done ? "#111" : "#ebebeb", minHeight: 20 }}
                      />
                    )}
                  </div>
                  {/* Label + date */}
                  <div className="pb-4 min-w-0 flex-1">
                    <p style={{ ...INTER, fontSize: 13, fontWeight: done ? 700 : 500, color: done ? "#111" : "#bbb" }}>
                      {label}
                    </p>
                    {date && (
                      <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 400, marginTop: 2 }}>
                        {formatDate(date)}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Cancelled state override */}
              {orderStatus === "cancelled" && (
                <div
                  className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl"
                  style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#dc2626" }}>
                    Order Cancelled
                  </span>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Quick stats */}
          <SectionCard>
            <SectionTitle icon={<ReceiptOutlinedIcon style={{ fontSize: 16 }} />}>
              Summary
            </SectionTitle>
            {[
              { label: "Products",     value: `${items.length} SKU${items.length !== 1 ? "s" : ""}` },
              { label: "Total Items",  value: `${totalItems} unit${totalItems !== 1 ? "s" : ""}` },
              { label: "Order Total",  value: fmt(displayOrder.total_amount), accent: true },
            ].map(({ label, value, accent }) => (
              <InfoRow key={label} label={label} value={value} accent={accent} />
            ))}
          </SectionCard>

        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
