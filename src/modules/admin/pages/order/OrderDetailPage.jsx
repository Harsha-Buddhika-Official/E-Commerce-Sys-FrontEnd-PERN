import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderDetail } from "../../features/orders/hooks/useOrderDetail";
import { useChangeOrderStatus } from "../../features/orders/hooks/useChangeOrderStatus";
import { useOrderReceipt } from "../../features/orders/hooks/useOrderReceipt";
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
import ReceiptLongOutlinedIcon      from "@mui/icons-material/ReceiptLongOutlined";
import OpenInNewOutlinedIcon        from "@mui/icons-material/OpenInNewOutlined";
import InsertDriveFileOutlinedIcon  from "@mui/icons-material/InsertDriveFileOutlined";
import { formatDate }               from "../../../../utils/dateFormatters";
import { SORA, INTER }              from "../../../../styles/fonts";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending_payment: { bg: "#fef9c3", color: "#ca8a04", border: "#fde047", label: "Pending Payment" },
  pending:    { bg: "#fef9c3", color: "#ca8a04", border: "#fde047", label: "Pending"    },
  paid:       { bg: "#dcfce7", color: "#16a34a", border: "#86efac", label: "Paid"        },
  processing: { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd", label: "Processing" },
  shipped:    { bg: "#fef3c7", color: "#d97706", border: "#facc15", label: "Shipped"    },
  delivered:  { bg: "#d1fae5", color: "#059669", border: "#34d399", label: "Delivered"  },
  cancelled:  { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5", label: "Cancelled"  },
};

const STATUS_OPTIONS = ["pending_payment", "pending", "paid", "processing", "shipped", "delivered", "cancelled"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (amount) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 2 }).format(Number(amount) || 0);

const isPdfUrl = (url) => typeof url === "string" && url.toLowerCase().endsWith(".pdf");

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

// ─── Status badge ─────────────────────────────────────────────────────────────
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

      {/* ── Section header with inline loading indicator ── */}
      <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-[#f0f0f0]">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
            style={{ backgroundColor: "#f5f5f5", color: "#111" }}
          >
            <LocalShippingOutlinedIcon style={{ fontSize: 16 }} />
          </div>
          <span style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111", letterSpacing: "0.02em" }}>
            Order Status
          </span>
        </div>
        {disabled && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: "#f5f5f5", border: "1px solid #ebebeb" }}>
            <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
            <span style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#888" }}>Updating…</span>
          </div>
        )}
      </div>

      {/* ── Glass overlay — blocks all clicks while loading ── */}
      {disabled && (
        <div
          className="absolute rounded-xl"
          style={{
            inset: "52px 0 0 0", // sits below the header row, covers only buttons area
            zIndex: 10,
            backgroundColor: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(1px)",
            cursor: "not-allowed",
          }}
        />
      )}

      {/* ── Current status pill (dropdown trigger) ── */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl mb-4 border transition-all"
        style={{
          backgroundColor: cfg.bg,
          borderColor: cfg.border,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.65 : 1,
        }}
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
            transform: open && !disabled ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>

      {/* ── Dropdown options ── */}
      {open && !disabled && (
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
                onClick={() => { onStatusChange(s); setOpen(false); }}
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

      {/* ── Quick-action buttons ── */}
      <div className="flex flex-col gap-2 mt-3">
        {STATUS_OPTIONS.filter(s => s !== currentStatus).map((s) => {
          const c = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => { if (!disabled) onStatusChange(s); }}
              disabled={disabled}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all"
              style={{
                ...INTER,
                fontSize: 12,
                fontWeight: 700,
                backgroundColor: c.bg,
                color: c.color,
                borderColor: c.border,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
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

// ─── Payment receipt card ──────────────────────────────────────────────────────
// function PaymentReceiptCard({ receipt, loading, error }) {
//   return (
    
//     <SectionCard>
//       <SectionTitle icon={<ReceiptLongOutlinedIcon style={{ fontSize: 16 }} />}>
//         Payment Receipt
//       </SectionTitle>

//       {loading && (
//         <p style={{ ...INTER, fontSize: 12, color: "#aaa", fontWeight: 500 }}>Loading receipt…</p>
//       )}

//       {!loading && error && (
//         <p style={{ ...INTER, fontSize: 12, color: "#dc2626", fontWeight: 500 }}>Failed to load receipt.</p>
//       )}

//       {!loading && !error && !receipt?.media_url && (
//         <div
//           className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl"
//           style={{ backgroundColor: "#f9f9f9", border: "1px dashed #e5e5e5" }}
//         >
//           <InsertDriveFileOutlinedIcon style={{ fontSize: 28, color: "#ccc" }} />
//           <p style={{ ...INTER, fontSize: 12, color: "#bbb", fontWeight: 600 }}>No receipt uploaded</p>
//         </div>
//       )}

//       {!loading && !error && receipt?.media_url && (
//         <div className="flex flex-col gap-3">
//           <div
//             className="flex items-center justify-center rounded-xl overflow-hidden"
//             style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0", minHeight: 160 }}
//           >
//             {isPdfUrl(receipt.media_url) ? (
//               <div className="flex flex-col items-center gap-2 py-8">
//                 <InsertDriveFileOutlinedIcon style={{ fontSize: 36, color: "#e53935" }} />
//                 <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#555" }}>PDF Document</span>
//               </div>
//             ) : (
//               <img src={receipt.media_url} alt="Payment receipt" className="w-full max-h-64 object-contain" />
//             )}
//           </div>
//           <a
//             href={receipt.media_url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer hover:opacity-80 no-underline"
//             style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: "#111", color: "#fff", border: "none" }}
//           >
//             <OpenInNewOutlinedIcon style={{ fontSize: 15 }} /> Open Full Receipt
//           </a>
//           {receipt.created_at && (
//             <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500, textAlign: "center" }}>
//               Uploaded {formatDate(receipt.created_at)}
//             </p>
//           )}
//         </div>
//       )}
//     </SectionCard>
//   );
// }

function PaymentReceiptCard({ receipt, loading, error, orderId }) {
  const navigate = useNavigate();

  return (
    <SectionCard>
      <SectionTitle icon={<ReceiptLongOutlinedIcon style={{ fontSize: 16 }} />}>
        Payment Receipt
      </SectionTitle>

      {loading && (
        <p style={{ ...INTER, fontSize: 12, color: "#aaa", fontWeight: 500 }}>Loading receipt…</p>
      )}

      {!loading && error && (
        <p style={{ ...INTER, fontSize: 12, color: "#dc2626", fontWeight: 500 }}>Failed to load receipt.</p>
      )}

      {!loading && !error && !receipt?.media_url && (
        <div
          className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl"
          style={{ backgroundColor: "#f9f9f9", border: "1px dashed #e5e5e5" }}
        >
          <InsertDriveFileOutlinedIcon style={{ fontSize: 28, color: "#ccc" }} />
          <p style={{ ...INTER, fontSize: 12, color: "#bbb", fontWeight: 600 }}>No receipt uploaded</p>
        </div>
      )}

      {!loading && !error && receipt?.media_url && (
        <div className="flex flex-col gap-3">
          {/* ── Thumbnail preview ── */}
          <div
            className="flex items-center justify-center rounded-xl overflow-hidden cursor-pointer transition-all hover:opacity-80"
            style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0", minHeight: 160 }}
            onClick={() => navigate(`/admin/orders/${orderId}/receipt`)}
          >
            {isPdfUrl(receipt.media_url) ? (
              <div className="flex flex-col items-center gap-2 py-8">
                <InsertDriveFileOutlinedIcon style={{ fontSize: 40, color: "#e53935" }} />
                <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#555" }}>PDF Document</span>
                <span style={{ ...INTER, fontSize: 11, color: "#aaa" }}>Click to view</span>
              </div>
            ) : (
              <img
                src={receipt.media_url}
                alt="Payment receipt"
                className="w-full max-h-64 object-contain"
              />
            )}
          </div>

          {/* ── Open button ── */}
          <button
            onClick={() => navigate(`/admin/orders/${orderId}/receipt`)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer hover:opacity-80"
            style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: "#111", color: "#fff", border: "none" }}
          >
            <OpenInNewOutlinedIcon style={{ fontSize: 15 }} /> Open Full Receipt
          </button>

          {receipt.created_at && (
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500, textAlign: "center" }}>
              Uploaded {formatDate(receipt.created_at)}
            </p>
          )}
        </div>
      )}
    </SectionCard>
  );
}

// ─── Product item row ─────────────────────────────────────────────────────────
function ProductItem({ item }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}>
      <div
        className="flex items-center justify-center rounded-xl overflow-hidden shrink-0"
        style={{ width: 70, height: 70, backgroundColor: "#f0f0f0", border: "1px solid #ebebeb" }}
      >
        {item.image
          ? <img src={item.image} alt={item.product_name} className="w-full h-full object-contain p-1" />
          : <InventoryOutlinedIcon style={{ fontSize: 28, color: "#ccc" }} />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className="leading-snug line-clamp-2 mb-1" style={{ ...SORA, fontSize: 13, fontWeight: 800, color: "#111" }}>
              {item.product_name}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md" style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#f0f0f0", color: "#555" }}>
                {item.brand_name}
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#f0f0f0", color: "#555" }}>
                <CategoryOutlinedIcon style={{ fontSize: 11 }} />{item.category_name}
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#dcfce7", color: "#16a34a" }}>
                <VerifiedOutlinedIcon style={{ fontSize: 11 }} />{item.warranty_months}m Warranty
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5 shrink-0">
            <span style={{ ...SORA, fontSize: 15, fontWeight: 900, color: "#e53935" }}>{fmt(item.price_at_purchase)}</span>
            <span style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Qty: {item.quantity}</span>
            <span style={{ ...INTER, fontSize: 11, color: "#111", fontWeight: 600 }}>Subtotal: {fmt(Number(item.price_at_purchase) * item.quantity)}</span>
          </div>
        </div>
        <p className="mt-2" style={{ ...INTER, fontSize: 10, color: "#ccc", fontWeight: 500 }}>Product ID #{item.product_id}</p>
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
  const { receipt, loading: receiptLoading, error: receiptError, fetchReceipt } = useOrderReceipt();

  const displayOrder = fetchedOrder || orderProp || {};
  const [manualStatus, setManualStatus] = useState(null);
  const orderStatus = manualStatus ?? displayOrder.order_status ?? "pending";

  useEffect(() => {
    if (displayOrder?.order_id) {
      fetchReceipt(displayOrder.order_id);
    }
  }, [displayOrder?.order_id, fetchReceipt]);

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

  const handleStatusChange = async (newStatus) => {
    if (!displayOrder?.order_id || statusUpdating) return;
    try {
      await changeStatus(displayOrder.order_id, newStatus);
      window.location.reload();
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
            onClick={() => { if (onBack) return onBack(); navigate(-1); }}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer"
          >
            <ArrowBackOutlinedIcon style={{ fontSize: 18 }} />
          </button>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Orders / #{displayOrder.order_id}</p>
            <div className="flex items-center gap-2.5 mt-0.5">
              <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
                Order #{displayOrder.order_id}
              </h1>
              <StatusBadge status={orderStatus} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border" style={{ backgroundColor: "#f9f9f9", borderColor: "#ebebeb" }}>
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

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ══ Left + centre ══ */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* Summary banner */}
          <div
            className="flex items-center justify-between flex-wrap gap-4 px-6 py-4 rounded-2xl"
            style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
          >
            {[
              { label: "Total Amount", value: fmt(displayOrder.total_amount), large: true },
              { label: "Items",        value: `${totalItems} item${totalItems !== 1 ? "s" : ""}` },
              { label: "Products",     value: `${items.length} SKU${items.length !== 1 ? "s" : ""}` },
              { label: "Order Date",   value: formatDate(displayOrder.created_at).split("  ")[0] },
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

          {/* Ordered products */}
          <SectionCard>
            <SectionTitle icon={<InventoryOutlinedIcon style={{ fontSize: 16 }} />}>
              Ordered Products ({items.length})
            </SectionTitle>
            <div className="flex flex-col gap-3">
              {items.map((item) => <ProductItem key={item.product_id} item={item} />)}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f0f0f0]">
              <span style={{ ...SORA, fontSize: 13, fontWeight: 800, color: "#111" }}>Order Total</span>
              <span style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#e53935", letterSpacing: "-0.5px" }}>
                {fmt(displayOrder.total_amount)}
              </span>
            </div>
          </SectionCard>

          {/* Customer + Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SectionCard>
              <SectionTitle icon={<PersonOutlinedIcon style={{ fontSize: 16 }} />}>Customer Info</SectionTitle>
              <InfoRow label="Name"  value={displayOrder.full_name}      copyable />
              <InfoRow label="Email" value={displayOrder.customer_email} copyable />
              <InfoRow label="Phone" value={displayOrder.phone_number}   copyable />
            </SectionCard>
            <SectionCard>
              <SectionTitle icon={<LocationOnOutlinedIcon style={{ fontSize: 16 }} />}>Shipping Address</SectionTitle>
              <InfoRow label="Address"     value={displayOrder.shipping_address} />
              <InfoRow label="City"        value={displayOrder.city}             />
              <InfoRow label="Postal Code" value={displayOrder.postal_code}      />
            </SectionCard>
          </div>

          {/* Order meta */}
          <SectionCard>
            <SectionTitle icon={<ReceiptOutlinedIcon style={{ fontSize: 16 }} />}>Order Details</SectionTitle>
            <InfoRow label="Order ID"      value={`#${displayOrder.order_id}`}    copyable />
            <InfoRow label="Tracking Code" value={displayOrder.tracking_code}     copyable mono />
            <InfoRow label="Total Amount"  value={fmt(displayOrder.total_amount)} accent />
            <InfoRow label="Created At"    value={formatDate(displayOrder.created_at)} />
            <InfoRow label="Updated At"    value={formatDate(displayOrder.updated_at)} />
          </SectionCard>
        </div>

        {/* ══ Right panel ══ */}
        <div className="flex flex-col gap-5">

          {/* Status changer */}
          <SectionCard className="relative overflow-visible">
            <StatusChanger
              currentStatus={orderStatus}
              onStatusChange={handleStatusChange}
              disabled={statusUpdating}
            />
          </SectionCard>

          {/* Payment receipt */}
          <PaymentReceiptCard
            receipt={receipt}
            loading={receiptLoading}
            error={receiptError}
            orderId={displayOrder.order_id}
          />

          {/* Timeline */}
          <SectionCard>
            <SectionTitle icon={<AccessTimeOutlinedIcon style={{ fontSize: 16 }} />}>Order Timeline</SectionTitle>
            <div className="flex flex-col gap-0">
              {[
                { label: "Order Placed", date: displayOrder.created_at, done: true },
                { label: "Processing",   date: ["processing","shipped","delivered"].includes(orderStatus) ? displayOrder.updated_at : null, done: ["processing","shipped","delivered"].includes(orderStatus) },
                { label: "Shipped",      date: ["shipped","delivered"].includes(orderStatus) ? displayOrder.updated_at : null,              done: ["shipped","delivered"].includes(orderStatus) },
                { label: "Delivered",    date: orderStatus === "delivered" ? displayOrder.updated_at : null,                                done: orderStatus === "delivered" },
              ].map(({ label, date, done }, i, arr) => (
                <div key={label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="flex items-center justify-center w-7 h-7 rounded-full shrink-0 border-2 transition-all duration-300"
                      style={{ backgroundColor: done ? "#111" : "#f5f5f5", borderColor: done ? "#111" : "#e5e5e5" }}
                    >
                      {done && <CheckCircleOutlinedIcon style={{ fontSize: 14, color: "#fff" }} />}
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-0.5 flex-1 my-1 transition-all duration-300" style={{ backgroundColor: done ? "#111" : "#ebebeb", minHeight: 20 }} />
                    )}
                  </div>
                  <div className="pb-4 min-w-0 flex-1">
                    <p style={{ ...INTER, fontSize: 13, fontWeight: done ? 700 : 500, color: done ? "#111" : "#bbb" }}>{label}</p>
                    {date && <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 400, marginTop: 2 }}>{formatDate(date)}</p>}
                  </div>
                </div>
              ))}
              {orderStatus === "cancelled" && (
                <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#dc2626" }}>Order Cancelled</span>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Summary */}
          <SectionCard>
            <SectionTitle icon={<ReceiptOutlinedIcon style={{ fontSize: 16 }} />}>Summary</SectionTitle>
            {[
              { label: "Products",    value: `${items.length} SKU${items.length !== 1 ? "s" : ""}` },
              { label: "Total Items", value: `${totalItems} unit${totalItems !== 1 ? "s" : ""}` },
              { label: "Order Total", value: fmt(displayOrder.total_amount), accent: true },
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