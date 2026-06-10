import { useState }                from "react";
import LocalShippingOutlinedIcon   from "@mui/icons-material/LocalShippingOutlined";
import EmailOutlinedIcon           from "@mui/icons-material/EmailOutlined";
import TagOutlinedIcon             from "@mui/icons-material/TagOutlined";
import WarningAmberOutlinedIcon    from "@mui/icons-material/WarningAmberOutlined";
import InventoryOutlinedIcon       from "@mui/icons-material/InventoryOutlined";
import ReceiptOutlinedIcon         from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon   from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlinedIcon     from "@mui/icons-material/CheckCircleOutlined";
import SearchOutlinedIcon          from "@mui/icons-material/SearchOutlined";
import { useTrackOrder }           from "../features/orders/hooks/useTrackerOrder";

// ─── Font constants — leaf elements only ──────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Status config — lowercase keys to match API ──────────────────────────────
const STATUS_CONFIG = {
  pending:    { label: "Pending",    bg: "#fef9c3", color: "#ca8a04", border: "#fde047" },
  paid:       { label: "paid",       bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" },
  processing: { label: "Processing", bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" },
  shipped:    { label: "Shipped",    bg: "#f3e8ff", color: "#7c3aed", border: "#c4b5fd" },
  delivered:  { label: "Delivered",  bg: "#dcfce7", color: "#16a34a", border: "#86efac" },
  cancelled:  { label: "Cancelled",  bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" },
};

const getStatusCfg = (s) =>
  STATUS_CONFIG[s?.toLowerCase?.()] || { label: s || "Unknown", bg: "#f5f5f5", color: "#555", border: "#e5e5e5" };

// ─── Timeline ─────────────────────────────────────────────────────────────────
const TIMELINE_STEPS = ["pending", "processing", "shipped", "delivered"];
const getStepIndex   = (s) => TIMELINE_STEPS.indexOf(s?.toLowerCase?.() ?? "");

// ─── Formatter ────────────────────────────────────────────────────────────────
const fmtLKR = (n) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 2 }).format(Number(n) || 0);

const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

// ─── Shared input style ───────────────────────────────────────────────────────
const inputBase = (focused, mono = false) => ({
  ...INTER,
  fontSize: 13, fontWeight: 500, color: "#111",
  padding: "11px 14px 11px 40px",
  borderRadius: 12,
  border: `1.5px solid ${focused ? "#111" : "#e5e7eb"}`,
  backgroundColor: focused ? "#fff" : "#f9f9f9",
  outline: "none", width: "100%", transition: "all 0.15s",
  ...(mono ? { fontFamily: "'Courier New', monospace", letterSpacing: "0.04em" } : {}),
});

// ══════════════════════════════════════════════════════════════════════════════
export default function TrackOrderPage() {
  const [form,        setForm]        = useState({ email: "", trackingCode: "" });
  const [emailFocus,  setEmailFocus]  = useState(false);
  const [trackFocus,  setTrackFocus]  = useState(false);

  const { order, loading, error, trackOrder } = useTrackOrder();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.trackingCode.trim()) return;
    await trackOrder({ email: form.email.trim(), trackingCode: form.trackingCode.trim() });
  };

  // Derived values
  const statusCfg  = order ? getStatusCfg(order.order_status) : null;
  const stepIdx    = order ? getStepIndex(order.order_status) : -1;
  const isCancelled = order?.order_status?.toLowerCase() === "cancelled";
  const orderTotal = order?.items?.reduce((s, i) => s + (i.price_at_purchase * i.quantity), 0) ?? 0;

  return (
    <div
      className="w-full min-h-screen px-4 py-14"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      {/* ── Page header ── */}
      <div className="flex flex-col items-center text-center mb-10">
        <div
          className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5 flex-shrink-0"
          style={{ backgroundColor: "#111" }}
        >
          <LocalShippingOutlinedIcon style={{ fontSize: 26, color: "#fff" }} />
        </div>
        <h1 style={{ ...SORA, fontSize: 34, fontWeight: 900, color: "#111", letterSpacing: "-1px", margin: 0, lineHeight: 1.15 }}>
          Track Your Order
        </h1>
        <p style={{ ...INTER, fontSize: 14, color: "#999", marginTop: 8 }}>
          Enter your email address and tracking code to view your order
        </p>
      </div>

      {/* ── Search card ── */}
      <div
        className="mx-auto w-full bg-white rounded-2xl p-6 md:p-8 mb-6"
        style={{ maxWidth: 540, border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <p
              className="mb-1.5"
              style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em" }}
            >
              Email Address <span style={{ color: "#e53935" }}>*</span>
            </p>
            <div className="relative flex items-center">
              <EmailOutlinedIcon
                style={{ fontSize: 16, color: emailFocus ? "#111" : "#bbb", position: "absolute", left: 12, pointerEvents: "none", transition: "color 0.15s" }}
              />
              <input
                type="email" name="email"
                value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                style={inputBase(emailFocus)}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
            </div>
          </div>

          {/* Tracking code */}
          <div>
            <p
              className="mb-1.5"
              style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em" }}
            >
              Tracking Code <span style={{ color: "#e53935" }}>*</span>
            </p>
            <div className="relative flex items-center">
              <TagOutlinedIcon
                style={{ fontSize: 16, color: trackFocus ? "#111" : "#bbb", position: "absolute", left: 12, pointerEvents: "none", transition: "color 0.15s" }}
              />
              <input
                type="text" name="trackingCode"
                value={form.trackingCode} onChange={handleChange}
                placeholder="TRK-20260516-D3081E"
                style={inputBase(trackFocus, true)}
                onFocus={() => setTrackFocus(true)}
                onBlur={() => setTrackFocus(false)}
              />
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
            >
              <WarningAmberOutlinedIcon style={{ fontSize: 16, color: "#e53935", flexShrink: 0, marginTop: 1 }} />
              <p style={{ ...INTER, fontSize: 12, color: "#e53935", fontWeight: 500 }}>{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !form.email.trim() || !form.trackingCode.trim()}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white transition-all cursor-pointer disabled:opacity-50"
            style={{ ...SORA, fontSize: 14, fontWeight: 700, backgroundColor: "#111", border: "none" }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#333"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Tracking…</>
              : <><SearchOutlinedIcon style={{ fontSize: 18 }} /> Track Order</>
            }
          </button>

        </form>
      </div>

      {/* ── Result section ── */}
      {order && (
        <div className="mx-auto w-full flex flex-col gap-4" style={{ maxWidth: 540 }}>

          {/* ── Status + timeline card ── */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
              <div>
                <p style={{ ...INTER, fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                  Order Status
                </p>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusCfg.color }} />
                  {statusCfg.label}
                </span>
              </div>
              <div className="text-right">
                <p style={{ ...INTER, fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                  Tracking Code
                </p>
                <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#111", fontFamily: "'Courier New', monospace", letterSpacing: "0.04em" }}>
                  {order.tracking_code}
                </p>
              </div>
            </div>

            {/* Timeline — hidden if cancelled */}
            {!isCancelled && (
              <div className="flex items-start">
                {TIMELINE_STEPS.map((step, idx) => {
                  const done    = idx <= stepIdx;
                  const isLast  = idx === TIMELINE_STEPS.length - 1;
                  const label   = step.charAt(0).toUpperCase() + step.slice(1);
                  return (
                    <div key={step} className="flex items-start" style={{ flex: isLast ? "0 0 auto" : 1 }}>
                      {/* Step */}
                      <div className="flex flex-col items-center gap-1.5" style={{ minWidth: 56 }}>
                        <div
                          className="flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-300 flex-shrink-0"
                          style={{ backgroundColor: done ? "#111" : "#f5f5f5", borderColor: done ? "#111" : "#e5e5e5" }}
                        >
                          {done && <CheckCircleOutlinedIcon style={{ fontSize: 14, color: "#fff" }} />}
                        </div>
                        <p
                          className="text-center"
                          style={{ ...INTER, fontSize: 9, fontWeight: done ? 700 : 500, color: done ? "#111" : "#bbb", lineHeight: 1.3, maxWidth: 52 }}
                        >
                          {label}
                        </p>
                      </div>
                      {/* Connector */}
                      {!isLast && (
                        <div style={{ flex: 1, height: 2, marginTop: 13, backgroundColor: idx < stepIdx ? "#111" : "#e5e5e5", transition: "background-color 0.3s" }} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Cancelled banner */}
            {isCancelled && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl"
                style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <WarningAmberOutlinedIcon style={{ fontSize: 16, color: "#dc2626" }} />
                <p style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#dc2626" }}>
                  This order has been cancelled.
                </p>
              </div>
            )}
          </div>

          {/* ── Info strip ── */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <CalendarTodayOutlinedIcon style={{ fontSize: 16 }} />, label: "Order Date",   value: fmtDate(order.created_at)    },
              { icon: <ReceiptOutlinedIcon       style={{ fontSize: 16 }} />, label: "Order Total",  value: fmtLKR(order.total_amount)   },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-white rounded-2xl px-4 py-4 flex items-center gap-3"
                style={{ border: "1px solid #ebebeb" }}
              >
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: "#f5f5f5", color: "#555" }}
                >
                  {icon}
                </div>
                <div className="min-w-0">
                  <p style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {label}
                  </p>
                  <p className="truncate" style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111", marginTop: 2 }}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order items card ── */}
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2.5 px-5 py-4"
              style={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                style={{ backgroundColor: "#111" }}
              >
                <InventoryOutlinedIcon style={{ fontSize: 16, color: "#fff" }} />
              </div>
              <p style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111" }}>
                Order Items ({order.items?.length ?? 0})
              </p>
            </div>

            {/* Items list */}
            {order.items?.map((item, i) => {
              const subtotal = item.price_at_purchase * item.quantity;
              return (
                <div
                  key={item.product_id ?? i}
                  className="flex items-start justify-between gap-3 px-5 py-4"
                  style={{ borderBottom: i < order.items.length - 1 ? "1px solid #f8f8f8" : "none" }}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
                      style={{ backgroundColor: "#f5f5f5", border: "1px solid #ebebeb", marginTop: 1 }}
                    >
                      <InventoryOutlinedIcon style={{ fontSize: 16, color: "#ccc" }} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="leading-snug"
                        style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#111" }}
                      >
                        {item.product_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className="px-2 py-0.5 rounded-md"
                          style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#f0f0f0", color: "#777" }}
                        >
                          Qty {item.quantity}
                        </span>
                        <span style={{ ...INTER, fontSize: 11, color: "#aaa" }}>
                          {fmtLKR(item.price_at_purchase)} each
                        </span>
                      </div>
                    </div>
                  </div>
                  <p
                    style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#e53935", flexShrink: 0, marginTop: 1 }}
                  >
                    {fmtLKR(subtotal)}
                  </p>
                </div>
              );
            })}

            {/* Total row */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ backgroundColor: "#f9f9f9", borderTop: "1px solid #f0f0f0" }}
            >
              <p style={{ ...SORA, fontSize: 13, fontWeight: 800, color: "#111" }}>Order Total</p>
              <p style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#e53935", letterSpacing: "-0.5px" }}>
                {fmtLKR(order.total_amount)}
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}