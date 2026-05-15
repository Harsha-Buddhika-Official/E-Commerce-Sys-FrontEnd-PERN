import { useState } from "react";
import VisibilityOutlinedIcon    from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon          from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InventoryOutlinedIcon     from "@mui/icons-material/InventoryOutlined";
import TagOutlinedIcon           from "@mui/icons-material/TagOutlined";

// ─── Font constants — leaf elements only, never on wrappers ──────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Price row ────────────────────────────────────────────────────────────────
const PriceRow = ({ label, value, accent = false }) => (
  <div className="flex items-center justify-between">
    <span style={{ ...INTER, fontSize: 13, fontWeight: 500, color: "#999" }}>
      {label}
    </span>
    <span
      style={{
        ...INTER,
        fontSize: 13,
        fontWeight: 700,
        color: accent ? "#e53935" : "#111",
      }}
    >
      {value}
    </span>
  </div>
);

// ─── AdminProductCard ─────────────────────────────────────────────────────────
// Props:
//   product  — { id, name, brand, category, stockCount, image, basePrice, sellingPrice, discountPrice }
//   onView   — (product) => void
//   onEdit   — (product) => void
//   onDelete — (product) => void

const AdminProductCard = ({ product, onEdit, onDelete }) => {
  const [imgError, setImgError] = useState(false);

  const fmt = (amount) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 2,
    }).format(amount);

  const inStock    = product.stockCount > 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= 5;

  return (
    <div
      className="bg-white flex flex-col overflow-hidden group transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)]"
      style={{
        borderRadius: 16,
        border: "1px solid #ebebeb",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >

      {/* ── Image area ── */}
      <div
        className="relative flex items-center justify-center overflow-hidden bg-[#f7f7f7]"
        style={{ height: 180 }}
      >
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <InventoryOutlinedIcon style={{ fontSize: 44, color: "#ddd" }} />
            <span style={{ ...INTER, fontSize: 13, color: "#bbb", fontWeight: 500 }}>
              No Image
            </span>
          </div>
        )}

        {/* Stock status pill — top right */}
        <div
          className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full"
          style={{
            backgroundColor: inStock
              ? isLowStock ? "#fff7ed" : "#f0fdf4"
              : "#fef2f2",
            border: `1px solid ${inStock ? (isLowStock ? "#fed7aa" : "#bbf7d0") : "#fecaca"}`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: inStock
                ? isLowStock ? "#f97316" : "#16a34a"
                : "#ef4444",
            }}
          />
          <span
            style={{
              ...INTER,
              fontSize: 12,
              fontWeight: 700,
              color: inStock
                ? isLowStock ? "#c2410c" : "#15803d"
                : "#dc2626",
            }}
          >
            {inStock ? (isLowStock ? "Low Stock" : "In Stock") : "Out of Stock"}
          </span>
        </div>

        {/* Category tag — bottom left */}
        <div
          className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70"
        >
          <TagOutlinedIcon style={{ fontSize: 12, color: "#fff" }} />
          <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#fff" }}>
            {product.category?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-3">

        {/* Name */}
        <div>
          <h3
            className="line-clamp-2 leading-snug mb-1"
            style={{ ...SORA, fontSize: 15, fontWeight: 700, color: "#111" }}
          >
            {product.name}
          </h3>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-md"
            style={{
              ...INTER,
              fontSize: 12,
              fontWeight: 700,
              color: "#555",
              backgroundColor: "#f0f0f0",
              letterSpacing: "0.04em",
            }}
          >
            {product.brand}
          </span>
        </div>

        {/* Stock count */}
        <div className="flex items-center gap-1.5">
          <span style={{ ...INTER, fontSize: 13, color: "#aaa", fontWeight: 500 }}>
            Stock Count
          </span>
          <span
            className="px-2 py-0.5 rounded-md"
            style={{
              ...INTER,
              fontSize: 13,
              fontWeight: 800,
              color: "#111",
              backgroundColor: "#f5f5f5",
            }}
          >
            {product.stockCount}
          </span>
        </div>

        {/* Pricing block */}
        <div
          className="rounded-xl px-3 py-2.5 flex flex-col gap-1.5"
          style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
        >
          <PriceRow label="Base"     value={fmt(product.basePrice)}     />
          <PriceRow label="Selling"  value={fmt(product.sellingPrice)}  accent />
          <PriceRow label="Discount" value={fmt(product.discountPrice)} />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 pt-0.5">

          {/* View — ghost */}
          <button
            // onClick={() => onView?.(product)}
            className="flex items-center gap-1 transition-all duration-150 hover:bg-gray-100"
            style={{
              ...INTER,
              fontSize: 13,
              fontWeight: 700,
              color: "#555",
              padding: "5px 10px",
              borderRadius: 8,
              border: "1px solid #e5e5e5",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <VisibilityOutlinedIcon style={{ fontSize: 16 }} />
            View
          </button>

          {/* Edit — dark */}
          <button
            onClick={() => onEdit?.(product)}
            className="flex items-center gap-1 transition-all duration-150 hover:bg-[#222]"
            style={{
              ...INTER,
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              padding: "5px 10px",
              borderRadius: 8,
              border: "1px solid #111",
              background: "#111",
              cursor: "pointer",
            }}
          >
            <EditOutlinedIcon style={{ fontSize: 16 }} />
            Edit
          </button>

          {/* Delete — red */}
          <button
            onClick={() => onDelete?.(product)}
            className="flex items-center gap-1 transition-all duration-150 hover:bg-red-600 ml-auto"
            style={{
              ...INTER,
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              padding: "5px 10px",
              borderRadius: 8,
              border: "1px solid #e53935",
              background: "#e53935",
              cursor: "pointer",
            }}
          >
            <DeleteOutlineOutlinedIcon style={{ fontSize: 16 }} />
            Delete
          </button>

        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;