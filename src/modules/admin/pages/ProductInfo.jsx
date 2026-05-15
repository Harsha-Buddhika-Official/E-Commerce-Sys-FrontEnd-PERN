import { useState } from "react";
import EditOutlinedIcon            from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon   from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowBackOutlinedIcon       from "@mui/icons-material/ArrowBackOutlined";
import InventoryOutlinedIcon       from "@mui/icons-material/InventoryOutlined";
import LocalOfferOutlinedIcon      from "@mui/icons-material/LocalOfferOutlined";
import CategoryOutlinedIcon        from "@mui/icons-material/CategoryOutlined";
import LaptopOutlinedIcon          from "@mui/icons-material/LaptopOutlined";
import MemoryOutlinedIcon          from "@mui/icons-material/MemoryOutlined";
import StorageOutlinedIcon         from "@mui/icons-material/StorageOutlined";
import MonitorOutlinedIcon         from "@mui/icons-material/MonitorOutlined";
import BatteryChargingFullOutlinedIcon from "@mui/icons-material/BatteryChargingFullOutlined";
import WifiOutlinedIcon            from "@mui/icons-material/WifiOutlined";
import UsbOutlinedIcon             from "@mui/icons-material/UsbOutlined";
import BluetoothOutlinedIcon       from "@mui/icons-material/BluetoothOutlined";
import ScaleOutlinedIcon           from "@mui/icons-material/ScaleOutlined";
import LightbulbOutlinedIcon       from "@mui/icons-material/LightbulbOutlined";
import SpeedOutlinedIcon           from "@mui/icons-material/SpeedOutlined";
import WarningAmberOutlinedIcon    from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlinedIcon     from "@mui/icons-material/CheckCircleOutlined";
import ContentCopyOutlinedIcon     from "@mui/icons-material/ContentCopyOutlined";
import TrendingUpOutlinedIcon      from "@mui/icons-material/TrendingUpOutlined";

// ─── Font constants — leaf elements only, never on wrapper divs ───────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Mock product (replace with API data / router param) ──────────────────────
const MOCK_PRODUCT = {
  id:              "PRD-001",
  name:            "MSI Cyborg 15 A13VF",
  brand:           "MSI",
  category:        "Laptop",
  description:     "The MSI Cyborg 15 is a thin and light (1.98kg) entry-level gaming laptop featuring a distinct, futuristic design with a translucent chassis. It features up to 13th/14th Gen Intel Core processors, NVIDIA GeForce RTX 40-series/30-series GPUs, and a 15.6-inch 144Hz FHD display. It is designed for portability and daily gaming.",
  images:          [
    "https://placehold.co/600x440/f5f5f5/252525?text=MSI+Cyborg+15",
    "https://placehold.co/600x440/f5f5f5/252525?text=Side+View",
    "https://placehold.co/600x440/f5f5f5/252525?text=Keyboard",
    "https://placehold.co/600x440/f5f5f5/252525?text=Ports",
  ],
  stockCount:      10,
  basePrice:       290500,
  sellingPrice:    350500,
  discountedPrice: 325500,
  createdAt:       "2025-01-15",
  updatedAt:       "2025-05-10",
  sku:             "MSI-CYB15-A13VF-001",
  attributes: {
    processor:        "Intel Core i7-13620H",
    processorFamily:  "Intel 13th Gen Core i7",
    graphics:         "NVIDIA GeForce RTX 4060 8GB",
    ram:              "16GB DDR5",
    storage:          "512GB NVMe SSD",
    displaySize:      "15.6 inch",
    resolution:       "1920×1080 FHD",
    refreshRate:      "144Hz",
    batteryLife:      "53.5Wh Battery",
    operatingSystem:  "Windows 11 Home",
    bluetooth:        "Bluetooth 5.2",
    wifiVersion:      "WiFi 6",
    keyboardBacklight:"RGB Backlit Keyboard",
    weight:           "1.98kg",
    portsType:        "Other",
    portsDetail:      "USB-A, USB-C, HDMI, RJ45",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (amount) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 2 }).format(amount ?? 0);

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
        className="flex items-center justify-center w-8 h-8 rounded-lg"
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

function InfoRow({ label, value, accent = false, copyable = false }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#f8f8f8] last:border-0">
      <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa", flexShrink: 0, minWidth: 130 }}>
        {label}
      </span>
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="text-right break-words"
          style={{ ...INTER, fontSize: 13, fontWeight: 600, color: accent ? "#e53935" : "#111" }}
        >
          {value ?? "—"}
        </span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-md bg-transparent border-none cursor-pointer text-gray-300 hover:text-gray-600 transition-colors"
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

function AttrChip({ icon, label, value }) {
  return (
    <div
      className="flex flex-col gap-1.5 px-4 py-3 rounded-xl"
      style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
    >
      <div className="flex items-center gap-1.5 text-gray-400">
        {icon}
        <span style={{ ...INTER, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </span>
      </div>
      <span style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#111" }}>
        {value || "—"}
      </span>
    </div>
  );
}

function StockBar({ stock, max = 50 }) {
  const pct = Math.min((stock / max) * 100, 100);
  const color = stock === 0 ? "#ef4444" : stock <= 5 ? "#f97316" : "#16a34a";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Stock Level</span>
        <span style={{ ...INTER, fontSize: 12, fontWeight: 800, color }}>
          {stock} / {max} units
        </span>
      </div>
      <div className="w-full rounded-full overflow-hidden" style={{ height: 7, backgroundColor: "#f0f0f0" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Delete modal ─────────────────────────────────────────────────────────────
function DeleteModal({ product, onConfirm, onCancel }) {
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
          <h3 style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Delete Product</h3>
        </div>
        <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
          Are you sure you want to delete <strong>"{product.name}"</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 600, background: "#fff" }}>
            Cancel
          </button>
          <button onClick={() => onConfirm(product)} className="flex-1 py-2.5 rounded-xl text-white hover:bg-red-600 transition-all cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 700, background: "#e53935", border: "none" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCT INFO PAGE
// ══════════════════════════════════════════════════════════════════════════════
const ProductInfoPage = ({
  product      = MOCK_PRODUCT,
  onBack       = () => {},
  onEdit       = () => {},
  onDelete     = () => {},
}) => {
  const [activeImage,  setActiveImage]  = useState(0);
  const [showDelete,   setShowDelete]   = useState(false);

  const inStock    = product.stockCount > 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= 5;
  const margin     = product.sellingPrice - product.basePrice;
  const marginPct  = product.basePrice > 0 ? ((margin / product.basePrice) * 100).toFixed(1) : 0;
  const discount   = product.sellingPrice - product.discountedPrice;
  const discountPct = product.sellingPrice > 0 ? ((discount / product.sellingPrice) * 100).toFixed(1) : 0;

  const attrs = product.attributes || {};

  const ATTR_GRID = [
    { icon: <MemoryOutlinedIcon      style={{ fontSize: 14 }} />, label: "Processor",         value: attrs.processor        },
    { icon: <LaptopOutlinedIcon      style={{ fontSize: 14 }} />, label: "Graphics",           value: attrs.graphics         },
    { icon: <StorageOutlinedIcon     style={{ fontSize: 14 }} />, label: "RAM",                value: attrs.ram              },
    { icon: <StorageOutlinedIcon     style={{ fontSize: 14 }} />, label: "Storage",            value: attrs.storage          },
    { icon: <MonitorOutlinedIcon     style={{ fontSize: 14 }} />, label: "Display",            value: attrs.displaySize      },
    { icon: <SpeedOutlinedIcon       style={{ fontSize: 14 }} />, label: "Refresh Rate",       value: attrs.refreshRate      },
    { icon: <MonitorOutlinedIcon     style={{ fontSize: 14 }} />, label: "Resolution",         value: attrs.resolution       },
    { icon: <BatteryChargingFullOutlinedIcon style={{ fontSize: 14 }} />, label: "Battery",   value: attrs.batteryLife      },
    { icon: <WifiOutlinedIcon        style={{ fontSize: 14 }} />, label: "WiFi",               value: attrs.wifiVersion      },
    { icon: <BluetoothOutlinedIcon   style={{ fontSize: 14 }} />, label: "Bluetooth",          value: attrs.bluetooth        },
    { icon: <LightbulbOutlinedIcon   style={{ fontSize: 14 }} />, label: "Keyboard",           value: attrs.keyboardBacklight},
    { icon: <ScaleOutlinedIcon       style={{ fontSize: 14 }} />, label: "Weight",             value: attrs.weight           },
    { icon: <UsbOutlinedIcon         style={{ fontSize: 14 }} />, label: "Ports",              value: attrs.portsDetail      },
    { icon: <LaptopOutlinedIcon      style={{ fontSize: 14 }} />, label: "OS",                 value: attrs.operatingSystem  },
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* Delete modal */}
      {showDelete && (
        <DeleteModal
          product={product}
          onConfirm={(p) => { setShowDelete(false); onDelete(p); }}
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
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Products / Detail</p>
            <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
              Product Info
            </h1>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onEdit(product)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all hover:bg-[#222]"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none", cursor: "pointer" }}
          >
            <EditOutlinedIcon style={{ fontSize: 16 }} />
            Edit Product
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all hover:bg-red-600"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#e53935", border: "none", cursor: "pointer" }}
          >
            <DeleteOutlineOutlinedIcon style={{ fontSize: 16 }} />
            Delete
          </button>
        </div>
      </div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ══ COL 1+2: left + centre ══ */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* ── Product overview card ── */}
          <SectionCard>
            <div className="flex flex-col md:flex-row gap-6">

              {/* Image gallery */}
              <div className="flex flex-col gap-3 flex-shrink-0">
                {/* Main image */}
                <div
                  className="rounded-xl border border-[#f0f0f0] bg-[#f7f7f7] flex items-center justify-center overflow-hidden"
                  style={{ width: "100%", maxWidth: 320, height: 240 }}
                >
                  {product.images?.length > 0 ? (
                    <img
                      src={product.images[activeImage]}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain p-4 transition-all duration-300"
                    />
                  ) : (
                    <InventoryOutlinedIcon style={{ fontSize: 64, color: "#ddd" }} />
                  )}
                </div>

                {/* Thumbnails */}
                {product.images?.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {product.images.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className="rounded-lg overflow-hidden border transition-all cursor-pointer bg-transparent p-0"
                        style={{
                          width: 52, height: 52,
                          borderColor: activeImage === idx ? "#111" : "#e5e5e5",
                          backgroundColor: "#f7f7f7",
                          outline: activeImage === idx ? "2px solid #111" : "none",
                          outlineOffset: 2,
                        }}
                      >
                        <img src={src} alt={`thumb-${idx}`} className="w-full h-full object-contain p-1" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product identity */}
              <div className="flex flex-col gap-4 flex-1 min-w-0">
                {/* Status badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="flex items-center gap-1 px-3 py-1 rounded-full"
                    style={{
                      ...INTER, fontSize: 11, fontWeight: 700,
                      backgroundColor: inStock ? (isLowStock ? "#fff7ed" : "#f0fdf4") : "#fef2f2",
                      color: inStock ? (isLowStock ? "#c2410c" : "#15803d") : "#dc2626",
                      border: `1px solid ${inStock ? (isLowStock ? "#fed7aa" : "#bbf7d0") : "#fecaca"}`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "currentColor" }} />
                    {inStock ? (isLowStock ? "Low Stock" : "In Stock") : "Out of Stock"}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full"
                    style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: "#f0f0f0", color: "#555" }}
                  >
                    {product.category}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full"
                    style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: "#f0f0f0", color: "#555" }}
                  >
                    {product.brand}
                  </span>
                </div>

                {/* Name */}
                <div>
                  <h2 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", lineHeight: 1.3, letterSpacing: "-0.3px" }}>
                    {product.name}
                  </h2>
                  <p className="mt-1" style={{ ...INTER, fontSize: 11, color: "#bbb" }}>
                    SKU: {product.sku}
                  </p>
                </div>

                {/* Description */}
                <p style={{ ...INTER, fontSize: 13, color: "#666", lineHeight: 1.75 }}>
                  {product.description}
                </p>

                {/* Stock progress */}
                <div
                  className="rounded-xl px-4 py-3 mt-auto"
                  style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
                >
                  <StockBar stock={product.stockCount} max={50} />
                </div>

                {/* Dates */}
                <div className="flex items-center gap-5">
                  <div>
                    <p style={{ ...INTER, fontSize: 10, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Created
                    </p>
                    <p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#555" }}>
                      {product.createdAt}
                    </p>
                  </div>
                  <div>
                    <p style={{ ...INTER, fontSize: 10, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Last Updated
                    </p>
                    <p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#555" }}>
                      {product.updatedAt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Attributes grid ── */}
          <SectionCard>
            <SectionTitle icon={<MemoryOutlinedIcon style={{ fontSize: 16 }} />}>
              Technical Specifications
            </SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {ATTR_GRID.map(({ icon, label, value }) => (
                <AttrChip key={label} icon={icon} label={label} value={value} />
              ))}
            </div>
            {attrs.processorFamily && (
              <div className="mt-3 flex items-center gap-2">
                <span style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 600 }}>Processor Family</span>
                <span
                  className="px-2.5 py-0.5 rounded-md"
                  style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#555", backgroundColor: "#f0f0f0" }}
                >
                  {attrs.processorFamily}
                </span>
              </div>
            )}
          </SectionCard>
        </div>

        {/* ══ COL 3: right panel ══ */}
        <div className="flex flex-col gap-5">

          {/* Pricing card */}
          <SectionCard>
            <SectionTitle icon={<LocalOfferOutlinedIcon style={{ fontSize: 16 }} />}>
              Pricing
            </SectionTitle>

            {/* Big selling price */}
            <div className="flex flex-col items-center py-5 mb-4 rounded-xl bg-[#f9f9f9] border border-[#f0f0f0]">
              <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Selling Price
              </p>
              <p className="mt-1" style={{ ...SORA, fontSize: 28, fontWeight: 900, color: "#e53935", letterSpacing: "-0.5px" }}>
                {fmt(product.sellingPrice)}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUpOutlinedIcon style={{ fontSize: 14, color: "#16a34a" }} />
                <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#16a34a" }}>
                  {marginPct}% margin
                </span>
              </div>
            </div>

            <InfoRow label="Base Price"       value={fmt(product.basePrice)}       />
            <InfoRow label="Selling Price"    value={fmt(product.sellingPrice)}    accent />
            <InfoRow label="Discounted Price" value={fmt(product.discountedPrice)} />
            <InfoRow label="Discount Amount"  value={fmt(discount)}                />
            <InfoRow label="Discount %"       value={`${discountPct}%`}            />
            <InfoRow label="Profit Margin"    value={fmt(margin)}                  />
          </SectionCard>

          {/* Product details card */}
          <SectionCard>
            <SectionTitle icon={<CategoryOutlinedIcon style={{ fontSize: 16 }} />}>
              Product Details
            </SectionTitle>
            <InfoRow label="Product ID" value={product.id}       copyable />
            <InfoRow label="SKU"        value={product.sku}      copyable />
            <InfoRow label="Brand"      value={product.brand}             />
            <InfoRow label="Category"   value={product.category}          />
            <InfoRow label="Stock"      value={`${product.stockCount} units`} />
            <InfoRow label="Created"    value={product.createdAt}         />
            <InfoRow label="Updated"    value={product.updatedAt}         />
          </SectionCard>

          {/* Quick actions card */}
          <SectionCard>
            <SectionTitle icon={<InventoryOutlinedIcon style={{ fontSize: 16 }} />}>
              Quick Actions
            </SectionTitle>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => onEdit(product)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white transition-all hover:bg-[#222] cursor-pointer"
                style={{ ...INTER, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
              >
                <EditOutlinedIcon style={{ fontSize: 17 }} />
                Edit Product Details
              </button>
              <button
                onClick={() => onEdit({ ...product, editMode: "attributes" })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-gray-100 cursor-pointer"
                style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#111", backgroundColor: "#f5f5f5", border: "1px solid #ebebeb" }}
              >
                <MemoryOutlinedIcon style={{ fontSize: 17 }} />
                Edit Attributes
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 transition-all hover:bg-red-50 cursor-pointer"
                style={{ ...INTER, fontSize: 13, fontWeight: 700, backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <DeleteOutlineOutlinedIcon style={{ fontSize: 17 }} />
                Delete Product
              </button>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
};

export default ProductInfoPage;
