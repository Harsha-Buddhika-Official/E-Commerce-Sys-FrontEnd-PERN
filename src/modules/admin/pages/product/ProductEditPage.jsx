import { useState } from "react";
import ArrowBackOutlinedIcon        from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon             from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon            from "@mui/icons-material/CloseOutlined";
import LocalOfferOutlinedIcon       from "@mui/icons-material/LocalOfferOutlined";
import CategoryOutlinedIcon         from "@mui/icons-material/CategoryOutlined";
import InventoryOutlinedIcon        from "@mui/icons-material/InventoryOutlined";
import VerifiedOutlinedIcon         from "@mui/icons-material/VerifiedOutlined";
import TagOutlinedIcon              from "@mui/icons-material/TagOutlined";
import AddOutlinedIcon              from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon    from "@mui/icons-material/DeleteOutlineOutlined";
import ImageOutlinedIcon            from "@mui/icons-material/ImageOutlined";
import DragIndicatorOutlinedIcon    from "@mui/icons-material/DragIndicatorOutlined";
import StarOutlinedIcon             from "@mui/icons-material/StarOutlined";
import CheckCircleOutlinedIcon      from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon     from "@mui/icons-material/WarningAmberOutlined";
import BrokenImageOutlinedIcon      from "@mui/icons-material/BrokenImageOutlined";
import InfoOutlinedIcon             from "@mui/icons-material/InfoOutlined";

// ─── Font constants ───────────────────────────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Mock product ─────────────────────────────────────────────────────────────
const MOCK_PRODUCT = {
  product_id: 54,
  name: "Sony PlayStation 5 Console Standard Edition",
  slug: "sony-playstation-5-console-standard-edition",
  description: "Next-generation PlayStation 5 gaming console featuring ultra-fast SSD storage, ray tracing support, 4K gaming, and immersive DualSense controller experience.",
  base_price: "185000.00",
  selling_price: "225000.00",
  discounted_price: "210000.00",
  stock_quantity: 15,
  stock_status: "IN_STOCK",
  warranty_months: 12,
  product_tag: "BEST_SELLER",
  is_active: true,
  created_at: "2026-05-07T19:47:33.316Z",
  updated_at: "2026-05-11T10:49:46.286Z",
  category_id: 47,
  category_name: "Consoles",
  category_slug: "consoles",
  category_type: "accessory",
  category_image: "https://res.cloudinary.com/dlolgk9bo/image/upload/v1778069632/controller_hqhuab.jpg",
  category_active: true,
  brand_id: 31,
  brand_name: "Sony",
  brand_slug: "sony",
  logo_url: "https://logo.clearbit.com/sony.com",
  brand_active: true,
  attributes: [
    { product_attribute_id: 220, attribute_id: 341, attribute_name: "processor",           attribute_value_id: null, value: "AMD Ryzen Zen 2 8-Core Processor" },
    { product_attribute_id: 221, attribute_id: 342, attribute_name: "gpu",                 attribute_value_id: null, value: "AMD RDNA 2 GPU" },
    { product_attribute_id: 222, attribute_id: 270, attribute_name: "storage_capacity",    attribute_value_id: null, value: "825GB Custom NVMe SSD" },
    { product_attribute_id: 223, attribute_id: 343, attribute_name: "resolution_support",  attribute_value_id: null, value: "Up to 4K 120Hz / 8K Support" },
    { product_attribute_id: 224, attribute_id: 272, attribute_name: "connectivity",        attribute_value_id: null, value: "WiFi 6, Bluetooth 5.1, Ethernet" },
    { product_attribute_id: 225, attribute_id: 273, attribute_name: "included_accessories",attribute_value_id: null, value: "DualSense Wireless Controller, HDMI Cable, Power Cable" },
    { product_attribute_id: 226, attribute_id: 344, attribute_name: "controller_included", attribute_value_id: null, value: "Yes" },
  ],
  images: [
    { image_id: 68, image_url: "https://xmobile.lk/wp-content/uploads/2023/10/ps5.jpg",                                                             is_primary: true,  alt_text: "Sony PlayStation 5 Console Front View", sort_order: 0 },
    { image_id: 69, image_url: "https://s3-ap-southeast-1.amazonaws.com/media.cameralk.com/14498/PS5-Hero-Packshot-us.webp", is_primary: false, alt_text: "Sony PlayStation 5 Hero Image",         sort_order: 1 },
  ],
};

// ─── Options ──────────────────────────────────────────────────────────────────
const STOCK_STATUS_OPTIONS = ["IN_STOCK", "OUT_OF_STOCK", "LOW_STOCK"];
const PRODUCT_TAG_OPTIONS  = ["BEST_SELLER", "NEW", "HOT", "SALE", "NONE"];

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

function FieldLabel({ children, required = false }) {
  return (
    <label style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
      {children} {required && <span style={{ color: "#e53935" }}>*</span>}
    </label>
  );
}

function TextInput({ label, value, onChange, placeholder, required, mono, type = "text", min, step }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        type={type}
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full outline-none transition-all"
        style={{
          ...INTER,
          fontSize: 13,
          fontWeight: 600,
          color: "#111",
          fontFamily: mono ? "'Courier New', monospace" : INTER.fontFamily,
          backgroundColor: "#f9f9f9",
          border: "1.5px solid #ebebeb",
          borderRadius: 12,
          padding: "10px 14px",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
        onBlur={(e) => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
      />
    </div>
  );
}

function TextareaInput({ label, value, onChange, placeholder, required, rows = 4 }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full outline-none resize-none transition-all"
        style={{
          ...INTER,
          fontSize: 13,
          fontWeight: 500,
          color: "#111",
          lineHeight: 1.7,
          backgroundColor: "#f9f9f9",
          border: "1.5px solid #ebebeb",
          borderRadius: 12,
          padding: "10px 14px",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
        onBlur={(e) => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
      />
    </div>
  );
}

function SelectInput({ label, value, onChange, options, required }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full outline-none cursor-pointer transition-all appearance-none"
        style={{
          ...INTER,
          fontSize: 13,
          fontWeight: 600,
          color: "#111",
          backgroundColor: "#f9f9f9",
          border: "1.5px solid #ebebeb",
          borderRadius: 12,
          padding: "10px 14px",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
        onBlur={(e) => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleSwitch({ label, checked, onChange, description }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl" style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}>
      <div>
        <p style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#111" }}>{label}</p>
        {description && <p style={{ ...INTER, fontSize: 11, color: "#aaa", marginTop: 2 }}>{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="relative shrink-0 transition-all cursor-pointer"
        style={{
          width: 44,
          height: 24,
          borderRadius: 999,
          backgroundColor: checked ? "#111" : "#e0e0e0",
          border: "none",
          padding: 0,
        }}
      >
        <div
          className="absolute top-1 transition-all duration-200"
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: "#fff",
            left: checked ? 24 : 4,
            boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
          }}
        />
      </button>
    </div>
  );
}

function ImageRow({ img, index, isOnly, onRemove, onSetPrimary, onUpdateField }) {
  const [previewErr, setPreviewErr] = useState(false);
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl"
      style={{ backgroundColor: "#f9f9f9", border: `1.5px solid ${img.is_primary ? "#111" : "#f0f0f0"}` }}
    >
      {/* Drag handle */}
      <div className="flex items-center justify-center pt-2 cursor-grab" style={{ color: "#ccc" }}>
        <DragIndicatorOutlinedIcon style={{ fontSize: 18 }} />
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center rounded-xl overflow-hidden shrink-0 border border-[#ebebeb] bg-white" style={{ width: 56, height: 56 }}>
        {!previewErr && img.image_url ? (
          <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-contain p-1" onError={() => setPreviewErr(true)} />
        ) : (
          <BrokenImageOutlinedIcon style={{ fontSize: 22, color: "#ccc" }} />
        )}
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <input
          value={img.image_url}
          onChange={(e) => onUpdateField(index, "image_url", e.target.value)}
          placeholder="Image URL"
          className="w-full outline-none transition-all"
          style={{ ...INTER, fontSize: 11, fontWeight: 500, color: "#111", backgroundColor: "#fff", border: "1.5px solid #ebebeb", borderRadius: 8, padding: "7px 10px", fontFamily: "'Courier New', monospace" }}
          onFocus={(e) => { e.target.style.borderColor = "#111"; setPreviewErr(false); }}
          onBlur={(e) => e.target.style.borderColor = "#ebebeb"}
        />
        <input
          value={img.alt_text}
          onChange={(e) => onUpdateField(index, "alt_text", e.target.value)}
          placeholder="Alt text"
          className="w-full outline-none transition-all"
          style={{ ...INTER, fontSize: 11, fontWeight: 500, color: "#111", backgroundColor: "#fff", border: "1.5px solid #ebebeb", borderRadius: 8, padding: "7px 10px" }}
          onFocus={(e) => e.target.style.borderColor = "#111"}
          onBlur={(e) => e.target.style.borderColor = "#ebebeb"}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2 shrink-0 pt-1">
        {img.is_primary ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ ...INTER, fontSize: 9, fontWeight: 700, backgroundColor: "#111", color: "#fff" }}>
            <StarOutlinedIcon style={{ fontSize: 10 }} /> Primary
          </span>
        ) : (
          <button
            onClick={() => onSetPrimary(index)}
            className="px-2 py-0.5 rounded-full border cursor-pointer transition-all hover:bg-gray-100"
            style={{ ...INTER, fontSize: 9, fontWeight: 700, backgroundColor: "#fff", color: "#888", border: "1px solid #e0e0e0" }}
          >
            Set Primary
          </button>
        )}
        {!isOnly && (
          <button
            onClick={() => onRemove(index)}
            className="flex items-center justify-center w-6 h-6 rounded-lg cursor-pointer hover:bg-red-50 transition-all border-none"
            style={{ backgroundColor: "#fef2f2", color: "#e53935" }}
          >
            <DeleteOutlineOutlinedIcon style={{ fontSize: 14 }} />
          </button>
        )}
      </div>
    </div>
  );
}

function AttributeRow({ attr, index, isOnly, onRemove, onUpdateField }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#f9f9f9", border: "1.5px solid #f0f0f0" }}>
      <div className="flex items-center justify-center shrink-0 cursor-grab" style={{ color: "#ccc" }}>
        <DragIndicatorOutlinedIcon style={{ fontSize: 18 }} />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p style={{ ...INTER, fontSize: 9, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Attribute Name</p>
        <input
          value={attr.attribute_name}
          onChange={(e) => onUpdateField(index, "attribute_name", e.target.value)}
          placeholder="e.g. processor"
          className="w-full outline-none transition-all"
          style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#111", backgroundColor: "#fff", border: "1.5px solid #ebebeb", borderRadius: 8, padding: "7px 10px" }}
          onFocus={(e) => e.target.style.borderColor = "#111"}
          onBlur={(e) => e.target.style.borderColor = "#ebebeb"}
        />
      </div>

      {/* Value */}
      <div className="flex-1 min-w-0">
        <p style={{ ...INTER, fontSize: 9, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Value</p>
        <input
          value={attr.value}
          onChange={(e) => onUpdateField(index, "value", e.target.value)}
          placeholder="e.g. AMD Ryzen Zen 2"
          className="w-full outline-none transition-all"
          style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#111", backgroundColor: "#fff", border: "1.5px solid #ebebeb", borderRadius: 8, padding: "7px 10px" }}
          onFocus={(e) => e.target.style.borderColor = "#111"}
          onBlur={(e) => e.target.style.borderColor = "#ebebeb"}
        />
      </div>

      {/* Remove */}
      {!isOnly && (
        <button
          onClick={() => onRemove(index)}
          className="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer hover:bg-red-50 transition-all border-none shrink-0"
          style={{ backgroundColor: "#fef2f2", color: "#e53935", marginTop: 18 }}
        >
          <DeleteOutlineOutlinedIcon style={{ fontSize: 15 }} />
        </button>
      )}
    </div>
  );
}

function UnsavedBanner({ onDiscard }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5" style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}>
      <InfoOutlinedIcon style={{ fontSize: 16, color: "#c2410c", flexShrink: 0 }} />
      <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#c2410c", flex: 1 }}>You have unsaved changes.</span>
      <button onClick={onDiscard} className="cursor-pointer border-none bg-transparent" style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#c2410c", textDecoration: "underline" }}>Discard</button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN PRODUCT EDIT PAGE
// ══════════════════════════════════════════════════════════════════════════════
const ProductEditPage = ({
  product  = MOCK_PRODUCT,
  onBack   = () => {},
  onSave   = () => {},
}) => {
  // ── Form state initialised from product ───────────────────────────────────
  const [form, setForm] = useState({
    name:              product.name,
    slug:              product.slug,
    description:       product.description,
    base_price:        product.base_price,
    selling_price:     product.selling_price,
    discounted_price:  product.discounted_price,
    stock_quantity:    product.stock_quantity,
    stock_status:      product.stock_status,
    warranty_months:   product.warranty_months,
    product_tag:       product.product_tag,
    is_active:         product.is_active,
    category_id:       product.category_id,
    brand_id:          product.brand_id,
  });

  const [attributes, setAttributes] = useState(
    product.attributes.map((a) => ({ ...a }))
  );
  const [images, setImages] = useState(
    [...(product.images || [])].sort((a, b) => a.sort_order - b.sort_order).map((i) => ({ ...i }))
  );

  const [isDirty,  setIsDirty]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [errors,   setErrors]   = useState({});

  // ── Helpers ───────────────────────────────────────────────────────────────
  const setField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setIsDirty(true);
    setSaved(false);
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const autoSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleNameChange = (val) => {
    setField("name", val);
    setField("slug", autoSlug(val));
  };

  // Attributes
  const updateAttr = (idx, key, val) => {
    setAttributes((prev) => prev.map((a, i) => i === idx ? { ...a, [key]: val } : a));
    setIsDirty(true);
  };
  const removeAttr = (idx) => {
    setAttributes((prev) => prev.filter((_, i) => i !== idx));
    setIsDirty(true);
  };
  const addAttr = () => {
    setAttributes((prev) => [...prev, { product_attribute_id: Date.now(), attribute_id: null, attribute_name: "", attribute_value_id: null, value: "" }]);
    setIsDirty(true);
  };

  // Images
  const updateImg = (idx, key, val) => {
    setImages((prev) => prev.map((img, i) => i === idx ? { ...img, [key]: val } : img));
    setIsDirty(true);
  };
  const removeImg = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setIsDirty(true);
  };
  const addImg = () => {
    setImages((prev) => [...prev, { image_id: Date.now(), image_url: "", is_primary: prev.length === 0, alt_text: "", sort_order: prev.length }]);
    setIsDirty(true);
  };
  const setPrimary = (idx) => {
    setImages((prev) => prev.map((img, i) => ({ ...img, is_primary: i === idx })));
    setIsDirty(true);
  };

  // Validation
  const validate = () => {
    const e = {};
    if (!form.name.trim())          e.name          = "Name is required";
    if (!form.slug.trim())          e.slug          = "Slug is required";
    if (!form.base_price)           e.base_price    = "Base price is required";
    if (!form.selling_price)        e.selling_price = "Selling price is required";
    return e;
  };

  // Save
  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900)); // simulate API
    const payload = {
      ...form,
      attributes: attributes.map((a, i) => ({ ...a, sort_order: i })),
      images: images.map((img, i) => ({ ...img, sort_order: i })),
    };
    onSave(payload);
    setSaving(false);
    setSaved(true);
    setIsDirty(false);
  };

  const handleDiscard = () => {
    setForm({
      name:             product.name,
      slug:             product.slug,
      description:      product.description,
      base_price:       product.base_price,
      selling_price:    product.selling_price,
      discounted_price: product.discounted_price,
      stock_quantity:   product.stock_quantity,
      stock_status:     product.stock_status,
      warranty_months:  product.warranty_months,
      product_tag:      product.product_tag,
      is_active:        product.is_active,
      category_id:      product.category_id,
      brand_id:         product.brand_id,
    });
    setAttributes(product.attributes.map((a) => ({ ...a })));
    setImages([...product.images].sort((a, b) => a.sort_order - b.sort_order).map((i) => ({ ...i })));
    setIsDirty(false);
    setErrors({});
    setSaved(false);
  };

  // Pricing helpers
  const selling = Number(form.selling_price)   || 0;
  const base    = Number(form.base_price)      || 0;
  const disc    = Number(form.discounted_price) || 0;
  const margin  = selling - base;
  const marginPct  = base > 0    ? ((margin / base) * 100).toFixed(1)      : "0.0";
  const savePct    = selling > 0 ? (((selling - disc) / selling) * 100).toFixed(1) : "0.0";

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer">
            <ArrowBackOutlinedIcon style={{ fontSize: 18 }} />
          </button>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Products / Edit</p>
            <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Edit Product</h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isDirty && (
            <button onClick={handleDiscard} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all cursor-pointer" style={{ ...SORA, fontSize: 13, fontWeight: 700 }}>
              <CloseOutlinedIcon style={{ fontSize: 16 }} /> Discard
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all cursor-pointer disabled:opacity-60"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: saved ? "#16a34a" : "#111", border: "none" }}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : saved ? (
              <><CheckCircleOutlinedIcon style={{ fontSize: 16 }} /> Saved!</>
            ) : (
              <><SaveOutlinedIcon style={{ fontSize: 16 }} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Unsaved banner */}
      {isDirty && <UnsavedBanner onDiscard={handleDiscard} />}

      {/* Validation errors summary */}
      {Object.keys(errors).length > 0 && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
          <WarningAmberOutlinedIcon style={{ fontSize: 16, color: "#e53935", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#e53935", marginBottom: 4 }}>Please fix the following errors:</p>
            {Object.values(errors).map((err, i) => (
              <p key={i} style={{ ...INTER, fontSize: 12, color: "#e53935" }}>• {err}</p>
            ))}
          </div>
        </div>
      )}

      {/* ── 3-col grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ══ LEFT + CENTRE (col-span-2) ══ */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* Basic Info */}
          <SectionCard>
            <SectionTitle icon={<InventoryOutlinedIcon style={{ fontSize: 16 }} />}>
              Basic Information
            </SectionTitle>
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel required>Product Name</FieldLabel>
                <input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter product name"
                  className="w-full outline-none transition-all"
                  style={{
                    ...SORA,
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#111",
                    backgroundColor: "#f9f9f9",
                    border: `1.5px solid ${errors.name ? "#e53935" : "#ebebeb"}`,
                    borderRadius: 12,
                    padding: "11px 14px",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.name ? "#e53935" : "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
                />
                {errors.name && <p style={{ ...INTER, fontSize: 11, color: "#e53935", marginTop: 4 }}>{errors.name}</p>}
              </div>

              <div>
                <FieldLabel required>Slug</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...INTER, fontSize: 13, color: "#bbb" }}>/</span>
                  <input
                    value={form.slug}
                    onChange={(e) => setField("slug", e.target.value)}
                    placeholder="product-slug"
                    className="w-full outline-none transition-all pl-7"
                    style={{
                      ...INTER,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#555",
                      fontFamily: "'Courier New', monospace",
                      backgroundColor: "#f9f9f9",
                      border: `1.5px solid ${errors.slug ? "#e53935" : "#ebebeb"}`,
                      borderRadius: 12,
                      padding: "10px 14px 10px 22px",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
                    onBlur={(e) => { e.target.style.borderColor = errors.slug ? "#e53935" : "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
                  />
                </div>
                {errors.slug && <p style={{ ...INTER, fontSize: 11, color: "#e53935", marginTop: 4 }}>{errors.slug}</p>}
              </div>

              <TextareaInput
                label="Description"
                value={form.description}
                onChange={(v) => setField("description", v)}
                placeholder="Enter product description…"
                rows={4}
              />
            </div>
          </SectionCard>

          {/* Attributes */}
          <SectionCard>
            <SectionTitle icon={<TagOutlinedIcon style={{ fontSize: 16 }} />}>
              Product Attributes ({attributes.length})
            </SectionTitle>
            <div className="flex flex-col gap-2.5 mb-3">
              {attributes.map((attr, idx) => (
                <AttributeRow
                  key={attr.product_attribute_id}
                  attr={attr}
                  index={idx}
                  isOnly={attributes.length === 1}
                  onRemove={removeAttr}
                  onUpdateField={updateAttr}
                />
              ))}
            </div>
            <button
              onClick={addAttr}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:border-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all cursor-pointer w-full justify-center"
              style={{ ...INTER, fontSize: 13, fontWeight: 700, backgroundColor: "transparent" }}
            >
              <AddOutlinedIcon style={{ fontSize: 16 }} /> Add Attribute
            </button>
          </SectionCard>

          {/* Images */}
          <SectionCard>
            <SectionTitle icon={<ImageOutlinedIcon style={{ fontSize: 16 }} />}>
              Product Images ({images.length})
            </SectionTitle>
            <div className="flex flex-col gap-2.5 mb-3">
              {images.map((img, idx) => (
                <ImageRow
                  key={img.image_id}
                  img={img}
                  index={idx}
                  isOnly={images.length === 1}
                  onRemove={removeImg}
                  onSetPrimary={setPrimary}
                  onUpdateField={updateImg}
                />
              ))}
            </div>
            <button
              onClick={addImg}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:border-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all cursor-pointer w-full justify-center"
              style={{ ...INTER, fontSize: 13, fontWeight: 700, backgroundColor: "transparent" }}
            >
              <AddOutlinedIcon style={{ fontSize: 16 }} /> Add Image URL
            </button>
          </SectionCard>

        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="flex flex-col gap-5">

          {/* Pricing */}
          <SectionCard>
            <SectionTitle icon={<LocalOfferOutlinedIcon style={{ fontSize: 16 }} />}>
              Pricing
            </SectionTitle>

            {/* Margin preview */}
            <div className="flex flex-col items-center py-4 mb-4 rounded-xl" style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}>
              <p style={{ ...INTER, fontSize: 10, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Profit Margin</p>
              <p style={{ ...SORA, fontSize: 28, fontWeight: 900, color: margin >= 0 ? "#16a34a" : "#e53935", letterSpacing: "-0.5px" }}>
                {marginPct}%
              </p>
              <p style={{ ...INTER, fontSize: 11, color: "#aaa" }}>
                {margin >= 0 ? "+" : ""}{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(margin)}
              </p>
              {disc > 0 && (
                <div className="mt-2 px-3 py-1 rounded-full" style={{ backgroundColor: "#dbeafe" }}>
                  <p style={{ ...INTER, fontSize: 10, color: "#1d4ed8", fontWeight: 700 }}>Saving {savePct}% off selling price</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <TextInput label="Base Price (LKR)" type="number" min="0" step="0.01" value={form.base_price}       onChange={(v) => setField("base_price",       v)} placeholder="0.00" required />
              {errors.base_price && <p style={{ ...INTER, fontSize: 11, color: "#e53935", marginTop: -8 }}>{errors.base_price}</p>}
              <TextInput label="Selling Price (LKR)" type="number" min="0" step="0.01" value={form.selling_price}    onChange={(v) => setField("selling_price",    v)} placeholder="0.00" required />
              {errors.selling_price && <p style={{ ...INTER, fontSize: 11, color: "#e53935", marginTop: -8 }}>{errors.selling_price}</p>}
              <TextInput label="Discounted Price (LKR)" type="number" min="0" step="0.01" value={form.discounted_price} onChange={(v) => setField("discounted_price", v)} placeholder="0.00" />
            </div>
          </SectionCard>

          {/* Inventory */}
          <SectionCard>
            <SectionTitle icon={<InventoryOutlinedIcon style={{ fontSize: 16 }} />}>
              Inventory
            </SectionTitle>
            <div className="flex flex-col gap-3">
              <TextInput
                label="Stock Quantity"
                type="number"
                min="0"
                step="1"
                value={form.stock_quantity}
                onChange={(v) => setField("stock_quantity", parseInt(v) || 0)}
                placeholder="0"
              />
              <SelectInput
                label="Stock Status"
                value={form.stock_status}
                onChange={(v) => setField("stock_status", v)}
                options={STOCK_STATUS_OPTIONS}
              />
              <TextInput
                label="Warranty (months)"
                type="number"
                min="0"
                step="1"
                value={form.warranty_months}
                onChange={(v) => setField("warranty_months", parseInt(v) || 0)}
                placeholder="12"
              />
            </div>
          </SectionCard>

          {/* Classification */}
          <SectionCard>
            <SectionTitle icon={<CategoryOutlinedIcon style={{ fontSize: 16 }} />}>
              Classification
            </SectionTitle>
            <div className="flex flex-col gap-3">
              <TextInput
                label="Category ID"
                type="number"
                value={form.category_id}
                onChange={(v) => setField("category_id", parseInt(v) || "")}
                placeholder="e.g. 47"
              />
              <div className="px-3 py-2 rounded-xl" style={{ backgroundColor: "#f0f6ff", border: "1px solid #bfdbfe" }}>
                <p style={{ ...INTER, fontSize: 11, color: "#1d4ed8", fontWeight: 600 }}>
                  Current: <strong>{product.category_name}</strong> ({product.category_type})
                </p>
              </div>

              <TextInput
                label="Brand ID"
                type="number"
                value={form.brand_id}
                onChange={(v) => setField("brand_id", parseInt(v) || "")}
                placeholder="e.g. 31"
              />
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "#f0f6ff", border: "1px solid #bfdbfe" }}>
                {product.logo_url && (
                  <img src={product.logo_url} alt={product.brand_name} className="w-5 h-5 object-contain rounded" onError={(e) => e.target.style.display = "none"} />
                )}
                <p style={{ ...INTER, fontSize: 11, color: "#1d4ed8", fontWeight: 600 }}>
                  Current: <strong>{product.brand_name}</strong>
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Status & Tag */}
          <SectionCard>
            <SectionTitle icon={<VerifiedOutlinedIcon style={{ fontSize: 16 }} />}>
              Status & Tag
            </SectionTitle>
            <div className="flex flex-col gap-3">
              <ToggleSwitch
                label="Active"
                description="Product visible in store"
                checked={form.is_active}
                onChange={(v) => setField("is_active", v)}
              />
              <SelectInput
                label="Product Tag"
                value={form.product_tag}
                onChange={(v) => setField("product_tag", v)}
                options={PRODUCT_TAG_OPTIONS.map((t) => ({ value: t, label: t.replace("_", " ") }))}
              />
            </div>
          </SectionCard>

          {/* Save action repeated */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white transition-all cursor-pointer disabled:opacity-60"
            style={{ ...SORA, fontSize: 14, fontWeight: 800, backgroundColor: saved ? "#16a34a" : "#111", border: "none" }}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving Changes…
              </>
            ) : saved ? (
              <><CheckCircleOutlinedIcon style={{ fontSize: 18 }} /> All Changes Saved</>
            ) : (
              <><SaveOutlinedIcon style={{ fontSize: 18 }} /> Save Changes</>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;
