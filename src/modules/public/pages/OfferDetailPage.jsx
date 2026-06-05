import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackOutlinedIcon        from "@mui/icons-material/ArrowBackOutlined";
import PercentOutlinedIcon          from "@mui/icons-material/PercentOutlined";
import AttachMoneyOutlinedIcon      from "@mui/icons-material/AttachMoneyOutlined";
import CalendarTodayOutlinedIcon    from "@mui/icons-material/CalendarTodayOutlined";
import InventoryOutlinedIcon        from "@mui/icons-material/InventoryOutlined";
import ImageOutlinedIcon            from "@mui/icons-material/ImageOutlined";
import TagOutlinedIcon              from "@mui/icons-material/TagOutlined";
import AccessTimeOutlinedIcon       from "@mui/icons-material/AccessTimeOutlined";
import StorefrontOutlinedIcon       from "@mui/icons-material/StorefrontOutlined";
import BrokenImageOutlinedIcon      from "@mui/icons-material/BrokenImageOutlined";
import MoneyOffOutlinedIcon         from "@mui/icons-material/MoneyOffOutlined";
import OpenInNewOutlinedIcon        from "@mui/icons-material/OpenInNewOutlined";
import { useOfferById }             from "../features/offers/hooks/useOfferById.js";
import { formatDate }               from "../../../utils/dateFormatters.js";
import { daysRemaining }            from "../../admin/utils/promotionStatus";
import { SORA, INTER }              from "../../../styles/fonts";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(v) || 0);

const attrLabel = (name) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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
    <div className="flex items-center gap-2.5 mb-5 pb-3" style={{ borderBottom: "1px solid #f0f0f0" }}>
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

function InfoRow({ label, value, accent, mono, children }) {
  return (
    <div
      className="flex items-start justify-between gap-4 py-2.5"
      style={{ borderBottom: "1px solid #f8f8f8" }}
    >
      <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa", flexShrink: 0, minWidth: 130 }}>
        {label}
      </span>
      <div className="text-right min-w-0">
        {children || (
          <span
            className="break-all"
            style={{
              ...INTER,
              fontSize: 13,
              fontWeight: 600,
              color: accent ? "#e53935" : "#111",
              fontFamily: mono ? "'Courier New', monospace" : INTER.fontFamily,
            }}
          >
            {value ?? "—"}
          </span>
        )}
      </div>
    </div>
  );
}

function AttrChip({ name, value }) {
  return (
    <div
      className="flex flex-col gap-1 px-3 py-2.5 rounded-xl"
      style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
    >
      <span style={{
        ...INTER, fontSize: 9, fontWeight: 700, color: "#aaa",
        textTransform: "uppercase", letterSpacing: "0.08em",
      }}>
        {attrLabel(name)}
      </span>
      <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#111", lineHeight: 1.4 }}>
        {value || "—"}
      </span>
    </div>
  );
}

// ─── LinkedProductCard ─────────────────────────────────────────────────────────
// Renders a single linked product entry. Each card manages its own image state
// so thumbnails don't interfere with each other when multiple products are shown.
function LinkedProductCard({ linkedProduct, productAttributes = [], onNavigate }) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [imgErr,       setImgErr]       = useState(false);

  const sortedImages = linkedProduct?.images
    ? [...linkedProduct.images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    : [];

  const currentImg = sortedImages[activeImgIdx] || null;

  const sellingPrice    = Number(linkedProduct?.selling_price)    || 0;
  const discountedPrice = Number(linkedProduct?.discounted_price) || 0;
  const discountAmt     = sellingPrice - discountedPrice;
  const discountPct     = sellingPrice > 0
    ? ((discountAmt / sellingPrice) * 100).toFixed(1)
    : "0.0";

  // Attributes: prefer the passed-in productAttributes, fall back to product's own attrs
  const attributes =
    productAttributes.length > 0
      ? productAttributes
      : linkedProduct?.attributes?.map((a) => ({
          product_attribute_id: a.product_attribute_id ?? a.id,
          attribute_name: a.attribute_name || a.name,
          value: a.value,
        })) || [];

  return (
    <div
      className="flex flex-col gap-5 pb-5"
      style={{ borderBottom: "1px solid #f0f0f0" }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image gallery */}
        <div className="flex flex-col gap-3 shrink-0">
          <div
            className="flex items-center justify-center rounded-2xl overflow-hidden"
            style={{
              width: "100%", maxWidth: 260, height: 220,
              backgroundColor: "#f7f7f7", border: "1px solid #f0f0f0",
            }}
          >
            {!imgErr && currentImg?.image_url ? (
              <img
                src={currentImg.image_url}
                alt={currentImg.alt_text || linkedProduct.name}
                className="max-w-full max-h-full object-contain p-3 transition-all duration-300"
                onError={() => setImgErr(true)}
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <BrokenImageOutlinedIcon style={{ fontSize: 40, color: "#ddd" }} />
                <span style={{ ...INTER, fontSize: 11, color: "#bbb" }}>No Image</span>
              </div>
            )}
          </div>

          {sortedImages.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {sortedImages.map((img, idx) => (
                <button
                  key={img.image_id || idx}
                  onClick={() => { setActiveImgIdx(idx); setImgErr(false); }}
                  className="rounded-xl overflow-hidden cursor-pointer p-0 flex items-center justify-center transition-all"
                  style={{
                    width: 52, height: 52,
                    backgroundColor: "#f7f7f7",
                    border: `2px solid ${activeImgIdx === idx ? "#111" : "#e5e5e5"}`,
                  }}
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || ""}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
          <p style={{ ...INTER, fontSize: 11, color: "#bbb" }}>
            {sortedImages.length} image{sortedImages.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {/* Name + View button */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <h3 style={{ ...SORA, fontSize: 16, fontWeight: 800, color: "#111", lineHeight: 1.35 }}>
              {linkedProduct.name}
            </h3>

            {/* ── View Product Button ── */}
            <button
              onClick={() => onNavigate(linkedProduct.product_id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl shrink-0 cursor-pointer transition-all"
              style={{
                ...INTER, fontSize: 12, fontWeight: 700,
                backgroundColor: "#111", color: "#fff", border: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#111")}
            >
              <OpenInNewOutlinedIcon style={{ fontSize: 14 }} />
              View Product
            </button>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                ...INTER, fontSize: 10, fontWeight: 700,
                backgroundColor: linkedProduct.is_active ? "#f0fdf4" : "#fef2f2",
                color:           linkedProduct.is_active ? "#15803d" : "#dc2626",
                border:         `1px solid ${linkedProduct.is_active ? "#bbf7d0" : "#fecaca"}`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: linkedProduct.is_active ? "#16a34a" : "#e53935" }}
              />
              {linkedProduct.is_active ? "Active" : "Inactive"}
            </span>
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                ...INTER, fontSize: 10, fontWeight: 700,
                backgroundColor: "#f0f0f0", color: "#555", border: "1px solid #e5e5e5",
              }}
            >
              <InventoryOutlinedIcon style={{ fontSize: 11 }} />
              {linkedProduct.stock_quantity ?? 0} in stock
            </span>
          </div>

          {/* Description */}
          {linkedProduct.description && (
            <p style={{ ...INTER, fontSize: 12, color: "#666", lineHeight: 1.7 }}>
              {linkedProduct.description}
            </p>
          )}

          {/* Pricing summary */}
          <div
            className="flex items-center gap-4 px-4 py-3 rounded-xl flex-wrap"
            style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
          >
            <div>
              <p style={{
                ...INTER, fontSize: 10, color: "#aaa", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.07em",
              }}>
                Selling Price
              </p>
              <p style={{ ...SORA, fontSize: 16, fontWeight: 900, color: "#111" }}>
                {fmt(linkedProduct.selling_price)}
              </p>
            </div>
            <div>
              <p style={{
                ...INTER, fontSize: 10, color: "#aaa", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.07em",
              }}>
                After Offer
              </p>
              <p style={{ ...SORA, fontSize: 16, fontWeight: 900, color: "#e53935" }}>
                {fmt(linkedProduct.discounted_price)}
              </p>
            </div>
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl"
              style={{ backgroundColor: "#dcfce7", border: "1px solid #86efac" }}
            >
              <MoneyOffOutlinedIcon style={{ fontSize: 14, color: "#15803d" }} />
              <span style={{ ...INTER, fontSize: 12, fontWeight: 800, color: "#15803d" }}>
                Save {fmt(discountAmt)} ({discountPct}%)
              </span>
            </div>
          </div>

          {/* Inline attributes (if any) */}
          {attributes.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
              {attributes.map((attr, idx) => (
                <AttrChip
                  key={attr.product_attribute_id ?? idx}
                  name={attr.attribute_name}
                  value={attr.value}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// OFFER DETAIL PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function OfferDetailPage({ onBack } = {}) {
  const navigate = useNavigate();
  const { id: routeOfferId } = useParams();

  const { offer, loading, error } = useOfferById(routeOfferId);

  const handleBack = onBack ?? (() => navigate(-1));

  const handleProductNavigation = (productId) => {
    navigate(`/product/${productId}`);
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6 flex items-center justify-center">
        <div
          className="bg-white rounded-2xl px-6 py-5"
          style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Loading offer…</p>
          <p style={{ ...INTER, fontSize: 13, color: "#777", marginTop: 4 }}>
            Fetching offer details and linked products.
          </p>
        </div>
      </div>
    );
  }

  // ── Error / not found state ───────────────────────────────────────────────
  if (error || !offer) {
    return (
      <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6 flex items-center justify-center">
        <div
          className="bg-white rounded-2xl px-6 py-5 max-w-md w-full"
          style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Offer not found</p>
          <p style={{ ...INTER, fontSize: 13, color: "#777", marginTop: 4 }}>
            {error || "The offer could not be loaded."}
          </p>
          <button
            onClick={handleBack}
            className="mt-4 flex items-center justify-center px-4 py-2.5 rounded-xl text-white cursor-pointer transition-all"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#222")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#111")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Derived data ──────────────────────────────────────────────────────────
  const title          = offer.title;
  const description    = offer.description;
  const start_date     = offer.startDate     || offer.start_date;
  const end_date       = offer.endDate       || offer.end_date;
  const is_active      = offer.isActive      ?? offer.is_active;
  const discount_type  = offer.discountType  || offer.discount_type;

  // ── All linked products (not just the first one) ──────────────────────────
  // The API may return products as an array of entries like { product: {...} }
  // or directly as product objects — normalize both shapes.
  const rawProducts = offer.products || [];
  const linkedProducts = rawProducts.map((entry) => entry?.product || entry).filter(Boolean);

  // productAttributes from the offer (shared across products or per-product
  // depending on your API shape — keep the same fallback as before)
  const productAttributes = offer.productAttributes || [];

  // Banner — falls back to the first product's first image if no dedicated banner
  const firstProductImages = linkedProducts[0]?.images
    ? [...linkedProducts[0].images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    : [];

  const bannerImage =
    offer.displayImage ||
    offer.banner_image ||
    firstProductImages[0]?.image_url ||
    null;

  // Time remaining
  const { expired, days } = daysRemaining(end_date);

  // Discount amount for the badge — derived from first product as a representative
  const firstProduct    = linkedProducts[0] || null;
  const sellingPrice    = Number(firstProduct?.selling_price)    || 0;
  const discountedPrice = Number(firstProduct?.discounted_price) || 0;
  const discountAmt     = sellingPrice - discountedPrice;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer"
          >
            <ArrowBackOutlinedIcon style={{ fontSize: 18 }} />
          </button>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Offers / Detail</p>
            <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
              Offer Info
            </h1>
          </div>
        </div>
      </div>

      {/* ── 3-col grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ══ LEFT + CENTRE (col-span-2) ══ */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* ── Offer overview ── */}
          <SectionCard>
            <div className="flex flex-col gap-4">

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{
                    ...INTER, fontSize: 11, fontWeight: 700,
                    backgroundColor: is_active ? "#f0fdf4" : "#fef2f2",
                    color:           is_active ? "#15803d" : "#dc2626",
                    border:         `1px solid ${is_active ? "#bbf7d0" : "#fecaca"}`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: is_active ? "#16a34a" : "#e53935" }}
                  />
                  {is_active ? "Active" : "Inactive"}
                </span>

                <span
                  className="flex items-center gap-1 px-3 py-1 rounded-full"
                  style={{
                    ...INTER, fontSize: 11, fontWeight: 700,
                    backgroundColor: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa",
                  }}
                >
                  {discount_type === "percentage"
                    ? <PercentOutlinedIcon style={{ fontSize: 12 }} />
                    : <AttachMoneyOutlinedIcon style={{ fontSize: 12 }} />
                  }
                  {fmt(discountAmt)}
                </span>

                <span
                  className="flex items-center gap-1 px-3 py-1 rounded-full"
                  style={{
                    ...INTER, fontSize: 11, fontWeight: 700,
                    backgroundColor: expired ? "#f5f5f5" : "#eff6ff",
                    color:           expired ? "#888"    : "#1d4ed8",
                    border:         `1px solid ${expired ? "#e5e5e5" : "#bfdbfe"}`,
                  }}
                >
                  <AccessTimeOutlinedIcon style={{ fontSize: 12 }} />
                  {expired ? "Expired" : `${days} day${days !== 1 ? "s" : ""} left`}
                </span>
              </div>

              {/* Title */}
              <div>
                <h2 style={{
                  ...SORA, fontSize: 22, fontWeight: 900, color: "#111",
                  lineHeight: 1.25, letterSpacing: "-0.3px", textTransform: "capitalize",
                }}>
                  {title}
                </h2>
                {description && (
                  <p style={{ ...INTER, fontSize: 13, color: "#666", lineHeight: 1.75, marginTop: 8 }}>
                    {description}
                  </p>
                )}
              </div>

              {/* Date range */}
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { label: "Starts", value: formatDate(start_date) },
                  { label: "Ends",   value: formatDate(end_date)   },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-1"
                    style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0", minWidth: 180 }}
                  >
                    <CalendarTodayOutlinedIcon style={{ fontSize: 15, color: "#bbb", flexShrink: 0 }} />
                    <div>
                      <p style={{
                        ...INTER, fontSize: 10, fontWeight: 700, color: "#bbb",
                        textTransform: "uppercase", letterSpacing: "0.07em",
                      }}>
                        {label}
                      </p>
                      <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#111" }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Banner image */}
              {bannerImage ? (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid #f0f0f0", aspectRatio: "10 / 3" }}
                >
                  <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div
                  className="flex items-center justify-center rounded-2xl gap-3"
                  style={{ height: 80, backgroundColor: "#f9f9f9", border: "1.5px dashed #e5e5e5" }}
                >
                  <ImageOutlinedIcon style={{ fontSize: 20, color: "#ccc" }} />
                  <span style={{ ...INTER, fontSize: 12, color: "#ccc", fontWeight: 600 }}>
                    No banner image
                  </span>
                </div>
              )}
            </div>
          </SectionCard>

          {/* ── Linked Products ── */}
          {linkedProducts.length > 0 && (
            <SectionCard>
              <SectionTitle icon={<StorefrontOutlinedIcon style={{ fontSize: 16 }} />}>
                Product
              </SectionTitle>

              <div className="flex flex-col gap-6">
                {linkedProducts.map((product, idx) => (
                  <LinkedProductCard
                    key={product.product_id ?? idx}
                    linkedProduct={product}
                    productAttributes={idx === 0 ? productAttributes : (product.attributes ? [] : [])}
                    onNavigate={handleProductNavigation}
                  />
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="flex flex-col gap-5">

          {/* Product summaries — one card per product */}
          {linkedProducts.map((product, idx) => {
            const sp  = Number(product.selling_price)    || 0;
            const dp  = Number(product.discounted_price) || 0;
            const amt = sp - dp;
            const pct = sp > 0 ? ((amt / sp) * 100).toFixed(1) : "0.0";

            return (
              <SectionCard key={product.product_id ?? idx}>
                <SectionTitle icon={<InventoryOutlinedIcon style={{ fontSize: 16 }} />}>
                  {linkedProducts.length > 1 ? product.name || `Product ${idx + 1}` : "Product Summary"}
                </SectionTitle>
                <InfoRow label="Selling Price" value={fmt(product.selling_price)} accent />
                <InfoRow label="After Offer"   value={fmt(product.discounted_price)} />
                <InfoRow label="You Save"      value={`${fmt(amt)} (${pct}%)`} />
                <InfoRow label="Stock"         value={`${product.stock_quantity ?? 0} units`} />
                <InfoRow label="Status">
                  <span
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
                    style={{
                      ...INTER, fontSize: 11, fontWeight: 700,
                      backgroundColor: product.is_active ? "#f0fdf4" : "#fef2f2",
                      color:           product.is_active ? "#15803d" : "#dc2626",
                      border:         `1px solid ${product.is_active ? "#bbf7d0" : "#fecaca"}`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: product.is_active ? "#16a34a" : "#e53935" }}
                    />
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </InfoRow>
                {/* View button in sidebar too */}
                <button
                  onClick={() => handleProductNavigation(product.product_id)}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                  style={{
                    ...INTER, fontSize: 12, fontWeight: 700,
                    backgroundColor: "#f5f5f5", color: "#111",
                    border: "1px solid #e5e5e5",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#111";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                    e.currentTarget.style.color = "#111";
                  }}
                >
                  <OpenInNewOutlinedIcon style={{ fontSize: 14 }} />
                  View Product
                </button>
              </SectionCard>
            );
          })}

          {/* Specifications — shown once (from offer-level productAttributes) */}
          {productAttributes.length > 0 && (
            <SectionCard>
              <SectionTitle icon={<TagOutlinedIcon style={{ fontSize: 16 }} />}>
                Specifications ({productAttributes.length})
              </SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {productAttributes.map((attr, idx) => (
                  <AttrChip
                    key={attr.product_attribute_id ?? idx}
                    name={attr.attribute_name}
                    value={attr.value}
                  />
                ))}
              </div>
            </SectionCard>
          )}

        </div>
      </div>
    </div>
  );
}