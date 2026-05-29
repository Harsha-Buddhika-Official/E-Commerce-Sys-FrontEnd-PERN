import { useState, useRef } from "react";
import ArrowBackOutlinedIcon        from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon             from "@mui/icons-material/SaveOutlined";
import CloseIcon                    from "@mui/icons-material/Close";
import AddOutlinedIcon              from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon    from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon             from "@mui/icons-material/EditOutlined";
import StarOutlinedIcon             from "@mui/icons-material/StarOutlined";
import CheckCircleOutlinedIcon      from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon     from "@mui/icons-material/WarningAmberOutlined";
import CloudUploadOutlinedIcon      from "@mui/icons-material/CloudUploadOutlined";
import DragIndicatorIcon            from "@mui/icons-material/DragIndicator";
import InventoryOutlinedIcon        from "@mui/icons-material/InventoryOutlined";
import LocalOfferOutlinedIcon       from "@mui/icons-material/LocalOfferOutlined";
import CategoryOutlinedIcon         from "@mui/icons-material/CategoryOutlined";
import TagOutlinedIcon              from "@mui/icons-material/TagOutlined";
import ImageOutlinedIcon            from "@mui/icons-material/ImageOutlined";
import KeyboardArrowDownIcon        from "@mui/icons-material/KeyboardArrowDown";
import ToggleOnIcon                 from "@mui/icons-material/ToggleOn";
import ToggleOffIcon                from "@mui/icons-material/ToggleOff";

// ─── Font constants — leaf elements only, never on wrapper divs ───────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Mock initial product — same shape as the API JSON ────────────────────────
const MOCK_PRODUCT = {
  product_id:       54,
  name:             "Sony PlayStation 5 Console Standard Edition",
  slug:             "sony-playstation-5-console-standard-edition",
  description:      "Next-generation PlayStation 5 gaming console featuring ultra-fast SSD storage, ray tracing support, 4K gaming, and immersive DualSense controller experience.",
  base_price:       "185000.00",
  selling_price:    "225000.00",
  discounted_price: "210000.00",
  stock_quantity:   15,
  stock_status:     "IN_STOCK",
  warranty_months:  12,
  product_tag:      "BEST_SELLER",
  is_active:        true,
  category_id:      47,
  category_name:    "Consoles",
  brand_id:         31,
  brand_name:       "Sony",
  attributes: [
    { product_attribute_id: 220, attribute_name: "processor",            value: "AMD Ryzen Zen 2 8-Core Processor" },
    { product_attribute_id: 221, attribute_name: "gpu",                  value: "AMD RDNA 2 GPU" },
    { product_attribute_id: 222, attribute_name: "storage_capacity",     value: "825GB Custom NVMe SSD" },
    { product_attribute_id: 223, attribute_name: "resolution_support",   value: "Up to 4K 120Hz / 8K Support" },
    { product_attribute_id: 224, attribute_name: "connectivity",         value: "WiFi 6, Bluetooth 5.1, Ethernet" },
    { product_attribute_id: 225, attribute_name: "included_accessories", value: "DualSense Controller, HDMI Cable, Power Cable" },
    { product_attribute_id: 226, attribute_name: "controller_included",  value: "Yes" },
  ],
  images: [
    { image_id: 68, image_url: "https://xmobile.lk/wp-content/uploads/2023/10/ps5.jpg", is_primary: true,  alt_text: "Sony PlayStation 5 Front View", sort_order: 0 },
    { image_id: 69, image_url: "https://s3-ap-southeast-1.amazonaws.com/media.cameralk.com/14498/PS5-Hero-Packshot-us.webp", is_primary: false, alt_text: "PS5 Hero Image", sort_order: 1 },
  ],
};

// ─── Option lists ─────────────────────────────────────────────────────────────
const BRANDS     = ["Sony", "MSI", "ASUS", "Lenovo", "Dell", "HP", "Acer", "Apple", "Samsung", "Intel", "AMD", "Nvidia", "G.Skill", "Corsair", "Noctua", "LG"];
const CATEGORIES = ["Consoles", "Laptop", "Processor", "GPU", "Memory", "Storage", "Monitor", "Cooling", "Motherboard", "PSU", "Peripherals", "Accessories"];
const TAGS       = ["NONE", "BEST_SELLER", "NEW", "HOT", "SALE"];
const STATUSES   = ["IN_STOCK", "OUT_OF_STOCK", "LOW_STOCK"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const attrLabel = (name) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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
      <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: "#f5f5f5", color: "#111" }}>
        {icon}
      </div>
      <span style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111" }}>{children}</span>
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <p className="mb-1.5" style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#555" }}>
      {children} {required && <span style={{ color: "#e53935" }}>*</span>}
    </p>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", disabled = false }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#fafafa] outline-none transition-all focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-50 placeholder:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ ...INTER, fontSize: 13, color: "#111" }}
    />
  );
}

function PriceInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min="0"
        className="w-full pl-4 pr-16 py-2.5 rounded-xl border border-gray-200 bg-[#fafafa] outline-none transition-all focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-50 placeholder:text-gray-300"
        style={{ ...INTER, fontSize: 13, color: "#111" }}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2" style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}>LKR</span>
    </div>
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 bg-[#fafafa] outline-none transition-all focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-50 cursor-pointer"
        style={{ ...INTER, fontSize: 13, color: "#111" }}
      >
        {options.map((o) => (
          <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
            {typeof o === "string" ? o : o.label}
          </option>
        ))}
      </select>
      <KeyboardArrowDownIcon style={{ fontSize: 18, color: "#aaa", position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  );
}

// ─── Discard confirm modal ─────────────────────────────────────────────────────
function DiscardModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-7 flex flex-col gap-4 w-full" style={{ maxWidth: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: "#fff7ed" }}>
            <WarningAmberOutlinedIcon style={{ fontSize: 20, color: "#f97316" }} />
          </div>
          <h3 style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Discard Changes?</h3>
        </div>
        <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
          You have unsaved changes. Going back will discard all edits. Are you sure?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555", background: "#fff" }}>Keep Editing</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-white hover:bg-orange-600 transition-all cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 700, background: "#f97316", border: "none" }}>Discard</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// EDIT PRODUCT PAGE
// ══════════════════════════════════════════════════════════════════════════════
const EditProductPage = ({
  product  = MOCK_PRODUCT,
  onBack   = () => {},
  onSave   = () => {},
}) => {
  const fileInputRef   = useRef(null);
  const [dirty,        setDirty]        = useState(false);
  const [showDiscard,  setShowDiscard]  = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);

  // ── Core fields ──────────────────────────────────────────────────────────
  const [name,          setName]         = useState(product.name || "");
  const [slug,          setSlug]         = useState(product.slug || "");
  const [description,   setDescription]  = useState(product.description || "");
  const [brandId,       setBrandId]       = useState(String(product.brand_id || ""));
  const [brandName,     setBrandName]     = useState(product.brand_name || "");
  const [categoryId,    setCategoryId]    = useState(String(product.category_id || ""));
  const [categoryName,  setCategoryName]  = useState(product.category_name || "");
  const [basePrice,     setBasePrice]     = useState(product.base_price || "");
  const [sellingPrice,  setSellingPrice]  = useState(product.selling_price || "");
  const [discPrice,     setDiscPrice]     = useState(product.discounted_price || "");
  const [stockQty,      setStockQty]      = useState(product.stock_quantity ?? 0);
  const [stockStatus,   setStockStatus]   = useState(product.stock_status || "IN_STOCK");
  const [warrantyMonths,setWarrantyMonths]= useState(product.warranty_months ?? 12);
  const [productTag,    setProductTag]    = useState(product.product_tag || "NONE");
  const [isActive,      setIsActive]      = useState(product.is_active ?? true);

  // ── Attributes ────────────────────────────────────────────────────────────
  const [attributes, setAttributes] = useState(
    (product.attributes || []).map((a, i) => ({ ...a, _key: i }))
  );
  const [newAttrName,  setNewAttrName]  = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");

  // ── Images ────────────────────────────────────────────────────────────────
  const [images, setImages] = useState(
    (product.images || []).map((img, i) => ({ ...img, _key: i }))
  );
  const [newImageUrl,  setNewImageUrl]  = useState("");
  const [newImageAlt,  setNewImageAlt]  = useState("");

  // ── Dirty tracking ────────────────────────────────────────────────────────
  const markDirty = () => { setDirty(true); setSaved(false); };

  const field = (setter) => (val) => { setter(val); markDirty(); };

  // ── Auto-slug from name ───────────────────────────────────────────────────
  const handleNameChange = (val) => {
    setName(val);
    setSlug(slugify(val));
    markDirty();
  };

  // ── Attribute operations ──────────────────────────────────────────────────
  const addAttribute = () => {
    if (!newAttrName.trim() || !newAttrValue.trim()) return;
    setAttributes((prev) => [
      ...prev,
      { _key: Date.now(), product_attribute_id: null, attribute_name: newAttrName.trim().toLowerCase().replace(/\s+/g, "_"), value: newAttrValue.trim() },
    ]);
    setNewAttrName("");
    setNewAttrValue("");
    markDirty();
  };

  const updateAttrValue = (key, val) => {
    setAttributes((prev) => prev.map((a) => a._key === key ? { ...a, value: val } : a));
    markDirty();
  };

  const updateAttrName = (key, val) => {
    setAttributes((prev) => prev.map((a) => a._key === key ? { ...a, attribute_name: val.toLowerCase().replace(/\s+/g, "_") } : a));
    markDirty();
  };

  const removeAttribute = (key) => {
    setAttributes((prev) => prev.filter((a) => a._key !== key));
    markDirty();
  };

  // ── Image operations ──────────────────────────────────────────────────────
  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [
      ...prev,
      { _key: Date.now(), image_id: null, image_url: newImageUrl.trim(), alt_text: newImageAlt.trim(), is_primary: prev.length === 0, sort_order: prev.length },
    ]);
    setNewImageUrl("");
    setNewImageAlt("");
    markDirty();
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((f, i) => ({
      _key:      Date.now() + i,
      image_id:  null,
      image_url: URL.createObjectURL(f),
      alt_text:  f.name.replace(/\.[^.]+$/, ""),
      is_primary: images.length === 0 && i === 0,
      sort_order: images.length + i,
      _file:     f,
    }));
    setImages((prev) => [...prev, ...newImgs]);
    markDirty();
  };

  const setPrimary = (key) => {
    setImages((prev) => prev.map((img) => ({ ...img, is_primary: img._key === key })));
    markDirty();
  };

  const updateAltText = (key, val) => {
    setImages((prev) => prev.map((img) => img._key === key ? { ...img, alt_text: val } : img));
    markDirty();
  };

  const removeImage = (key) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img._key !== key);
      // If we removed the primary, auto-assign to first
      if (!filtered.some((img) => img.is_primary) && filtered.length > 0) {
        filtered[0].is_primary = true;
      }
      return filtered.map((img, i) => ({ ...img, sort_order: i }));
    });
    markDirty();
  };

  const moveImage = (key, dir) => {
    setImages((prev) => {
      const idx = prev.findIndex((img) => img._key === key);
      if ((dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
      const next = [...prev];
      [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
      return next.map((img, i) => ({ ...img, sort_order: i }));
    });
    markDirty();
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!name.trim())         { alert("Product name is required."); return; }
    if (!sellingPrice)        { alert("Selling price is required."); return; }
    if (Number(discPrice) > Number(sellingPrice)) { alert("Discounted price cannot exceed selling price."); return; }

    setSaving(true);
    const payload = {
      product_id:        product.product_id,
      name,
      slug,
      description,
      brand_id:          Number(brandId),
      brand_name:        brandName,
      category_id:       Number(categoryId),
      category_name:     categoryName,
      base_price:        basePrice,
      selling_price:     sellingPrice,
      discounted_price:  discPrice,
      stock_quantity:    Number(stockQty),
      stock_status:      stockStatus,
      warranty_months:   Number(warrantyMonths),
      product_tag:       productTag === "NONE" ? null : productTag,
      is_active:         isActive,
      attributes:        attributes.map(({ _key, ...a }) => a),
      images:            images.map(({ _key, _file, ...img }) => img),
    };

    console.log("Saving product:", payload);
    // Replace with: await updateProduct(product.product_id, payload);
    await new Promise((r) => setTimeout(r, 800)); // simulate API
    setSaving(false);
    setSaved(true);
    setDirty(false);
    onSave(payload);
  };

  const handleBack = () => {
    if (dirty) { setShowDiscard(true); } else { onBack(); }
  };

  // ── Tag config for display ────────────────────────────────────────────────
  const TAG_LABELS = { NONE: "No Tag", BEST_SELLER: "Best Seller", NEW: "New", HOT: "Hot", SALE: "Sale" };

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* Discard modal */}
      {showDiscard && (
        <DiscardModal
          onConfirm={() => { setShowDiscard(false); onBack(); }}
          onCancel={() => setShowDiscard(false)}
        />
      )}

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer">
            <ArrowBackOutlinedIcon style={{ fontSize: 18 }} />
          </button>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
              Products / #{product.product_id} / Edit
            </p>
            <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
              Edit Product
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Dirty indicator */}
          {dirty && !saved && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ ...INTER, fontSize: 11, fontWeight: 600, backgroundColor: "#fff7ed", color: "#f97316", border: "1px solid #fed7aa" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              Unsaved changes
            </span>
          )}
          {saved && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ ...INTER, fontSize: 11, fontWeight: 600, backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>
              <CheckCircleOutlinedIcon style={{ fontSize: 14 }} />
              Saved
            </span>
          )}

          <button onClick={handleBack} className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555", background: "#fff" }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#1a73e8", border: "none" }}
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <SaveOutlinedIcon style={{ fontSize: 17 }} />
            }
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── 3-col grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ══ LEFT + CENTRE (col-span-2) ══ */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* ── Basic Info ── */}
          <SectionCard>
            <SectionTitle icon={<EditOutlinedIcon style={{ fontSize: 16 }} />}>
              Basic Information
            </SectionTitle>

            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <FieldLabel required>Product Name</FieldLabel>
                <TextInput value={name} onChange={handleNameChange} placeholder="Product name…" />
              </div>

              {/* Slug — auto-generated, read-only but editable */}
              <div>
                <FieldLabel>URL Slug</FieldLabel>
                <TextInput value={slug} onChange={(v) => { setSlug(v); markDirty(); }} placeholder="product-slug" />
                <p className="mt-1" style={{ ...INTER, fontSize: 11, color: "#bbb" }}>Auto-generated from name. Edit manually if needed.</p>
              </div>

              {/* Description */}
              <div>
                <FieldLabel>Description</FieldLabel>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); markDirty(); }}
                  rows={4}
                  placeholder="Product description…"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#fafafa] outline-none resize-none transition-all focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-50 placeholder:text-gray-300"
                  style={{ ...INTER, fontSize: 13, color: "#111" }}
                />
              </div>

              {/* Brand + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Brand</FieldLabel>
                  <SelectInput
                    value={brandName}
                    onChange={(v) => { setBrandName(v); markDirty(); }}
                    options={BRANDS}
                  />
                </div>
                <div>
                  <FieldLabel required>Category</FieldLabel>
                  <SelectInput
                    value={categoryName}
                    onChange={(v) => { setCategoryName(v); markDirty(); }}
                    options={CATEGORIES}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Images ── */}
          <SectionCard>
            <SectionTitle icon={<ImageOutlinedIcon style={{ fontSize: 16 }} />}>
              Product Images ({images.length})
            </SectionTitle>

            {/* Existing images list */}
            <div className="flex flex-col gap-3 mb-5">
              {images.length === 0 && (
                <p style={{ ...INTER, fontSize: 13, color: "#bbb" }}>No images added yet.</p>
              )}
              {images.map((img, idx) => (
                <div
                  key={img._key}
                  className="flex items-center gap-3 p-3 rounded-xl border transition-all"
                  style={{ backgroundColor: img.is_primary ? "#f0f6ff" : "#f9f9f9", borderColor: img.is_primary ? "#93c5fd" : "#f0f0f0" }}
                >
                  {/* Drag handle */}
                  <DragIndicatorIcon style={{ fontSize: 18, color: "#ccc", flexShrink: 0 }} />

                  {/* Thumbnail */}
                  <div className="flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0 bg-white border border-[#ebebeb]" style={{ width: 52, height: 52 }}>
                    {img.image_url ? (
                      <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-contain p-1" onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <InventoryOutlinedIcon style={{ fontSize: 20, color: "#ccc" }} />
                    )}
                  </div>

                  {/* Alt text input */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <input
                      type="text"
                      value={img.alt_text}
                      onChange={(e) => updateAltText(img._key, e.target.value)}
                      placeholder="Alt text…"
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white outline-none focus:border-[#1a73e8] transition-all"
                      style={{ ...INTER, fontSize: 12, color: "#111" }}
                    />
                    <p className="truncate" style={{ ...INTER, fontSize: 10, color: "#ccc", fontFamily: "'Courier New', monospace" }}>{img.image_url}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Move up/down */}
                    <button onClick={() => moveImage(img._key, -1)} disabled={idx === 0} className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer transition-all" style={{ fontSize: 10, fontWeight: 700, ...INTER }}>↑</button>
                    <button onClick={() => moveImage(img._key, 1)} disabled={idx === images.length - 1} className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer transition-all" style={{ fontSize: 10, fontWeight: 700, ...INTER }}>↓</button>

                    {/* Set primary */}
                    <button
                      onClick={() => setPrimary(img._key)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border transition-all cursor-pointer"
                      style={{
                        ...INTER, fontSize: 10, fontWeight: 700,
                        backgroundColor: img.is_primary ? "#dbeafe" : "#f5f5f5",
                        borderColor: img.is_primary ? "#93c5fd" : "#e5e7eb",
                        color: img.is_primary ? "#1d4ed8" : "#888",
                      }}
                    >
                      <StarOutlinedIcon style={{ fontSize: 12 }} />
                      {img.is_primary ? "Primary" : "Set Primary"}
                    </button>

                    {/* Remove */}
                    <button onClick={() => removeImage(img._key)} className="flex items-center justify-center w-7 h-7 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 cursor-pointer transition-all">
                      <CloseIcon style={{ fontSize: 14 }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add image by URL */}
            <div className="rounded-xl p-4 border border-dashed border-gray-200 bg-[#fafafa]">
              <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10 }}>Add image by URL</p>
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white outline-none focus:border-[#1a73e8] transition-all"
                  style={{ ...INTER, fontSize: 12, color: "#111" }}
                />
                <input
                  type="text"
                  value={newImageAlt}
                  onChange={(e) => setNewImageAlt(e.target.value)}
                  placeholder="Alt text"
                  className="w-full sm:w-40 px-3 py-2 rounded-lg border border-gray-200 bg-white outline-none focus:border-[#1a73e8] transition-all"
                  style={{ ...INTER, fontSize: 12, color: "#111" }}
                />
                <button onClick={addImageUrl} className="flex items-center gap-1 px-4 py-2 rounded-lg text-white cursor-pointer transition-all hover:opacity-90 flex-shrink-0" style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: "#111", border: "none" }}>
                  <AddOutlinedIcon style={{ fontSize: 15 }} /> Add
                </button>
              </div>

              {/* Or upload file */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span style={{ ...INTER, fontSize: 11, color: "#bbb" }}>or upload file</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer bg-transparent"
                style={{ ...INTER, fontSize: 12, fontWeight: 600 }}
              >
                <CloudUploadOutlinedIcon style={{ fontSize: 17 }} /> Upload Images
              </button>
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>
          </SectionCard>

          {/* ── Attributes ── */}
          <SectionCard>
            <SectionTitle icon={<TagOutlinedIcon style={{ fontSize: 16 }} />}>
              Product Attributes ({attributes.length})
            </SectionTitle>

            {/* Existing attributes */}
            <div className="flex flex-col gap-2.5 mb-5">
              {attributes.length === 0 && (
                <p style={{ ...INTER, fontSize: 13, color: "#bbb" }}>No attributes yet. Add one below.</p>
              )}
              {attributes.map((attr) => (
                <div
                  key={attr._key}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
                >
                  {/* Attribute name */}
                  <div className="flex-shrink-0 w-40">
                    <input
                      type="text"
                      value={attrLabel(attr.attribute_name)}
                      onChange={(e) => updateAttrName(attr._key, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white outline-none focus:border-[#1a73e8] transition-all"
                      style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#555" }}
                    />
                  </div>

                  {/* Attribute value */}
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => updateAttrValue(attr._key, e.target.value)}
                    placeholder="Value…"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white outline-none focus:border-[#1a73e8] transition-all"
                    style={{ ...INTER, fontSize: 13, color: "#111" }}
                  />

                  {/* Remove button */}
                  <button onClick={() => removeAttribute(attr._key)} className="flex items-center justify-center w-7 h-7 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 cursor-pointer transition-all flex-shrink-0">
                    <DeleteOutlineOutlinedIcon style={{ fontSize: 14 }} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new attribute */}
            <div className="rounded-xl p-4 border border-dashed border-gray-200 bg-[#fafafa]">
              <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10 }}>Add New Attribute</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newAttrName}
                  onChange={(e) => setNewAttrName(e.target.value)}
                  placeholder="Attribute name (e.g. Color)"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white outline-none focus:border-[#1a73e8] transition-all"
                  style={{ ...INTER, fontSize: 12, color: "#111" }}
                />
                <input
                  type="text"
                  value={newAttrValue}
                  onChange={(e) => setNewAttrValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAttribute()}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white outline-none focus:border-[#1a73e8] transition-all"
                  style={{ ...INTER, fontSize: 12, color: "#111" }}
                />
                <button onClick={addAttribute} className="flex items-center gap-1 px-4 py-2 rounded-lg text-white cursor-pointer transition-all hover:opacity-90 flex-shrink-0" style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: "#111", border: "none" }}>
                  <AddOutlinedIcon style={{ fontSize: 15 }} /> Add
                </button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="flex flex-col gap-5">

          {/* Pricing */}
          <SectionCard>
            <SectionTitle icon={<LocalOfferOutlinedIcon style={{ fontSize: 16 }} />}>
              Pricing
            </SectionTitle>
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel>Base Price (Cost)</FieldLabel>
                <PriceInput value={basePrice} onChange={field(setBasePrice)} placeholder="0.00" />
              </div>
              <div>
                <FieldLabel required>Selling Price</FieldLabel>
                <PriceInput value={sellingPrice} onChange={field(setSellingPrice)} placeholder="0.00" />
              </div>
              <div>
                <FieldLabel>Discounted Price</FieldLabel>
                <PriceInput value={discPrice} onChange={field(setDiscPrice)} placeholder="0.00" />
                {Number(discPrice) > Number(sellingPrice) && discPrice && (
                  <p className="mt-1 flex items-center gap-1" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: 13 }} />
                    Cannot exceed selling price
                  </p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Inventory */}
          <SectionCard>
            <SectionTitle icon={<InventoryOutlinedIcon style={{ fontSize: 16 }} />}>
              Inventory
            </SectionTitle>
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel>Stock Quantity</FieldLabel>
                <div className="flex items-center gap-3">
                  <button onClick={() => { setStockQty(Math.max(0, stockQty - 1)); markDirty(); }} className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 cursor-pointer transition-all" style={{ ...INTER, fontSize: 16 }}>−</button>
                  <input
                    type="number"
                    value={stockQty}
                    onChange={(e) => { setStockQty(Number(e.target.value)); markDirty(); }}
                    min="0"
                    className="flex-1 text-center px-4 py-2.5 rounded-xl border border-gray-200 bg-[#fafafa] outline-none focus:border-[#1a73e8] transition-all"
                    style={{ ...INTER, fontSize: 15, fontWeight: 800, color: "#111" }}
                  />
                  <button onClick={() => { setStockQty(stockQty + 1); markDirty(); }} className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 cursor-pointer transition-all" style={{ ...INTER, fontSize: 16 }}>+</button>
                </div>
              </div>

              <div>
                <FieldLabel>Stock Status</FieldLabel>
                <SelectInput
                  value={stockStatus}
                  onChange={field(setStockStatus)}
                  options={STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))}
                />
              </div>

              <div>
                <FieldLabel>Warranty (months)</FieldLabel>
                <TextInput type="number" value={warrantyMonths} onChange={field(setWarrantyMonths)} placeholder="12" />
              </div>
            </div>
          </SectionCard>

          {/* Organisation */}
          <SectionCard>
            <SectionTitle icon={<CategoryOutlinedIcon style={{ fontSize: 16 }} />}>
              Organisation
            </SectionTitle>
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel>Product Tag</FieldLabel>
                <SelectInput
                  value={productTag}
                  onChange={field(setProductTag)}
                  options={TAGS.map((t) => ({ value: t, label: TAG_LABELS[t] || t }))}
                />
              </div>

              {/* Active toggle */}
              <div>
                <FieldLabel>Status</FieldLabel>
                <button
                  onClick={() => { setIsActive((p) => !p); markDirty(); }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all"
                  style={{
                    backgroundColor: isActive ? "#f0fdf4" : "#fef2f2",
                    borderColor:     isActive ? "#bbf7d0" : "#fecaca",
                  }}
                >
                  <div>
                    <p style={{ ...INTER, fontSize: 13, fontWeight: 700, color: isActive ? "#15803d" : "#dc2626" }}>
                      {isActive ? "Active" : "Inactive"}
                    </p>
                    <p style={{ ...INTER, fontSize: 11, color: isActive ? "#16a34a" : "#ef4444", opacity: 0.8 }}>
                      {isActive ? "Visible to customers" : "Hidden from store"}
                    </p>
                  </div>
                  {isActive
                    ? <ToggleOnIcon  style={{ fontSize: 36, color: "#16a34a" }} />
                    : <ToggleOffIcon style={{ fontSize: 36, color: "#ef4444" }} />
                  }
                </button>
              </div>
            </div>
          </SectionCard>

          {/* Save CTA (sticky bottom repeat for long forms) */}
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ ...SORA, fontSize: 14, fontWeight: 800, backgroundColor: "#1a73e8", border: "none" }}
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <SaveOutlinedIcon style={{ fontSize: 18 }} />
            }
            {saving ? "Saving…" : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default EditProductPage;