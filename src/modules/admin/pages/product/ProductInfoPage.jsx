import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackOutlinedIcon          from "@mui/icons-material/ArrowBackOutlined";
import ContentCopyOutlinedIcon        from "@mui/icons-material/ContentCopyOutlined";
import CheckCircleOutlinedIcon        from "@mui/icons-material/CheckCircleOutlined";
import LocalOfferOutlinedIcon         from "@mui/icons-material/LocalOfferOutlined";
import CategoryOutlinedIcon           from "@mui/icons-material/CategoryOutlined";
import InventoryOutlinedIcon          from "@mui/icons-material/InventoryOutlined";
import VerifiedOutlinedIcon           from "@mui/icons-material/VerifiedOutlined";
import ToggleOnOutlinedIcon           from "@mui/icons-material/ToggleOnOutlined";
import ToggleOffOutlinedIcon          from "@mui/icons-material/ToggleOffOutlined";
import TrendingUpOutlinedIcon         from "@mui/icons-material/TrendingUpOutlined";
import StarOutlinedIcon               from "@mui/icons-material/StarOutlined";
import TagOutlinedIcon                from "@mui/icons-material/TagOutlined";
import LinkOutlinedIcon               from "@mui/icons-material/LinkOutlined";
import BrokenImageOutlinedIcon        from "@mui/icons-material/BrokenImageOutlined";
import { useProductDetail }           from "../../features/products/hooks/useProductDetail";
import { formatDateWithTime }         from "../../../../utils/dateFormatters";
import { SORA, INTER }                from "../../../../styles/fonts";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (amount) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 2 }).format(Number(amount) || 0);

// Map snake_case attribute names → readable labels
const attrLabel = (name) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// Product tag config
const TAG_CONFIG = {
  BEST_SELLER: { label: "Best Seller", bg: "#fef9c3", color: "#ca8a04", border: "#fde047", icon: <StarOutlinedIcon style={{ fontSize: 12 }} /> },
  NEW:         { label: "New",         bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd", icon: <VerifiedOutlinedIcon style={{ fontSize: 12 }} /> },
  HOT:         { label: "Hot",         bg: "#fee2e2", color: "#dc2626", border: "#fca5a5", icon: <LocalOfferOutlinedIcon style={{ fontSize: 12 }} /> },
  SALE:        { label: "Sale",        bg: "#dcfce7", color: "#16a34a", border: "#86efac", icon: <LocalOfferOutlinedIcon style={{ fontSize: 12 }} /> },
};

const STOCK_CONFIG = {
  IN_STOCK:    { label: "In Stock",    bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  OUT_OF_STOCK:{ label: "Out of Stock",bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  LOW_STOCK:   { label: "Low Stock",   bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-6 ${className}`}
      style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#f0f0f0]">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: "#f5f5f5", color: "#111" }}>
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
  const copy = () => { navigator.clipboard.writeText(String(value ?? "")); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div className="flex items-start justify-between gap-2 sm:gap-4 py-2.5 border-b border-[#f8f8f8] last:border-0">
      <span
        className="min-w-[100px] sm:min-w-[140px]"
        style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa", flexShrink: 0 }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-right break-all" style={{ ...INTER, fontSize: mono ? 12 : 13, fontWeight: 600, color: accent ? "#e53935" : "#111", fontFamily: mono ? "'Courier New', monospace" : INTER.fontFamily, letterSpacing: mono ? "0.03em" : 0 }}>
          {value ?? "—"}
        </span>
        {copyable && (
          <button onClick={copy} className="shrink-0 flex items-center justify-center w-5 h-5 rounded-md bg-transparent border-none cursor-pointer text-gray-300 hover:text-gray-600 transition-colors">
            {copied ? <CheckCircleOutlinedIcon style={{ fontSize: 14, color: "#16a34a" }} /> : <ContentCopyOutlinedIcon style={{ fontSize: 13 }} />}
          </button>
        )}
      </div>
    </div>
  );
}

function StockBar({ qty, max = 50 }) {
  const pct   = Math.min((qty / max) * 100, 100);
  const color = qty === 0 ? "#ef4444" : qty <= 5 ? "#f97316" : "#16a34a";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Stock Level</span>
        <span style={{ ...INTER, fontSize: 12, fontWeight: 800, color }}>{qty} / {max} units</span>
      </div>
      <div className="w-full rounded-full overflow-hidden" style={{ height: 7, backgroundColor: "#f0f0f0" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function AttrChip({ name, value }) {
  return (
    <div className="flex flex-col gap-1.5 px-4 py-3 rounded-xl" style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}>
      <span style={{ ...INTER, fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {attrLabel(name)}
      </span>
      <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#111", lineHeight: 1.4 }}>
        {value || "—"}
      </span>
    </div>
  );
}

function ImageThumb({ src, alt, active, onClick }) {
  const [err, setErr] = useState(false);
  return (
    <button
      onClick={onClick}
      className="rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#f7f7f7] p-0 flex items-center justify-center"
      style={{ width: 58, height: 58, borderColor: active ? "#111" : "#e5e5e5", outline: active ? "2px solid #11111120" : "none", outlineOffset: 2 }}
    >
      {!err && src ? (
        <img src={src} alt={alt} onError={() => setErr(true)} className="w-full h-full object-contain p-1" />
      ) : (
        <BrokenImageOutlinedIcon style={{ fontSize: 22, color: "#ccc" }} />
      )}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN PRODUCT INFO PAGE
// ══════════════════════════════════════════════════════════════════════════════
const ProductInfoPage = () => {
  const navigate = useNavigate();
  const { id: routeProductId } = useParams();
  const { product: fetchedProduct, loading, error } = useProductDetail(routeProductId);
  const resolvedProduct = fetchedProduct;
  const sortedImages = [...(resolvedProduct?.images || [])].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
  const primaryIdx = sortedImages.findIndex((i) => i.is_primary);
  const [activeImg, setActiveImg] = useState(Math.max(primaryIdx, 0));
  const [imgErr,    setImgErr]    = useState(false);

  useEffect(() => {
    setActiveImg(Math.max(primaryIdx, 0));
    setImgErr(false);
  }, [primaryIdx, routeProductId]);

  const productData = resolvedProduct;

  if (!routeProductId) {
    return (
      <div className="h-full overflow-y-auto bg-[#f5f5f5] p-4 sm:p-5 lg:p-6 grid place-items-center">
        <div className="bg-white rounded-2xl p-6 border border-[#ebebeb] shadow-[0_2px_12px_rgba(0,0,0,0.05)] max-w-md w-full">
          <p style={{ ...SORA, fontSize: 16, fontWeight: 800, color: "#111" }}>Missing product ID</p>
          <p className="mt-2" style={{ ...INTER, fontSize: 13, color: "#666" }}>
            Open this page from the products list so the route can provide a product id.
          </p>
          <button
            onClick={() => navigate("/admin/products")}
            className="mt-4 px-4 py-2.5 rounded-xl text-white transition-all hover:bg-[#222] cursor-pointer"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full overflow-y-auto bg-[#f5f5f5] p-4 sm:p-5 lg:p-6 grid place-items-center">
        <p style={{ ...INTER, fontSize: 13, color: "#666" }}>Loading product details...</p>
      </div>
    );
  }

  if (error || !resolvedProduct) {
    return (
      <div className="h-full overflow-y-auto bg-[#f5f5f5] p-4 sm:p-5 lg:p-6 grid place-items-center">
        <div className="bg-white rounded-2xl p-6 border border-[#ebebeb] shadow-[0_2px_12px_rgba(0,0,0,0.05)] max-w-md w-full">
          <p style={{ ...SORA, fontSize: 16, fontWeight: 800, color: "#111" }}>Product not found</p>
          <p className="mt-2" style={{ ...INTER, fontSize: 13, color: "#666" }}>{error || "The requested product could not be loaded."}</p>
          <button
            onClick={() => navigate("/admin/products")}
            className="mt-4 px-4 py-2.5 rounded-xl text-white transition-all hover:bg-[#222] cursor-pointer"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const tagCfg   = TAG_CONFIG[productData.product_tag]   || null;
  const stockCfg = STOCK_CONFIG[productData.stock_status] || STOCK_CONFIG.IN_STOCK;

  const selling  = Number(productData.selling_price)    || 0;
  const base     = Number(productData.base_price)       || 0;
  const disc     = Number(productData.discounted_price) || 0;
  const margin = disc - base;
  const marginPct = base > 0 ? ((margin / base) * 100).toFixed(1) : "0.0";
  const savingAmt = selling - disc;
  const savingPct = selling > 0 ? ((savingAmt / selling) * 100).toFixed(1) : "0.0";

  const currentImg = sortedImages[activeImg];

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-4 sm:p-5 lg:p-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/products")} className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer">
            <ArrowBackOutlinedIcon style={{ fontSize: 18 }} />
          </button>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Products / Detail</p>
            <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Product Info</h1>
          </div>
        </div>
      </div>

      {/* ── 3-col grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">

        {/* ══ LEFT + CENTRE (col-span-2) ══ */}
        <div className="xl:col-span-2 flex flex-col gap-4 sm:gap-5">

          {/* ── Product overview card ── */}
          <SectionCard>
            <div className="flex flex-col md:flex-row gap-6 md:gap-7">

              {/* Image gallery */}
              <div className="flex flex-col gap-3 shrink-0">
                {/* Main image */}
                <div
                  className="flex items-center justify-center rounded-2xl overflow-hidden border border-[#f0f0f0] bg-[#f7f7f7] mx-auto md:mx-0"
                  style={{ width: "100%", maxWidth: 300, height: 220 }}
                >
                  {!imgErr && currentImg?.image_url ? (
                    <img
                      src={currentImg.image_url}
                      alt={currentImg.alt_text || productData.name}
                      onError={() => setImgErr(true)}
                      className="max-w-full max-h-full object-contain p-4 transition-all duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <InventoryOutlinedIcon style={{ fontSize: 56, color: "#ddd" }} />
                      <span style={{ ...INTER, fontSize: 11, color: "#bbb" }}>No Image</span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {sortedImages.length > 1 && (
                  <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                    {sortedImages.map((img, idx) => (
                      <ImageThumb
                        key={img.image_id}
                        src={img.image_url}
                        alt={img.alt_text}
                        active={activeImg === idx}
                        onClick={() => { setActiveImg(idx); setImgErr(false); }}
                      />
                    ))}
                  </div>
                )}

                {/* Image count */}
                <p className="text-center md:text-left" style={{ ...INTER, fontSize: 11, color: "#bbb", fontWeight: 500 }}>
                  {sortedImages.length} image{sortedImages.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Product identity */}
              <div className="flex flex-col gap-4 flex-1 min-w-0">

                {/* Badges row */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Stock status */}
                  <span
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: stockCfg.bg, color: stockCfg.color, border: `1px solid ${stockCfg.border}` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: stockCfg.color }} />
                    {stockCfg.label}
                  </span>

                  {/* Product tag */}
                  {tagCfg && (
                    <span
                      className="flex items-center gap-1 px-3 py-1 rounded-full"
                      style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: tagCfg.bg, color: tagCfg.color, border: `1px solid ${tagCfg.border}` }}
                    >
                      {tagCfg.icon} {tagCfg.label}
                    </span>
                  )}

                  {/* Active / Inactive */}
                  <span
                    className="flex items-center gap-1 px-3 py-1 rounded-full"
                    style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: productData.is_active ? "#f0fdf4" : "#fef2f2", color: productData.is_active ? "#15803d" : "#dc2626", border: `1px solid ${productData.is_active ? "#bbf7d0" : "#fecaca"}` }}
                  >
                    {productData.is_active
                      ? <ToggleOnOutlinedIcon style={{ fontSize: 14 }} />
                      : <ToggleOffOutlinedIcon style={{ fontSize: 14 }} />
                    }
                    {productData.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Name */}
                <div>
                  <h2 style={{ ...SORA, fontSize: 19, fontWeight: 900, color: "#111", lineHeight: 1.3, letterSpacing: "-0.3px" }}>
                    {productData.name}
                  </h2>
                  {/* Slug */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <LinkOutlinedIcon style={{ fontSize: 13, color: "#ccc" }} />
                    <span className="break-all" style={{ ...INTER, fontSize: 11, color: "#bbb", fontFamily: "'Courier New', monospace" }}>
                      /{productData.slug}
                    </span>
                  </div>
                </div>

                {/* Brand + Category row */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Brand with logo */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#ebebeb] bg-[#fafafa]">
                    {productData.logo_url && (
                      <img src={productData.logo_url} alt={productData.brand_name} className="w-5 h-5 object-contain rounded" onError={(e) => e.target.style.display = "none"} />
                    )}
                    <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#111" }}>{productData.brand_name}</span>
                  </div>

                  {/* Category with image */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#ebebeb] bg-[#fafafa]">
                    <CategoryOutlinedIcon style={{ fontSize: 14, color: "#888" }} />
                    <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#111" }}>{productData.category_name}</span>
                    <span
                      className="px-1.5 py-0.5 rounded-md ml-1"
                      style={{ ...INTER, fontSize: 9, fontWeight: 700, backgroundColor: "#f0f0f0", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}
                    >
                      {productData.category_type}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p style={{ ...INTER, fontSize: 13, color: "#666", lineHeight: 1.75 }}>
                  {productData.description}
                </p>

                {/* Warranty */}
                <div className="flex items-center gap-2">
                  <VerifiedOutlinedIcon style={{ fontSize: 16, color: "#16a34a" }} />
                  <span style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#16a34a" }}>
                    {productData.warranty_months} Month{productData.warranty_months !== 1 ? "s" : ""} Warranty
                  </span>
                </div>

                {/* Stock bar */}
                <div className="rounded-xl px-4 py-3 mt-auto" style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}>
                  <StockBar qty={productData.stock_quantity} max={50} />
                </div>

                {/* Dates */}
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                  {[
                    { label: "Created",      value: formatDateWithTime(productData.created_at).split("  ")[0] },
                    { label: "Last Updated", value: formatDateWithTime(productData.updated_at).split("  ")[0] },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ ...INTER, fontSize: 10, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                      <p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#555" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Attributes ── */}
          <SectionCard>
            <SectionTitle icon={<TagOutlinedIcon style={{ fontSize: 16 }} />}>
              Product Attributes ({productData.attributes?.length || 0})
            </SectionTitle>
            {productData.attributes?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {productData.attributes.map((attr) => (
                  <AttrChip
                    key={attr.product_attribute_id}
                    name={attr.attribute_name}
                    value={attr.value}
                  />
                ))}
              </div>
            ) : (
              <p style={{ ...INTER, fontSize: 13, color: "#bbb" }}>No attributes added.</p>
            )}
          </SectionCard>

          {/* ── Image list ── */}
          {sortedImages.length > 0 && (
            <SectionCard>
              <SectionTitle icon={<InventoryOutlinedIcon style={{ fontSize: 16 }} />}>
                Product Images ({sortedImages.length})
              </SectionTitle>
              <div className="flex flex-col gap-3">
                {sortedImages.map((img, idx) => (
                  <div
                    key={img.image_id}
                    className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl cursor-pointer transition-all"
                    style={{ backgroundColor: activeImg === idx ? "#f0f6ff" : "#f9f9f9", border: `1px solid ${activeImg === idx ? "#93c5fd" : "#f0f0f0"}` }}
                    onClick={() => { setActiveImg(idx); setImgErr(false); }}
                  >
                    {/* Thumb */}
                    <div className="flex items-center justify-center rounded-lg overflow-hidden shrink-0 bg-white border border-[#ebebeb]" style={{ width: 52, height: 52 }}>
                      <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-contain p-1" onError={(e) => { e.target.style.display = "none"; }} />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="truncate" style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#111" }}>{img.alt_text || `Image ${idx + 1}`}</p>
                      <p className="truncate mt-0.5" style={{ ...INTER, fontSize: 11, color: "#bbb", fontFamily: "'Courier New', monospace" }}>{img.image_url}</p>
                    </div>
                    {/* Badges */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {img.is_primary && (
                        <span className="px-2 py-0.5 rounded-full" style={{ ...INTER, fontSize: 9, fontWeight: 700, backgroundColor: "#dbeafe", color: "#1d4ed8" }}>Primary</span>
                      )}
                      <span style={{ ...INTER, fontSize: 10, color: "#ccc" }}>#{img.image_id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="flex flex-col gap-4 sm:gap-5">

          {/* Pricing card */}
          <SectionCard>
            <SectionTitle icon={<LocalOfferOutlinedIcon style={{ fontSize: 16 }} />}>
              Pricing
            </SectionTitle>

            {/* Hero price */}
            <div className="flex flex-col items-center py-5 mb-4 rounded-xl bg-[#f9f9f9] border border-[#f0f0f0]">
              <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Selling Price</p>
              <p className="mt-1" style={{ ...SORA, fontSize: 26, fontWeight: 900, color: "#e53935", letterSpacing: "-0.5px" }}>
                {fmt(productData.selling_price)}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUpOutlinedIcon style={{ fontSize: 14, color: "#16a34a" }} />
                <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#16a34a" }}>{marginPct}% margin</span>
              </div>
            </div>

            <InfoRow label="Base Price"       value={fmt(productData.base_price)}       />
            <InfoRow label="Selling Price"    value={fmt(productData.selling_price)}    accent />
            <InfoRow label="Discounted Price" value={fmt(productData.discounted_price)} />
            <InfoRow label="You Save"         value={`${fmt(savingAmt)} (${savingPct}%)`} />
            <InfoRow label="Profit Margin"    value={fmt(margin)} />
          </SectionCard>

          {/* Product details card */}
          <SectionCard>
            <SectionTitle icon={<CategoryOutlinedIcon style={{ fontSize: 16 }} />}>
              Product Details
            </SectionTitle>
            <InfoRow label="Product ID"  value={`#${productData.product_id}`} copyable />
            <InfoRow label="Slug"        value={productData.slug}              copyable mono />
            <InfoRow label="Brand"       value={productData.brand_name}        />
            <InfoRow label="Brand ID"    value={`#${productData.brand_id}`}   />
            <InfoRow label="Category"    value={productData.category_name}     />
            <InfoRow label="Category ID" value={`#${productData.category_id}`} />
            <InfoRow label="Cat. Type"   value={productData.category_type}     />
            <InfoRow label="Warranty"    value={`${productData.warranty_months} months`} />
            <InfoRow label="Stock Qty"   value={`${productData.stock_quantity} units`} />
            <InfoRow label="Stock Status"value={productData.stock_status.replace("_", " ")} />
            <InfoRow label="Tag"         value={productData.product_tag?.replace("_", " ") || "—"} />
            <InfoRow label="Status"      value={productData.is_active ? "Active" : "Inactive"} />
            <InfoRow label="Created"     value={formatDateWithTime(productData.created_at)} />
            <InfoRow label="Updated"     value={formatDateWithTime(productData.updated_at)} />
          </SectionCard>

        </div>
      </div>
    </div>
  );
};

export default ProductInfoPage;