import { useState, useEffect, useRef } from "react";
import CloseIcon                  from "@mui/icons-material/Close";
import SaveOutlinedIcon           from "@mui/icons-material/SaveOutlined";
import AddOutlinedIcon            from "@mui/icons-material/AddOutlined";
import WarningAmberOutlinedIcon   from "@mui/icons-material/WarningAmberOutlined";
import PercentOutlinedIcon        from "@mui/icons-material/PercentOutlined";
import AttachMoneyOutlinedIcon    from "@mui/icons-material/AttachMoneyOutlined";
import ToggleOnIcon               from "@mui/icons-material/ToggleOn";
import ToggleOffIcon              from "@mui/icons-material/ToggleOff";
import SearchOutlinedIcon         from "@mui/icons-material/SearchOutlined";
import InventoryOutlinedIcon      from "@mui/icons-material/InventoryOutlined";
import CloseOutlinedIcon          from "@mui/icons-material/CloseOutlined";
import CheckOutlinedIcon          from "@mui/icons-material/CheckOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { useLimitedData } from "../../features/products/hooks/useLimitedData";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const fmt = (v) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(Number(v) || 0);

const toDateInput = (iso) => {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function FieldLabel({ children, required }) {
  return (
    <p className="mb-1.5" style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em" }}>
      {children}{required && <span style={{ color: "#e53935" }}> *</span>}
    </p>
  );
}

function ErrorMsg({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
      <WarningAmberOutlinedIcon style={{ fontSize: 12 }} /> {msg}
    </p>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full outline-none transition-all"
      style={{
        ...INTER, fontSize: 13, fontWeight: 600, color: "#111",
        padding: "10px 14px",
        borderRadius: 12,
        border: `1.5px solid ${focused ? "#111" : "#ebebeb"}`,
        backgroundColor: focused ? "#fff" : "#f9f9f9",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

// ─── Product dropdown ─────────────────────────────────────────────────────────
function ProductDropdown({ value, onChange, error, products = [] }) {
  const [open,    setOpen]    = useState(false);
  const [search,  setSearch]  = useState("");
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category_name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = products.find((p) => p.product_id === value);

  const handleSelect = (product) => {
    onChange(product.product_id);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 text-left transition-all cursor-pointer"
        style={{
          padding: "10px 14px",
          borderRadius: open ? "12px 12px 0 0" : 12,
          border: `1.5px solid ${error ? "#e53935" : open ? "#111" : "#ebebeb"}`,
          backgroundColor: open ? "#fff" : "#f9f9f9",
          outline: "none",
        }}
      >
        {/* Icon */}
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
          style={{ backgroundColor: selected ? "#111" : "#f0f0f0" }}
        >
          <InventoryOutlinedIcon style={{ fontSize: 14, color: selected ? "#fff" : "#aaa" }} />
        </div>

        {/* Label */}
        <div className="flex-1 min-w-0">
          {selected ? (
            <div>
              <p className="truncate" style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#111" }}>
                {selected.name}
              </p>
              <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
                {selected.category_name} · {fmt(selected.selling_price)}
              </p>
            </div>
          ) : (
            <p style={{ ...INTER, fontSize: 13, fontWeight: 500, color: "#bbb" }}>
              Select a product…
            </p>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {selected && (
            <div
              onClick={handleClear}
              className="flex items-center justify-center w-5 h-5 rounded-md cursor-pointer hover:bg-gray-100 transition-all"
              style={{ color: "#bbb" }}
            >
              <CloseOutlinedIcon style={{ fontSize: 13 }} />
            </div>
          )}
          <KeyboardArrowDownOutlinedIcon
            style={{
              fontSize: 18,
              color: "#bbb",
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute left-0 right-0 z-50 overflow-hidden flex flex-col"
          style={{
            backgroundColor: "#fff",
            border: "1.5px solid #111",
            borderTop: "1px solid #f0f0f0",
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            maxHeight: 280,
          }}
        >
          {/* Search */}
          <div className="relative flex-shrink-0 px-3 py-2.5" style={{ borderBottom: "1px solid #f5f5f5" }}>
            <SearchOutlinedIcon style={{ position: "absolute", left: 22, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#bbb" }} />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full outline-none"
              style={{
                ...INTER, fontSize: 12, fontWeight: 600, color: "#111",
                backgroundColor: "#f9f9f9",
                border: "1.5px solid #ebebeb",
                borderRadius: 8,
                padding: "7px 10px 7px 30px",
              }}
            />
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8">
                <InventoryOutlinedIcon style={{ fontSize: 28, color: "#e0e0e0" }} />
                <p style={{ ...INTER, fontSize: 12, color: "#ccc", fontWeight: 600 }}>No products found</p>
              </div>
            ) : (
              filtered.map((product, idx) => {
                const isSelected = product.product_id === value;
                return (
                  <button
                    key={product.product_id}
                    type="button"
                    onClick={() => handleSelect(product)}
                    className="w-full flex items-center gap-3 text-left cursor-pointer transition-all"
                    style={{
                      padding: "10px 14px",
                      backgroundColor: isSelected ? "#f9f9f9" : "transparent",
                      borderBottom: idx < filtered.length - 1 ? "1px solid #f9f9f9" : "none",
                      border: "none",
                      borderBottomWidth: idx < filtered.length - 1 ? 1 : 0,
                      borderBottomStyle: "solid",
                      borderBottomColor: "#f9f9f9",
                      outline: "none",
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "#f9f9f9"; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    {/* Category pill */}
                    <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                      <p className="truncate" style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#111" }}>
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded-md"
                          style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#f5f5f5", color: "#888" }}
                        >
                          {product.category_name}
                        </span>
                        <span style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#e53935" }}>
                          {fmt(product.selling_price)}
                        </span>
                      </div>
                    </div>

                    {/* Check */}
                    {isSelected && (
                      <div
                        className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "#111" }}
                      >
                        <CheckOutlinedIcon style={{ fontSize: 12, color: "#fff" }} />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROMOTION FORM MODAL
// ══════════════════════════════════════════════════════════════════════════════
const PromotionFormModal = ({ mode = "create", offer = null, onSave, onClose }) => {
  const isEdit = mode === "edit";

  const { products: limitedProducts = [], loading: productsLoading } = useLimitedData();

  const [title,         setTitle]         = useState(offer?.title         || "");
  const [description,   setDescription]   = useState(offer?.description   || "");
  const [discountType,  setDiscountType]  = useState(offer?.discount_type  || "percentage");
  const [discountValue, setDiscountValue] = useState(offer?.discount_value ? String(offer.discount_value) : "");
  const [startDate,     setStartDate]     = useState(toDateInput(offer?.start_date));
  const [endDate,       setEndDate]       = useState(toDateInput(offer?.end_date));
  const [isActive,      setIsActive]      = useState(offer?.is_active ?? true);
  const [bannerImage,   setBannerImage]   = useState(offer?.banner_image   || "");
  const [productId,     setProductId]     = useState(offer?.product_id     || null);
  const [saving,        setSaving]        = useState(false);
  const [errors,        setErrors]        = useState({});


  const validate = () => {
    const e = {};
    if (!title.trim())                                                         e.title         = "Title is required.";
    if (!productId)                                                            e.productId     = "Please select a product.";
    if (!discountValue || Number(discountValue) <= 0)                          e.discountValue = "Must be greater than 0.";
    if (discountType === "percentage" && Number(discountValue) > 100)          e.discountValue = "Cannot exceed 100%.";
    if (!startDate)                                                            e.startDate     = "Start date is required.";
    if (!endDate)                                                              e.endDate       = "End date is required.";
    if (startDate && endDate && new Date(startDate) >= new Date(endDate))      e.endDate       = "End must be after start.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...(isEdit && offer ? { id: offer.id } : {}),
      title:          title.trim(),
      description:    description.trim() || null,
      discount_type:  discountType,
      discount_value: Number(discountValue),
      start_date:     new Date(startDate).toISOString(),
      end_date:       new Date(endDate).toISOString(),
      is_active:      isActive,
      banner_image:   bannerImage.trim() || null,
      product_id:     productId,
    };
    // Delegate creation to parent (onSave) to avoid duplicate API calls
    try {
      await onSave?.(payload);
      setSaving(false);
    } catch (err) {
      setSaving(false);
      setErrors((e) => ({ ...e, form: err?.message || String(err) }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div
        className="bg-white rounded-2xl w-full flex flex-col overflow-hidden"
        style={{ maxWidth: 560, maxHeight: "92vh", boxShadow: "0 16px 48px rgba(0,0,0,0.18)", border: "1px solid #ebebeb" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid #f0f0f0" }}>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
              Promotions / {isEdit ? "Edit" : "Create"}
            </p>
            <h2 style={{ ...SORA, fontSize: 16, fontWeight: 800, color: "#111" }}>
              {isEdit ? "Edit Promotion" : "New Promotion"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 bg-transparent cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-400"
            style={{ color: "#888" }}
          >
            <CloseIcon style={{ fontSize: 17 }} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <div className="flex flex-col gap-5">

            {/* Title */}
            <div>
              <FieldLabel required>Promotion Title</FieldLabel>
              <TextInput value={title} onChange={setTitle} placeholder="e.g. Flash Sale – 20% Off GPUs" />
              <ErrorMsg msg={errors.title} />
            </div>

            {/* Description */}
            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Short description of this promotion…"
                className="w-full outline-none resize-none transition-all"
                style={{
                  ...INTER, fontSize: 13, fontWeight: 500, color: "#111", lineHeight: 1.7,
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1.5px solid #ebebeb",
                  backgroundColor: "#f9f9f9",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
                onBlur={(e)  => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
              />
            </div>

            {/* ── Product selector ── */}
            <div>
              <FieldLabel required>Product</FieldLabel>
              <ProductDropdown
                value={productId}
                onChange={(id) => {
                  setProductId(id);
                  if (errors.productId) setErrors((e) => { const n = { ...e }; delete n.productId; return n; });
                }}
                error={errors.productId}
                products={limitedProducts}
              />
              <ErrorMsg msg={errors.productId} />
            </div>

            {/* Discount type + value */}
            <div>
              <FieldLabel required>Discount</FieldLabel>
              <div className="flex gap-2">
                {/* Type toggle */}
                <div className="flex rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1.5px solid #ebebeb" }}>
                  {["percentage", "fixed"].map((t, i) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDiscountType(t)}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 cursor-pointer transition-all"
                      style={{
                        ...INTER, fontSize: 12, fontWeight: 700,
                        backgroundColor: discountType === t ? "#111" : "#f9f9f9",
                        color:           discountType === t ? "#fff" : "#888",
                        border:          "none",
                        borderLeft:      i > 0 ? "1.5px solid #ebebeb" : "none",
                      }}
                    >
                      {t === "percentage"
                        ? <><PercentOutlinedIcon style={{ fontSize: 13 }} /> %</>
                        : <><AttachMoneyOutlinedIcon style={{ fontSize: 13 }} /> Fixed</>
                      }
                    </button>
                  ))}
                </div>

                {/* Value */}
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === "percentage" ? "0 – 100" : "0.00"}
                    min="0"
                    max={discountType === "percentage" ? 100 : undefined}
                    className="w-full outline-none transition-all"
                    style={{
                      ...INTER, fontSize: 13, fontWeight: 600, color: "#111",
                      padding: "10px 48px 10px 14px",
                      borderRadius: 12,
                      border: `1.5px solid ${errors.discountValue ? "#e53935" : "#ebebeb"}`,
                      backgroundColor: "#f9f9f9",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
                    onBlur={(e)  => { e.target.style.borderColor = errors.discountValue ? "#e53935" : "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#bbb" }}>
                    {discountType === "percentage" ? "%" : "LKR"}
                  </span>
                </div>
              </div>
              <ErrorMsg msg={errors.discountValue} />
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel required>Start Date</FieldLabel>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full outline-none transition-all"
                  style={{
                    ...INTER, fontSize: 12, fontWeight: 600, color: "#111",
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: `1.5px solid ${errors.startDate ? "#e53935" : "#ebebeb"}`,
                    backgroundColor: "#f9f9f9",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={(e)  => { e.target.style.borderColor = errors.startDate ? "#e53935" : "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
                />
                <ErrorMsg msg={errors.startDate} />
              </div>
              <div>
                <FieldLabel required>End Date</FieldLabel>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full outline-none transition-all"
                  style={{
                    ...INTER, fontSize: 12, fontWeight: 600, color: "#111",
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: `1.5px solid ${errors.endDate ? "#e53935" : "#ebebeb"}`,
                    backgroundColor: "#f9f9f9",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
                  onBlur={(e)  => { e.target.style.borderColor = errors.endDate ? "#e53935" : "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
                />
                <ErrorMsg msg={errors.endDate} />
              </div>
            </div>

            {/* Banner image URL */}
            <div>
              <FieldLabel>Banner Image URL</FieldLabel>
              <TextInput value={bannerImage} onChange={setBannerImage} placeholder="https://…/banner.jpg" />
              {bannerImage && (
                <div className="mt-2 rounded-xl overflow-hidden" style={{ height: 80, border: "1px solid #f0f0f0", backgroundColor: "#f7f7f7" }}>
                  <img src={bannerImage} alt="Banner preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                </div>
              )}
            </div>

            {/* Active toggle */}
            <div>
              <FieldLabel>Status</FieldLabel>
              <button
                type="button"
                onClick={() => setIsActive((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all"
                style={{
                  backgroundColor: isActive ? "#f0fdf4" : "#fef2f2",
                  border: `1.5px solid ${isActive ? "#bbf7d0" : "#fecaca"}`,
                }}
              >
                <div>
                  <p style={{ ...INTER, fontSize: 13, fontWeight: 700, color: isActive ? "#15803d" : "#dc2626" }}>
                    {isActive ? "Active" : "Inactive"}
                  </p>
                  <p style={{ ...INTER, fontSize: 11, color: isActive ? "#16a34a" : "#ef4444", opacity: 0.8 }}>
                    {isActive ? "Visible on storefront" : "Hidden from customers"}
                  </p>
                </div>
                {isActive
                  ? <ToggleOnIcon  style={{ fontSize: 36, color: "#16a34a" }} />
                  : <ToggleOffIcon style={{ fontSize: 36, color: "#ef4444" }} />
                }
              </button>
            </div>

          </div>
        </div>

        { errors.form && (
          <div className="px-6 pb-2">
            <ErrorMsg msg={errors.form} />
          </div>
        ) }

        {/* ── Footer ── */}
        <div className="flex items-center gap-3 px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid #f0f0f0" }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
            style={{ ...INTER, fontSize: 13, fontWeight: 600, background: "#fff" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white transition-all hover:bg-[#222] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : isEdit
                ? <SaveOutlinedIcon style={{ fontSize: 16 }} />
                : <AddOutlinedIcon  style={{ fontSize: 16 }} />
            }
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Promotion"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionFormModal;