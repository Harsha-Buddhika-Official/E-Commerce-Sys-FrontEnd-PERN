import { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";

/**
 * ProductCard
 * Displays a single product with image, metadata, pricing, and action buttons.
 *
 * @param {Object}   product           - Product data object
 * @param {Function} onView            - Callback for View action
 * @param {Function} onEdit            - Callback for Edit action
 * @param {Function} onDelete          - Callback for Delete action
 */
const ProductCard = ({ product, onView, onEdit, onDelete }) => {
  const [imgError, setImgError] = useState(false);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col group">
      {/* ── Product Image ── */}
      <div className="relative bg-gray-50 flex items-center justify-center h-48 overflow-hidden">
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <InventoryOutlinedIcon sx={{ fontSize: 48 }} />
            <span className="text-xs font-medium tracking-wide">No Image</span>
          </div>
        )}

        {/* Stock badge */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide ${
            product.stockCount > 0
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-red-50 text-red-500 border border-red-200"
          }`}
        >
          {product.stockCount > 0 ? `In Stock` : "Out of Stock"}
        </span>
      </div>

      {/* ── Product Info ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Name & meta */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              {product.brand}
            </span>
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wide">
              {product.category}
            </span>
          </div>
        </div>

        {/* Stock count */}
        <p className="text-[11px] text-gray-500 font-medium">
          Stock Count —{" "}
          <span className="text-gray-800 font-semibold">{product.stockCount}</span>
        </p>

        {/* Pricing table */}
        <div className="bg-gray-50 rounded-xl px-3 py-2.5 space-y-1 text-[11px]">
          <PriceRow label="Base" value={formatPrice(product.basePrice)} />
          <PriceRow label="Selling" value={formatPrice(product.sellingPrice)} highlight />
          <PriceRow label="Discount" value={formatPrice(product.discountPrice)} />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <ActionButton
            icon={<VisibilityOutlinedIcon sx={{ fontSize: 15 }} />}
            label="View"
            variant="ghost"
            onClick={() => onView?.(product)}
          />
          <ActionButton
            icon={<EditOutlinedIcon sx={{ fontSize: 15 }} />}
            label="Edit"
            variant="primary"
            onClick={() => onEdit?.(product)}
          />
          <ActionButton
            icon={<DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />}
            label="Delete"
            variant="danger"
            onClick={() => onDelete?.(product)}
          />
        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ───────────────────────────── */

const PriceRow = ({ label, value, highlight = false }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-500">{label}</span>
    <span className={`font-semibold ${highlight ? "text-indigo-600" : "text-gray-700"}`}>
      {value}
    </span>
  </div>
);

const variantMap = {
  ghost: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300",
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600",
  danger: "bg-red-500 text-white hover:bg-red-600 border border-red-500",
};

const ActionButton = ({ icon, label, variant = "ghost", onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${variantMap[variant]}`}
  >
    {icon}
    {label}
  </button>
);

export default ProductCard;
