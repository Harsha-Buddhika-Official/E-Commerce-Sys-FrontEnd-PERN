import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackOutlinedIcon        from "@mui/icons-material/ArrowBackOutlined";
import PercentOutlinedIcon          from "@mui/icons-material/PercentOutlined";
import AttachMoneyOutlinedIcon      from "@mui/icons-material/AttachMoneyOutlined";
import CalendarTodayOutlinedIcon    from "@mui/icons-material/CalendarTodayOutlined";
import InventoryOutlinedIcon        from "@mui/icons-material/InventoryOutlined";
import ImageOutlinedIcon            from "@mui/icons-material/ImageOutlined";
import TagOutlinedIcon              from "@mui/icons-material/TagOutlined";
import LinkOutlinedIcon             from "@mui/icons-material/LinkOutlined";
import AccessTimeOutlinedIcon       from "@mui/icons-material/AccessTimeOutlined";
import StorefrontOutlinedIcon       from "@mui/icons-material/StorefrontOutlined";
import BrokenImageOutlinedIcon      from "@mui/icons-material/BrokenImageOutlined";
import MoneyOffOutlinedIcon         from "@mui/icons-material/MoneyOffOutlined";
import { fetchOfferById, fetchOfferProducts } from "../features/offers/service/offers.service.js";

// ─── Font constants ───────────────────────────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(Number(v) || 0);

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    + "  " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const daysRemaining = (endIso) => {
  const diff = new Date(endIso) - new Date();
  if (diff <= 0) return { expired: true, days: 0 };
  return { expired: false, days: Math.ceil(diff / (1000 * 60 * 60 * 24)) };
};

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
      <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: "#f5f5f5", color: "#111" }}>
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
    <div className="flex items-start justify-between gap-4 py-2.5" style={{ borderBottom: "1px solid #f8f8f8" }}>
      <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa", flexShrink: 0, minWidth: 130 }}>{label}</span>
      <div className="text-right min-w-0">
        {children || (
          <span className="break-all" style={{
            ...INTER, fontSize: 13, fontWeight: 600,
            color: accent ? "#e53935" : "#111",
            fontFamily: mono ? "'Courier New', monospace" : INTER.fontFamily,
          }}>
            {value ?? "—"}
          </span>
        )}
      </div>
    </div>
  );
}

function AttrChip({ name, value }) {
  return (
    <div className="flex flex-col gap-1 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}>
      <span style={{ ...INTER, fontSize: 9, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {attrLabel(name)}
      </span>
      <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#111", lineHeight: 1.4 }}>
        {value || "—"}
      </span>
    </div>
  );
}

const NOOP = () => {};

// ══════════════════════════════════════════════════════════════════════════════
// OFFER DETAIL PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function OfferDetailPage({
  offerData = null,
  onBack    = NOOP,
}) {
  const navigate = useNavigate();
  const { id: routeOfferId } = useParams();

  const [offer, setOffer] = useState(offerData || null);
  const [loading, setLoading] = useState(!offerData);
  const [error, setError] = useState("");
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [imgErr,       setImgErr]       = useState(false);

  const offerRecord    = offer || {};
  const offerStartDate = offerRecord.startDate || offerRecord.start_date;
  const offerEndDate   = offerRecord.endDate || offerRecord.end_date;
  const isActive       = offerRecord.isActive ?? offerRecord.is_active;
  const discountType   = offerRecord.discountType || offerRecord.discount_type;
  const discountValue  = offerRecord.discountValue ?? offerRecord.discount_value;

  useEffect(() => {
    let cancelled = false;

    const loadOffer = async () => {
      if (offerData) {
        setOffer(offerData);
        setLoading(false);
        setError("");
        return;
      }

      if (!routeOfferId) {
        setOffer(null);
        setLoading(false);
        setError("Missing offer id.");
        return;
      }

      setLoading(true);
      setError("");

      const [offerResult, productsResult] = await Promise.all([
        fetchOfferById(routeOfferId),
        fetchOfferProducts(routeOfferId),
      ]);

      if (cancelled) return;

      if (!offerResult) {
        setOffer(null);
        setError("Failed to load offer details.");
        setLoading(false);
        return;
      }

      setOffer({
        ...offerResult,
        products: Array.isArray(offerResult.products) && offerResult.products.length > 0
          ? offerResult.products
          : productsResult,
      });
      setLoading(false);
    };

    loadOffer();

    return () => {
      cancelled = true;
    };
  }, [offerData, routeOfferId]);

  const handleBack = onBack !== NOOP ? onBack : () => navigate(-1);

  if (loading) {
    return (
      <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl px-6 py-5" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Loading offer…</p>
          <p style={{ ...INTER, fontSize: 13, color: "#777", marginTop: 4 }}>Fetching offer details and linked products.</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl px-6 py-5 max-w-md w-full" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Offer not found</p>
          <p style={{ ...INTER, fontSize: 13, color: "#777", marginTop: 4 }}>{error || "The offer could not be loaded."}</p>
          <button
            onClick={handleBack}
            className="mt-4 flex items-center justify-center px-4 py-2.5 rounded-xl text-white cursor-pointer transition-all"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#222"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#111"}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { expired, days } = daysRemaining(offerEndDate);

  // ── Product (first linked product) ───────────────────────────────────────
  const linkedProduct = offer.products?.[0]?.product || offer.products?.[0] || null;
  const sortedImages  = linkedProduct
    ? [...(linkedProduct.images || [])].sort((a, b) => a.sort_order - b.sort_order)
    : [];
  const currentImg = sortedImages[activeImgIdx];
  const bannerImage = offer.displayImage || offer.banner_image || getPrimaryImage(linkedProduct?.images)?.image_url || null;

  // ── Pricing calcs ─────────────────────────────────────────────────────────
  const sellingPrice    = Number(linkedProduct?.selling_price ?? linkedProduct?.sellingPrice)    || 0;
  const discountedPrice = Number(linkedProduct?.discounted_price ?? linkedProduct?.discountedPrice) || 0;
  const discountAmt     = sellingPrice - discountedPrice;
  const discountPct     = sellingPrice > 0 ? ((discountAmt / sellingPrice) * 100).toFixed(1) : "0.0";

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
            <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Offer Info</h1>
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
                {/* Active status */}
                <span
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{
                    ...INTER, fontSize: 11, fontWeight: 700,
                    backgroundColor: isActive ? "#f0fdf4" : "#fef2f2",
                    color:           isActive ? "#15803d" : "#dc2626",
                    border:          `1px solid ${isActive ? "#bbf7d0" : "#fecaca"}`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: isActive ? "#16a34a" : "#e53935" }} />
                  {isActive ? "Active" : "Inactive"}
                </span>

                {/* Discount badge */}
                <span
                  className="flex items-center gap-1 px-3 py-1 rounded-full"
                  style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" }}
                >
                  {discountType === "percentage"
                    ? <PercentOutlinedIcon style={{ fontSize: 12 }} />
                    : <AttachMoneyOutlinedIcon style={{ fontSize: 12 }} />
                  }
                  {discountType === "percentage"
                    ? `${parseFloat(discountValue)}% Off`
                    : `LKR ${parseFloat(discountValue).toLocaleString()} Off`
                  }
                </span>

                {/* Time remaining / expired */}
                <span
                  className="flex items-center gap-1 px-3 py-1 rounded-full"
                  style={{
                    ...INTER, fontSize: 11, fontWeight: 700,
                    backgroundColor: expired ? "#f5f5f5" : "#eff6ff",
                    color:           expired ? "#888"    : "#1d4ed8",
                    border:          `1px solid ${expired ? "#e5e5e5" : "#bfdbfe"}`,
                  }}
                >
                  <AccessTimeOutlinedIcon style={{ fontSize: 12 }} />
                  {expired ? "Expired" : `${days} day${days !== 1 ? "s" : ""} left`}
                </span>
              </div>

              {/* Title */}
              <div>
                <h2 style={{ ...SORA, fontSize: 22, fontWeight: 900, color: "#111", lineHeight: 1.25, letterSpacing: "-0.3px", textTransform: "capitalize" }}>
                  {offer.title}
                </h2>
                {offer.description && (
                  <p style={{ ...INTER, fontSize: 13, color: "#666", lineHeight: 1.75, marginTop: 8 }}>
                    {offer.description}
                  </p>
                )}
              </div>

              {/* Date range */}
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { label: "Starts",   value: formatDate(offerStartDate) },
                  { label: "Ends",     value: formatDate(offerEndDate)   },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-1"
                    style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0", minWidth: 180 }}
                  >
                    <CalendarTodayOutlinedIcon style={{ fontSize: 15, color: "#bbb", flexShrink: 0 }} />
                    <div>
                      <p style={{ ...INTER, fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
                      <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#111" }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Banner image */}
              {bannerImage ? (
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #f0f0f0", aspectRatio: "10 / 3" }}>
                  <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div
                  className="flex items-center justify-center rounded-2xl gap-3"
                  style={{ height: 80, backgroundColor: "#f9f9f9", border: "1.5px dashed #e5e5e5" }}
                >
                  <ImageOutlinedIcon style={{ fontSize: 20, color: "#ccc" }} />
                  <span style={{ ...INTER, fontSize: 12, color: "#ccc", fontWeight: 600 }}>No banner image</span>
                </div>
              )}
            </div>
          </SectionCard>

          {/* ── Linked Product ── */}
          {linkedProduct && (
            <SectionCard>
              <SectionTitle icon={<StorefrontOutlinedIcon style={{ fontSize: 16 }} />}>
                Linked Product
              </SectionTitle>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Image gallery */}
                <div className="flex flex-col gap-3 flex-shrink-0">
                  {/* Main image */}
                  <div
                    className="flex items-center justify-center rounded-2xl overflow-hidden"
                    style={{ width: "100%", maxWidth: 260, height: 220, backgroundColor: "#f7f7f7", border: "1px solid #f0f0f0" }}
                  >
                    {!imgErr && currentImg?.image_url ? (
                      <img
                        src={currentImg.image_url}
                        alt={currentImg.alt_text}
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

                  {/* Thumbnails */}
                  {sortedImages.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                      {sortedImages.map((img, idx) => (
                        <button
                          key={img.image_id}
                          onClick={() => { setActiveImgIdx(idx); setImgErr(false); }}
                          className="rounded-xl overflow-hidden cursor-pointer p-0 flex items-center justify-center transition-all"
                          style={{
                            width: 52, height: 52,
                            backgroundColor: "#f7f7f7",
                            border: `2px solid ${activeImgIdx === idx ? "#111" : "#e5e5e5"}`,
                          }}
                        >
                          <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-contain p-1" onError={() => {}} />
                        </button>
                      ))}
                    </div>
                  )}
                  <p style={{ ...INTER, fontSize: 11, color: "#bbb" }}>{sortedImages.length} image{sortedImages.length !== 1 ? "s" : ""}</p>
                </div>

                {/* Product info */}
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                  {/* Name */}
                  <div>
                    <h3 style={{ ...SORA, fontSize: 16, fontWeight: 800, color: "#111", lineHeight: 1.35 }}>
                      {linkedProduct.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <LinkOutlinedIcon style={{ fontSize: 12, color: "#ccc" }} />
                      <span style={{ ...INTER, fontSize: 11, color: "#bbb", fontFamily: "'Courier New', monospace" }}>
                        /{linkedProduct.slug}
                      </span>
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{
                        ...INTER, fontSize: 10, fontWeight: 700,
                        backgroundColor: linkedProduct.is_active ? "#f0fdf4" : "#fef2f2",
                        color:           linkedProduct.is_active ? "#15803d" : "#dc2626",
                        border:          `1px solid ${linkedProduct.is_active ? "#bbf7d0" : "#fecaca"}`,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: linkedProduct.is_active ? "#16a34a" : "#e53935" }} />
                      {linkedProduct.is_active ? "Active" : "Inactive"}
                    </span>
                    <span
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#f0f0f0", color: "#555", border: "1px solid #e5e5e5" }}
                    >
                      <InventoryOutlinedIcon style={{ fontSize: 11 }} />
                      {linkedProduct.stock_quantity} in stock
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{ ...INTER, fontSize: 12, color: "#666", lineHeight: 1.7 }}>
                    {linkedProduct.description}
                  </p>

                  {/* Pricing summary */}
                  <div
                    className="flex items-center gap-4 px-4 py-3 rounded-xl flex-wrap"
                    style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
                  >
                    <div>
                      <p style={{ ...INTER, fontSize: 10, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Selling Price</p>
                      <p style={{ ...SORA, fontSize: 16, fontWeight: 900, color: "#111" }}>{fmt(linkedProduct.selling_price)}</p>
                    </div>
                    <div>
                      <p style={{ ...INTER, fontSize: 10, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>After Offer</p>
                      <p style={{ ...SORA, fontSize: 16, fontWeight: 900, color: "#e53935" }}>{fmt(linkedProduct.discounted_price)}</p>
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
                </div>
              </div>
            </SectionCard>
          )}

          {/* ── Product Attributes (moved to right panel) ── */}
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="flex flex-col gap-5">

          {/* Product summary */}
          {linkedProduct && (
            <SectionCard>
              <SectionTitle icon={<InventoryOutlinedIcon style={{ fontSize: 16 }} />}>
                Product Summary
              </SectionTitle>
              <InfoRow label="Selling Price" value={fmt(linkedProduct.selling_price)} accent />
              <InfoRow label="After Offer"   value={fmt(linkedProduct.discounted_price)} />
              <InfoRow label="You Save"      value={`${fmt(discountAmt)} (${discountPct}%)`} />
              <InfoRow label="Stock"         value={`${linkedProduct.stock_quantity} units`} />
              <InfoRow label="Status">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
                  style={{ ...INTER, fontSize: 11, fontWeight: 700,
                    backgroundColor: linkedProduct.is_active ? "#f0fdf4" : "#fef2f2",
                    color: linkedProduct.is_active ? "#15803d" : "#dc2626",
                    border: `1px solid ${linkedProduct.is_active ? "#bbf7d0" : "#fecaca"}` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: linkedProduct.is_active ? "#16a34a" : "#e53935" }} />
                  {linkedProduct.is_active ? "Active" : "Inactive"}
                </span>
              </InfoRow>
            </SectionCard>
          )}

          {/* ── Specifications (moved from left column) ── */}
          {linkedProduct?.attributes?.length > 0 && (
            <SectionCard>
              <SectionTitle icon={<TagOutlinedIcon style={{ fontSize: 16 }} />}>
                Specifications ({linkedProduct.attributes.length})
              </SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {linkedProduct.attributes.map((attr) => (
                  <AttrChip
                    key={attr.product_attribute_id}
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
