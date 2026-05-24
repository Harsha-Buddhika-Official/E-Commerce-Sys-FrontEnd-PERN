import { useState } from "react";
import ArrowBackOutlinedIcon        from "@mui/icons-material/ArrowBackOutlined";
import EditOutlinedIcon             from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon    from "@mui/icons-material/DeleteOutlineOutlined";
import CalendarTodayOutlinedIcon    from "@mui/icons-material/CalendarTodayOutlined";
import PercentOutlinedIcon          from "@mui/icons-material/PercentOutlined";
import AttachMoneyOutlinedIcon      from "@mui/icons-material/AttachMoneyOutlined";
import ToggleOnIcon                 from "@mui/icons-material/ToggleOn";
import ToggleOffIcon                from "@mui/icons-material/ToggleOff";
import WarningAmberOutlinedIcon     from "@mui/icons-material/WarningAmberOutlined";
import BrokenImageOutlinedIcon      from "@mui/icons-material/BrokenImageOutlined";
import AccessTimeOutlinedIcon       from "@mui/icons-material/AccessTimeOutlined";
import LocalOfferOutlinedIcon       from "@mui/icons-material/LocalOfferOutlined";
import { useOfferDetail }           from "../features/offers/hooks/useOfferDetail";

// ─── Font constants — leaf elements only ──────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    "  " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
};

const getStatus = (start, end, isActive) => {
  if (!isActive) return { label: "Inactive",  bg: "#f5f5f5", color: "#aaa",    border: "#e5e5e5" };
  const now = new Date(), s = new Date(start), e = new Date(end);
  if (now < s)   return { label: "Scheduled", bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" };
  if (now > e)   return { label: "Expired",   bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" };
  return           { label: "Active",    bg: "#dcfce7", color: "#16a34a", border: "#86efac" };
};

const daysRemaining = (end, start) => {
  const now = new Date(), s = new Date(start), e = new Date(end);
  if (now < s) {
    const d = Math.ceil((s - now) / 86400000);
    return `Starts in ${d} day${d !== 1 ? "s" : ""}`;
  }
  if (now > e) return "Campaign ended";
  const d = Math.ceil((e - now) / 86400000);
  return `${d} day${d !== 1 ? "s" : ""} remaining`;
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
        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
        style={{ backgroundColor: "#f5f5f5", color: "#111" }}
      >
        {icon}
      </div>
      <span style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111" }}>{children}</span>
    </div>
  );
}

function InfoRow({ label, value, accent = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#f8f8f8] last:border-0">
      <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa", flexShrink: 0, minWidth: 130 }}>
        {label}
      </span>
      <span
        className="text-right break-words"
        style={{ ...INTER, fontSize: 13, fontWeight: 600, color: accent ? "#e53935" : "#111" }}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

function DeleteModal({ title, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="bg-white rounded-2xl p-7 flex flex-col gap-4 w-full"
        style={{ maxWidth: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 flex-shrink-0">
            <WarningAmberOutlinedIcon style={{ fontSize: 20, color: "#e53935" }} />
          </div>
          <h3 style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Delete Promotion</h3>
        </div>
        <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
          Are you sure you want to delete <strong>"{title}"</strong>?{" "}
          All linked products will be removed from this offer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
            style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555", background: "#fff" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-white hover:bg-red-600 cursor-pointer"
            style={{ ...INTER, fontSize: 13, fontWeight: 700, background: "#e53935", border: "none" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROMOTION DETAIL PAGE
// ══════════════════════════════════════════════════════════════════════════════
const PromotionDetailPage = ({
  offer      = null,
  onBack     = () => {},
  onEdit     = () => {},
  onDelete   = () => {},
  onToggle   = () => {},
}) => {
  const { offer: fetchedOffer, loading, error: detailError } = useOfferDetail(offer?.id);
  const resolvedOffer = fetchedOffer || offer;

  const [showDelete, setShowDelete] = useState(false);
  const [imgErr,     setImgErr]     = useState(false);

  // ── Loading / empty ───────────────────────────────────────────────────────
  if (!resolvedOffer) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f5f5f5]">
        <p style={{ ...INTER, fontSize: 14, color: "#aaa" }}>
          {loading ? "Loading offer…" : detailError || "No offer selected."}
        </p>
      </div>
    );
  }

  const status         = getStatus(resolvedOffer.start_date, resolvedOffer.end_date, resolvedOffer.is_active);
  const isPercent      = resolvedOffer.discount_type === "percentage";
  const linkedProducts = resolvedOffer.products || offer?.products || [];
  const remaining      = daysRemaining(resolvedOffer.end_date, resolvedOffer.start_date);

  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] p-4 md:p-5 lg:p-6">

      {showDelete && (
        <DeleteModal
          title={resolvedOffer.title}
          onConfirm={() => { setShowDelete(false); onDelete(resolvedOffer); }}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer"
          >
            <ArrowBackOutlinedIcon style={{ fontSize: 18 }} />
          </button>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
              Promotions / #{resolvedOffer.id}
            </p>
            <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
              Promotion Detail
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Toggle */}
          <button
            onClick={() => onToggle(resolvedOffer, !resolvedOffer.is_active)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all"
            style={{
              backgroundColor: resolvedOffer.is_active ? "#f0fdf4" : "#fef2f2",
              borderColor:     resolvedOffer.is_active ? "#bbf7d0" : "#fecaca",
            }}
          >
            {resolvedOffer.is_active
              ? <ToggleOnIcon  style={{ fontSize: 22, color: "#16a34a" }} />
              : <ToggleOffIcon style={{ fontSize: 22, color: "#ef4444" }} />
            }
            <span style={{ ...INTER, fontSize: 13, fontWeight: 700, color: resolvedOffer.is_active ? "#16a34a" : "#ef4444" }}>
              {resolvedOffer.is_active ? "Active" : "Inactive"}
            </span>
          </button>

          <button
            onClick={() => onEdit(resolvedOffer)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all hover:bg-[#222] cursor-pointer"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
          >
            <EditOutlinedIcon style={{ fontSize: 16 }} /> Edit
          </button>

          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all hover:bg-red-600 cursor-pointer"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#e53935", border: "none" }}
          >
            <DeleteOutlineOutlinedIcon style={{ fontSize: 16 }} /> Delete
          </button>
        </div>
      </div>

      {/* ── 3-col grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ══ LEFT + CENTRE (col-span-2) ══ */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* Hero card */}
          <SectionCard>
            <div className="flex flex-col md:flex-row gap-7">

              {/* Banner */}
              <div
                className="flex items-center justify-center rounded-2xl overflow-hidden flex-shrink-0 border border-[#f0f0f0] bg-[#f7f7f7]"
                style={{ width: "100%", maxWidth: 280, height: 200 }}
              >
                {!imgErr && resolvedOffer.banner_image ? (
                  <img
                    src={resolvedOffer.banner_image}
                    alt={resolvedOffer.title}
                    onError={() => setImgErr(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <BrokenImageOutlinedIcon style={{ fontSize: 40, color: "#ddd" }} />
                    <span style={{ ...INTER, fontSize: 11, color: "#ccc" }}>No Banner</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-4 flex-1 min-w-0">

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: status.color }} />
                    {status.label}
                  </span>
                  <span
                    className="flex items-center gap-1 px-3 py-1 rounded-full"
                    style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: isPercent ? "#f3e8ff" : "#fef9c3", color: isPercent ? "#7c3aed" : "#ca8a04" }}
                  >
                    {isPercent
                      ? <PercentOutlinedIcon style={{ fontSize: 12 }} />
                      : <AttachMoneyOutlinedIcon style={{ fontSize: 12 }} />
                    }
                    {resolvedOffer.discount_type}
                  </span>
                </div>

                {/* Title + description */}
                <div>
                  <h2 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px", lineHeight: 1.3 }}>
                    {resolvedOffer.title}
                  </h2>
                  {resolvedOffer.description && (
                    <p className="mt-2" style={{ ...INTER, fontSize: 13, color: "#666", lineHeight: 1.75 }}>
                      {resolvedOffer.description}
                    </p>
                  )}
                </div>

                {/* Discount hero */}
                <div
                  className="flex flex-col items-center justify-center py-5 rounded-2xl"
                  style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
                >
                  <p style={{ ...INTER, fontSize: 10, fontWeight: 700, color: "#e53935", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Discount
                  </p>
                  <p className="mt-1" style={{ ...SORA, fontSize: 36, fontWeight: 900, color: "#e53935", letterSpacing: "-1.5px", lineHeight: 1 }}>
                    {isPercent
                      ? `${resolvedOffer.discount_value}%`
                      : `Rs ${Number(resolvedOffer.discount_value).toLocaleString()}`
                    }
                  </p>
                  <p className="mt-1.5" style={{ ...INTER, fontSize: 12, color: "#e53935", opacity: 0.65 }}>
                    {isPercent ? "percentage off" : "fixed amount off"}
                  </p>
                </div>

                {/* Time remaining */}
                <div
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                  style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
                >
                  <AccessTimeOutlinedIcon style={{ fontSize: 16, color: "#aaa" }} />
                  <span style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555" }}>
                    {remaining}
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Campaign period */}
          <SectionCard>
            <SectionTitle icon={<CalendarTodayOutlinedIcon style={{ fontSize: 16 }} />}>
              Campaign Period
            </SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Start Date", value: formatDate(resolvedOffer.start_date), color: "#1d4ed8" },
                { label: "End Date",   value: formatDate(resolvedOffer.end_date),   color: "#dc2626" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="flex flex-col gap-1.5 px-4 py-4 rounded-xl"
                  style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
                >
                  <p style={{ ...INTER, fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {label}
                  </p>
                  <p style={{ ...SORA, fontSize: 14, fontWeight: 800, color }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="flex flex-col gap-5">

          {/* Offer details */}
          <SectionCard>
            <SectionTitle icon={<LocalOfferOutlinedIcon style={{ fontSize: 16 }} />}>
              Offer Details
            </SectionTitle>
            <InfoRow label="Offer ID"      value={`#${resolvedOffer.id}`}       />
            <InfoRow label="Discount Type" value={resolvedOffer.discount_type}  />
            <InfoRow
              label="Discount"
              value={
                isPercent
                  ? `${resolvedOffer.discount_value}%`
                  : `Rs ${Number(resolvedOffer.discount_value).toLocaleString()}`
              }
              accent
            />
            <InfoRow label="Status"    value={status.label}                          />
            <InfoRow label="Products"  value={`${linkedProducts.length} linked`}     />
            <InfoRow label="Created"   value={formatDate(resolvedOffer.created_at)}  />
            <InfoRow label="Updated"   value={formatDate(resolvedOffer.updated_at)}  />
          </SectionCard>

          {/* Quick actions */}
          <SectionCard>
            <SectionTitle icon={<EditOutlinedIcon style={{ fontSize: 16 }} />}>
              Quick Actions
            </SectionTitle>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => onEdit(resolvedOffer)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white transition-all hover:bg-[#222] cursor-pointer"
                style={{ ...INTER, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
              >
                <EditOutlinedIcon style={{ fontSize: 17 }} /> Edit Promotion
              </button>
              <button
                onClick={() => onToggle(resolvedOffer, !resolvedOffer.is_active)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-gray-100 cursor-pointer"
                style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#111", backgroundColor: "#f5f5f5", border: "1px solid #ebebeb" }}
              >
                {resolvedOffer.is_active
                  ? <ToggleOffIcon style={{ fontSize: 17, color: "#ef4444" }} />
                  : <ToggleOnIcon  style={{ fontSize: 17, color: "#16a34a" }} />
                }
                {resolvedOffer.is_active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 transition-all hover:bg-red-50 cursor-pointer"
                style={{ ...INTER, fontSize: 13, fontWeight: 700, backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <DeleteOutlineOutlinedIcon style={{ fontSize: 17 }} /> Delete Promotion
              </button>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
};

export default PromotionDetailPage;