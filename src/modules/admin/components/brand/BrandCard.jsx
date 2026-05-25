import { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import WarningAmberOutlinedIcon  from "@mui/icons-material/WarningAmberOutlined";
import BrokenImageOutlinedIcon   from "@mui/icons-material/BrokenImageOutlined";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const toSlug = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const formatCreatedAt = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ brand, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="bg-white rounded-2xl p-7 flex flex-col gap-4 w-full"
        style={{ maxWidth: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 shrink-0">
            <WarningAmberOutlinedIcon style={{ fontSize: 20, color: "#e53935" }} />
          </div>
          <h3 style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Delete Brand</h3>
        </div>
        <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
          Are you sure you want to delete <strong>"{brand.name}"</strong>? Products linked to this brand will have their brand unset.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
            style={{ ...INTER, fontSize: 13, fontWeight: 600, background: "#fff" }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(brand)}
            className="flex-1 py-2.5 rounded-xl text-white transition-all cursor-pointer"
            style={{ ...INTER, fontSize: 13, fontWeight: 700, background: "#e53935", border: "none" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#c62828"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e53935"}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BRAND CARD
// ══════════════════════════════════════════════════════════════════════════════
export default function BrandCard({ brand, onDelete }) {
  const [showDelete, setShowDelete] = useState(false);
  const [logoErr,    setLogoErr]    = useState(false);
  const slug = brand.slug || toSlug(brand.name);
  const createdAt = formatCreatedAt(brand.created_at || brand.createdAt || brand.created);

  return (
    <>
      {showDelete && (
        <DeleteModal
          brand={brand}
          onConfirm={(b) => { setShowDelete(false); onDelete(b.brand_id); }}
          onCancel={() => setShowDelete(false)}
        />
      )}

      <div
        className="bg-white rounded-2xl p-5 flex flex-col gap-4 transition-all"
        style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
      >
        {/* ── Logo ── */}
        <div
          className="flex items-center justify-center rounded-xl w-full"
          style={{ height: 88, backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
        >
          {!logoErr && brand.logo_url ? (
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="max-h-12 max-w-[80%] object-contain"
              onError={() => setLogoErr(true)}
            />
          ) : (
            <BrokenImageOutlinedIcon style={{ fontSize: 32, color: "#ddd" }} />
          )}
        </div>

        {/* ── Name + status ── */}
        <div className="flex items-center justify-between gap-2">
          <p
            className="truncate"
            style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111" }}
            title={brand.name}
          >
            {brand.name}
          </p>
          <span
            className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full"
            style={{
              ...INTER,
              fontSize: 10,
              fontWeight: 700,
              backgroundColor: brand.is_active ? "#f0fdf4" : "#fef2f2",
              color:           brand.is_active ? "#15803d" : "#dc2626",
              border:          `1px solid ${brand.is_active ? "#bbf7d0" : "#fecaca"}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: brand.is_active ? "#16a34a" : "#e53935" }}
            />
            {brand.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* ── Slug ── */}
        <div className="flex flex-col gap-1">
          <span style={{ ...INTER, fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Slug
          </span>
          <div
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
          >
            <p
              className="truncate"
              style={{ ...INTER, fontSize: 12, fontWeight: 700, color: slug ? "#111" : "#aaa", fontFamily: "'Courier New', monospace" }}
              title={slug || "-"}
            >
              {slug || "-"}
            </p>
          </div>
        </div>

        {/* ── Created at ── */}
        <div className="flex flex-col gap-1">
          <span style={{ ...INTER, fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Created At
          </span>
          <div
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
          >
            <p
              className="truncate"
              style={{ ...INTER, fontSize: 12, fontWeight: 700, color: createdAt === "-" ? "#aaa" : "#111" }}
              title={createdAt}
            >
              {createdAt}
            </p>
          </div>
        </div>

        {/* ── Footer: id + delete ── */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid #f5f5f5" }}
        >
          <span style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#ccc" }}>
            #{brand.brand_id}
          </span>
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer border-none transition-all"
            style={{ backgroundColor: "#fef2f2", color: "#e53935" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fef2f2"}
          >
            <DeleteOutlineOutlinedIcon style={{ fontSize: 15 }} />
            <span style={{ ...INTER, fontSize: 11, fontWeight: 700 }}>Delete</span>
          </button>
        </div>
      </div>
    </>
  );
}