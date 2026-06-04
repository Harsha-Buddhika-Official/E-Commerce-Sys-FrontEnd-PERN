import { useState, useRef, useEffect } from "react";
import VisibilityOutlinedIcon    from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon          from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InventoryOutlinedIcon     from "@mui/icons-material/InventoryOutlined";
import TagOutlinedIcon           from "@mui/icons-material/TagOutlined";
import MoreVertOutlinedIcon      from "@mui/icons-material/MoreVertOutlined";
import KeyboardArrowDownIcon     from "@mui/icons-material/KeyboardArrowDown";

// ─── Font constants — leaf elements only, never on wrappers ──────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Price row ────────────────────────────────────────────────────────────────
const PriceRow = ({ label, value, accent = false }) => (
  <div className="flex items-center justify-between">
    <span style={{ ...INTER, fontSize: 12, fontWeight: 500, color: "#999" }}>{label}</span>
    <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: accent ? "#e53935" : "#111" }}>
      {value}
    </span>
  </div>
);

// ─── Dropdown action menu ─────────────────────────────────────────────────────
function ActionDropdown({ onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [
    { label: "View",   icon: <VisibilityOutlinedIcon style={{ fontSize: 15 }} />,    onClick: onView,   color: "#555",    bg: "#f9f9f9",   hoverBg: "#f0f0f0" },
    { label: "Edit",   icon: <EditOutlinedIcon style={{ fontSize: 15 }} />,           onClick: onEdit,   color: "#111",    bg: "#f5f5f5",   hoverBg: "#ebebeb" },
    { label: "Delete", icon: <DeleteOutlineOutlinedIcon style={{ fontSize: 15 }} />,  onClick: onDelete, color: "#e53935", bg: "#fef2f2",   hoverBg: "#fee2e2" },
  ];

  return (
    <div ref={ref} className="relative ml-auto">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 transition-all duration-150"
        style={{
          ...INTER, fontSize: 12, fontWeight: 700, color: "#555",
          padding: "5px 10px", borderRadius: 8,
          border: "1px solid #e5e5e5", background: open ? "#f0f0f0" : "#fff",
          cursor: "pointer",
        }}
      >
        <MoreVertOutlinedIcon style={{ fontSize: 15 }} />
        <KeyboardArrowDownIcon style={{ fontSize: 15, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>

      {open && (
        <div
          className="absolute right-0 bottom-[calc(100%+6px)] z-50 flex flex-col overflow-hidden rounded-xl"
          style={{ minWidth: 130, backgroundColor: "#fff", border: "1px solid #ebebeb", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
        >
          {actions.map(({ label, icon, onClick, color, bg, hoverBg }) => (
            <button
              key={label}
              onClick={(e) => { e.stopPropagation(); onClick?.(); setOpen(false); }}
              className="flex items-center gap-2.5 px-4 py-2.5 w-full text-left transition-all cursor-pointer border-none"
              style={{ ...INTER, fontSize: 13, fontWeight: 600, color, backgroundColor: "#fff" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = bg; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Inline action buttons (shown when card is wide enough) ───────────────────
function InlineActions({ onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1.5 w-full">
      <button
        onClick={() => onView?.()}
        type="button"
        className="flex items-center gap-1 transition-all duration-150 hover:bg-gray-100 flex-1 justify-center"
        style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#555", padding: "6px 8px", borderRadius: 8, border: "1px solid #e5e5e5", background: "#fff", cursor: "pointer" }}
      >
        <VisibilityOutlinedIcon style={{ fontSize: 14 }} />
        <span>View</span>
      </button>

      <button
        onClick={() => onEdit?.()}
        className="flex items-center gap-1 transition-all duration-150 hover:bg-[#222] flex-1 justify-center"
        style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#fff", padding: "6px 8px", borderRadius: 8, border: "1px solid #111", background: "#111", cursor: "pointer" }}
      >
        <EditOutlinedIcon style={{ fontSize: 14 }} />
        <span>Edit</span>
      </button>

      <button
        onClick={() => onDelete?.()}
        className="flex items-center gap-1 transition-all duration-150 hover:bg-red-600"
        style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#fff", padding: "6px 8px", borderRadius: 8, border: "1px solid #e53935", background: "#e53935", cursor: "pointer" }}
      >
        <DeleteOutlineOutlinedIcon style={{ fontSize: 14 }} />
      </button>
    </div>
  );
}

// ─── AdminProductCard ─────────────────────────────────────────────────────────
// Props:
//   product        — { id, name, brand, category, stockCount, image, basePrice, sellingPrice, discountedPrice }
//   onView/onEdit/onDelete — (product) => void
//   compact        — boolean: force dropdown mode (used by parent to override)

const AdminProductCard = ({ product, onView, onEdit, onDelete, compact = false }) => {
  const [imgError, setImgError] = useState(false);
  const cardRef  = useRef(null);
  const [narrow, setNarrow] = useState(compact);

  // Watch card width — switch to dropdown when card < 220px wide
  useEffect(() => {
    if (!cardRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setNarrow(entry.contentRect.width < 220 || compact);
    });
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, [compact]);

  const fmt = (amount) =>
    new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 2 }).format(amount ?? 0);

  const inStock    = product.stockCount > 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= 5;

  const stockColor = inStock ? (isLowStock ? "#f97316" : "#16a34a") : "#ef4444";
  const stockBg    = inStock ? (isLowStock ? "#fff7ed" : "#f0fdf4") : "#fef2f2";
  const stockBorder= inStock ? (isLowStock ? "#fed7aa" : "#bbf7d0") : "#fecaca";
  const stockLabel = inStock ? (isLowStock ? "Low Stock" : "In Stock") : "Out of Stock";

  return (
    <div
      ref={cardRef}
      className="bg-white flex flex-col overflow-hidden group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)]"
      style={{ borderRadius: 16, border: "1px solid #ebebeb", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
    >

      {/* ── Image area ── */}
      <div className="relative flex items-center justify-center overflow-hidden bg-[#f7f7f7]" style={{ height: 160 }}>
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <InventoryOutlinedIcon style={{ fontSize: 40, color: "#ddd" }} />
            <span style={{ ...INTER, fontSize: 11, color: "#bbb", fontWeight: 500 }}>No Image</span>
          </div>
        )}

        {/* Stock pill */}
        <div
          className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ backgroundColor: stockBg, border: `1px solid ${stockBorder}` }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: stockColor }} />
          <span style={{ ...INTER, fontSize: 10, fontWeight: 700, color: stockColor }}>{stockLabel}</span>
        </div>

        {/* Category tag */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70">
          <TagOutlinedIcon style={{ fontSize: 11, color: "#fff" }} />
          <span style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#fff" }}>
            {product.category?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-2.5">

        {/* Name + brand */}
        <div>
          <h3 className="line-clamp-2 leading-snug mb-1" style={{ ...SORA, fontSize: 13, fontWeight: 700, color: "#111" }}>
            {product.name}
          </h3>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-md"
            style={{ ...INTER, fontSize: 10, fontWeight: 700, color: "#555", backgroundColor: "#f0f0f0" }}
          >
            {product.brand}
          </span>
        </div>

        {/* Stock count */}
        <div className="flex items-center gap-1.5">
          <span style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Stock</span>
          <span className="px-2 py-0.5 rounded-md" style={{ ...INTER, fontSize: 11, fontWeight: 800, color: "#111", backgroundColor: "#f5f5f5" }}>
            {product.stockCount}
          </span>
        </div>

        {/* Pricing block */}
        <div
          className="rounded-xl px-3 py-2.5 flex flex-col gap-1"
          style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
        >
          <PriceRow label="Base"     value={fmt(product.basePrice)}      />
          <PriceRow label="Selling"  value={fmt(product.sellingPrice)}   accent />
          <PriceRow label="Discount" value={fmt(product.discountedPrice)} />
        </div>

        {/* ── Action area ── */}
        <div className="pt-0.5">
          {narrow ? (
            /* Narrow card: single dropdown button */
            <div className="flex items-center justify-between gap-2">
              <span style={{ ...INTER, fontSize: 11, color: "#bbb", fontWeight: 500 }}>Actions</span>
              <ActionDropdown
                onView={() => onView?.(product)}
                onEdit={() => onEdit?.(product)}
                onDelete={() => onDelete?.(product)}
              />
            </div>
          ) : (
            /* Wide card: inline buttons */
            <InlineActions
              onView={() => onView?.(product)}
              onEdit={() => onEdit?.(product)}
              onDelete={() => onDelete?.(product)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;