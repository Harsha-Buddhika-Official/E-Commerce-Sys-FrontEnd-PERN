import { useState } from "react";
import EditOutlinedIcon            from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon   from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon      from "@mui/icons-material/VisibilityOutlined";
import CalendarTodayOutlinedIcon   from "@mui/icons-material/CalendarTodayOutlined";
import PercentOutlinedIcon         from "@mui/icons-material/PercentOutlined";
import AttachMoneyOutlinedIcon     from "@mui/icons-material/AttachMoneyOutlined";
import InventoryOutlinedIcon       from "@mui/icons-material/InventoryOutlined";
import ToggleOnIcon                from "@mui/icons-material/ToggleOn";
import ToggleOffIcon               from "@mui/icons-material/ToggleOff";
import BrokenImageOutlinedIcon     from "@mui/icons-material/BrokenImageOutlined";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const getStatus = (start, end, isActive) => {
  if (!isActive) return { label: "Inactive", bg: "#f5f5f5", color: "#aaa", border: "#e5e5e5" };
  const now = new Date();
  const s   = new Date(start);
  const e   = new Date(end);
  if (now < s)  return { label: "Scheduled", bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" };
  if (now > e)  return { label: "Expired",   bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" };
  return           { label: "Active",    bg: "#dcfce7", color: "#16a34a", border: "#86efac" };
};

const daysLeft = (end) => {
  const diff = new Date(end) - new Date();
  if (diff <= 0) return null;
  const d = Math.ceil(diff / 86400000);
  return d === 1 ? "1 day left" : `${d} days left`;
};

// ─── PromotionCard ────────────────────────────────────────────────────────────
// Props:
//   offer      — offer object matching the DB schema
//   onView     — (offer) => void
//   onEdit     — (offer) => void
//   onDelete   — (offer) => void
//   onToggle   — (offer, newIsActive) => void

const PromotionCard = ({ offer, onView, onEdit, onDelete, onToggle }) => {
  const [imgErr, setImgErr] = useState(false);
  const status   = getStatus(offer.start_date, offer.end_date, offer.is_active);
  const remaining = daysLeft(offer.end_date);
  const isPercent = offer.discount_type === "percentage";

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)]"
      style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
    >
      {/* ── Banner image ── */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: 140, backgroundColor: "#f7f7f7", borderBottom: "1px solid #f0f0f0" }}
      >
        {!imgErr && offer.banner_image ? (
          <img
            src={offer.banner_image}
            alt={offer.title}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <BrokenImageOutlinedIcon style={{ fontSize: 36, color: "#ddd" }} />
            <span style={{ ...INTER, fontSize: 11, color: "#ccc" }}>No Banner</span>
          </div>
        )}

        {/* Status badge — top left */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: status.bg, color: status.color, border: `1px solid ${status.border}` }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: status.color }} />
          {status.label}
        </div>

        {/* Discount badge — top right */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-white"
          style={{ ...SORA, fontSize: 13, fontWeight: 900, backgroundColor: "#e53935" }}
        >
          {isPercent
            ? <><PercentOutlinedIcon style={{ fontSize: 13 }} />{offer.discount_value}% OFF</>
            : <><AttachMoneyOutlinedIcon style={{ fontSize: 13 }} />Rs {Number(offer.discount_value).toLocaleString()} OFF</>
          }
        </div>

        {/* Days left ribbon */}
        {remaining && status.label === "Active" && (
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-1"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          >
            <span style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#fff" }}>{remaining}</span>
          </div>
        )}
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 px-4 pt-3.5 pb-4 gap-3">

        {/* Title */}
        <div>
          <h3
            className="line-clamp-2 leading-snug mb-0.5"
            style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111" }}
          >
            {offer.title}
          </h3>
          {offer.description && (
            <p
              className="line-clamp-2"
              style={{ ...INTER, fontSize: 12, color: "#888", lineHeight: 1.6 }}
            >
              {offer.description}
            </p>
          )}
        </div>

        {/* Meta chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Discount type */}
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-md"
            style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: isPercent ? "#f3e8ff" : "#fef9c3", color: isPercent ? "#7c3aed" : "#ca8a04" }}
          >
            {isPercent ? <PercentOutlinedIcon style={{ fontSize: 11 }} /> : <AttachMoneyOutlinedIcon style={{ fontSize: 11 }} />}
            {isPercent ? "Percentage" : "Fixed Amount"}
          </span>

          {/* Product count */}
          {offer.product_count != null && (
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-md"
              style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#f0f0f0", color: "#555" }}
            >
              <InventoryOutlinedIcon style={{ fontSize: 11 }} />
              {offer.product_count} product{offer.product_count !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Date range */}
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-xl"
          style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
        >
          <CalendarTodayOutlinedIcon style={{ fontSize: 14, color: "#aaa", flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <span style={{ ...INTER, fontSize: 11, fontWeight: 500, color: "#888" }}>
                {formatDate(offer.start_date)}
              </span>
              <span style={{ ...INTER, fontSize: 11, color: "#ccc" }}>→</span>
              <span style={{ ...INTER, fontSize: 11, fontWeight: 500, color: "#888" }}>
                {formatDate(offer.end_date)}
              </span>
            </div>
          </div>
        </div>

        {/* Active toggle + actions */}
        <div className="flex items-center gap-2 pt-0.5">
          {/* Toggle */}
          <button
            onClick={() => onToggle?.(offer, !offer.is_active)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer transition-all hover:opacity-80 flex-shrink-0"
            style={{
              backgroundColor: offer.is_active ? "#f0fdf4" : "#fef2f2",
              borderColor:     offer.is_active ? "#bbf7d0" : "#fecaca",
            }}
          >
            {offer.is_active
              ? <ToggleOnIcon  style={{ fontSize: 20, color: "#16a34a" }} />
              : <ToggleOffIcon style={{ fontSize: 20, color: "#ef4444" }} />
            }
            <span style={{ ...INTER, fontSize: 11, fontWeight: 700, color: offer.is_active ? "#16a34a" : "#ef4444" }}>
              {offer.is_active ? "On" : "Off"}
            </span>
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* View */}
          <button
            onClick={() => onView?.(offer)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            style={{ ...INTER, fontSize: 11, fontWeight: 700 }}
          >
            <VisibilityOutlinedIcon style={{ fontSize: 13 }} />
            View
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit?.(offer)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white hover:bg-[#222] transition-all cursor-pointer"
            style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: "#111", border: "1px solid #111" }}
          >
            <EditOutlinedIcon style={{ fontSize: 13 }} />
            Edit
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete?.(offer)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white hover:bg-red-600 transition-all cursor-pointer"
            style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: "#e53935", border: "1px solid #e53935" }}
          >
            <DeleteOutlineOutlinedIcon style={{ fontSize: 13 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;