import { useState } from "react";
import CloseIcon                from "@mui/icons-material/Close";
import SaveOutlinedIcon         from "@mui/icons-material/SaveOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import PercentOutlinedIcon      from "@mui/icons-material/PercentOutlined";
import AttachMoneyOutlinedIcon  from "@mui/icons-material/AttachMoneyOutlined";
import ToggleOnIcon             from "@mui/icons-material/ToggleOn";
import ToggleOffIcon            from "@mui/icons-material/ToggleOff";
import ImageOutlinedIcon        from "@mui/icons-material/ImageOutlined";
import LockOutlinedIcon         from "@mui/icons-material/LockOutlined";
import InventoryOutlinedIcon    from "@mui/icons-material/InventoryOutlined";
import LocalOfferOutlinedIcon   from "@mui/icons-material/LocalOfferOutlined";
import CheckCircleOutlinedIcon  from "@mui/icons-material/CheckCircleOutlined";

const SORA = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const fmt = (v) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(Number(v) || 0);

const toDateInput = (iso) => {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
};

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
        ...INTER, fontSize: 13, fontWeight: 500, color: "#111",
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

function DateTimeInput({ value, onChange, error }) {
  return (
    <input
      type="datetime-local"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full outline-none transition-all"
      style={{
        ...INTER, fontSize: 12, fontWeight: 500, color: "#111",
        padding: "10px 14px",
        borderRadius: 12,
        border: `1.5px solid ${error ? "#e53935" : "#ebebeb"}`,
        backgroundColor: "#f9f9f9",
      }}
      onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
      onBlur={(e) => { e.target.style.borderColor = error ? "#e53935" : "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
    />
  );
}

function LockedProductField({ product }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Product
        </p>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f5f5f5", border: "1px solid #ebebeb" }}>
          <LockOutlinedIcon style={{ fontSize: 11, color: "#aaa" }} />
          <span style={{ ...INTER, fontSize: 10, fontWeight: 700, color: "#aaa" }}>Locked</span>
        </div>
      </div>

      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ backgroundColor: "#f9f9f9", border: "1.5px solid #ebebeb", cursor: "not-allowed", opacity: 0.85 }}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
          style={{ backgroundColor: "#111" }}
        >
          <InventoryOutlinedIcon style={{ fontSize: 16, color: "#fff" }} />
        </div>

        <div className="flex-1 min-w-0">
          {product ? (
            <>
              <p className="truncate" style={{ ...SORA, fontSize: 13, fontWeight: 700, color: "#111" }}>
                {product.name || product.product_name || `Product #${product.product_id}`}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {product.category_name && (
                  <span className="px-2 py-0.5 rounded-md" style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#ebebeb", color: "#777" }}>
                    {product.category_name}
                  </span>
                )}
                {product.selling_price && (
                  <span style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#e53935" }}>
                    {fmt(product.selling_price)}
                  </span>
                )}
              </div>
            </>
          ) : (
            <p style={{ ...INTER, fontSize: 13, color: "#bbb" }}>No product linked</p>
          )}
        </div>

        <LockOutlinedIcon style={{ fontSize: 16, color: "#ccc", flexShrink: 0 }} />
      </div>

      <p className="mt-1.5 flex items-center gap-1.5" style={{ ...INTER, fontSize: 11, color: "#bbb" }}>
        <LockOutlinedIcon style={{ fontSize: 11 }} />
        Product cannot be changed after an offer is created.
      </p>
    </div>
  );
}

const PromotionEditOverlay = ({ offer = null, onSave, onClose }) => {
  const linkedProduct = offer?.product
    || offer?.products?.[0]
    || (offer?.product_id
      ? { product_id: offer.product_id, name: offer.product_name, category_name: offer.category_name, selling_price: offer.selling_price }
      : null);
      
  const [title, setTitle] = useState(offer?.title || "");
  const [description, setDescription] = useState(offer?.description || "");
  const [discountType, setDiscountType] = useState(offer?.discount_type || "percentage");
  const [discountValue, setDiscountValue] = useState(offer?.discount_value ? String(offer.discount_value) : "");
  const [startDate, setStartDate] = useState(toDateInput(offer?.start_date));
  const [endDate, setEndDate] = useState(toDateInput(offer?.end_date));
  const [isActive, setIsActive] = useState(offer?.is_active ?? true);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(offer?.banner_image || "");
  const [bannerErr, setBannerErr] = useState(false);

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const mark = () => { setDirty(true); setSaved(false); };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setBannerErr(true); return; }
    if (file.size > 10 * 1024 * 1024) { setBannerErr(true); return; }
    setBannerFile(file); setBannerErr(false); mark();
    const reader = new FileReader();
    reader.onload = (ev) => setBannerPreview(ev.target?.result || "");
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Title is required.";
    if (!discountValue || Number(discountValue) <= 0) nextErrors.discountValue = "Must be greater than 0.";
    if (discountType === "percentage" && Number(discountValue) > 100) nextErrors.discountValue = "Cannot exceed 100%.";
    if (!startDate) nextErrors.startDate = "Start date is required.";
    if (!endDate) nextErrors.endDate = "End date is required.";
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) nextErrors.endDate = "End must be after start.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);

    const offerPayload = {
      id: offer?.id,
      title: title.trim(),
      description: description.trim() || null,
      discount_type: discountType,
      discount_value: Number(discountValue),
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      is_active: isActive,
      banner_image: !bannerFile ? (bannerPreview.trim() || null) : undefined,
    };

    const payload = bannerFile
      ? (() => {
          const fd = new FormData();
          Object.entries(offerPayload).forEach(([key, value]) => {
            if (key === "banner_image" || value === null || value === undefined) return;
            fd.append(key, value);
          });
          fd.append("banner_image", bannerFile);
          return fd;
        })()
      : offerPayload;

    try {
      await onSave?.(payload);
      setSaved(true);
      setDirty(false);
      setTimeout(() => onClose?.(), 700);
    } catch (err) {
      setErrors((current) => ({ ...current, form: err?.message || "Failed to update promotion." }));
    } finally {
      setSaving(false);
    }
  };

  if (!offer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div
        className="bg-white rounded-2xl w-full flex flex-col overflow-hidden"
        style={{ maxWidth: 560, maxHeight: "92vh", boxShadow: "0 16px 48px rgba(0,0,0,0.18)", border: "1px solid #ebebeb" }}
      >
        <style>{`@keyframes popIn { from{transform:scale(0.93);opacity:0} to{transform:scale(1);opacity:1} }`}</style>

        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: "1px solid #f0f0f0" }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0" style={{ backgroundColor: "#111" }}>
              <LocalOfferOutlinedIcon style={{ fontSize: 18, color: "#fff" }} />
            </div>
            <div>
              <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Promotions / Edit</p>
              <h2 style={{ ...SORA, fontSize: 16, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
                Edit Promotion
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {dirty && !saved && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ ...INTER, fontSize: 10, fontWeight: 600, backgroundColor: "#fff7ed", color: "#f97316", border: "1px solid #fed7aa" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Unsaved
              </span>
            )}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 bg-transparent cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-400"
              style={{ color: "#888" }}
            >
              <CloseIcon style={{ fontSize: 17 }} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          <div className="flex flex-col gap-5">
            <div>
              <FieldLabel required>Promotion Title</FieldLabel>
              <TextInput value={title} onChange={(v) => { setTitle(v); mark(); }} placeholder="e.g. Flash Sale – 20% Off GPUs" />
              <ErrorMsg msg={errors.title} />
            </div>

            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); mark(); }}
                rows={3}
                placeholder="Short description of this promotion…"
                className="w-full outline-none resize-none transition-all"
                style={{ ...INTER, fontSize: 13, fontWeight: 500, color: "#111", lineHeight: 1.7,
                  padding: "10px 14px", borderRadius: 12, border: "1.5px solid #ebebeb", backgroundColor: "#f9f9f9" }}
                onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
                onBlur={(e)  => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
              />
            </div>

            <LockedProductField product={linkedProduct} />

            <div>
              <FieldLabel required>Discount</FieldLabel>
              <div className="flex gap-2">
                <div className="flex rounded-xl overflow-hidden shrink-0" style={{ border: "1.5px solid #ebebeb" }}>
                  {["percentage", "fixed"].map((type, index) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => { setDiscountType(type); mark(); }}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 cursor-pointer transition-all"
                      style={{ ...INTER, fontSize: 12, fontWeight: 700,
                        backgroundColor: discountType === type ? "#111" : "#f9f9f9",
                        color: discountType === type ? "#fff" : "#888",
                        border: "none",
                        borderLeft: index > 0 ? "1.5px solid #ebebeb" : "none" }}
                    >
                      {type === "percentage"
                        ? <><PercentOutlinedIcon style={{ fontSize: 13 }} /> %</>
                        : <><AttachMoneyOutlinedIcon style={{ fontSize: 13 }} /> Fixed</>
                      }
                    </button>
                  ))}
                </div>

                <div className="relative flex-1">
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => { setDiscountValue(e.target.value); mark(); }}
                    placeholder={discountType === "percentage" ? "0 – 100" : "0.00"}
                    min="0"
                    max={discountType === "percentage" ? 100 : undefined}
                    className="w-full outline-none transition-all"
                    style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#111",
                      padding: "10px 48px 10px 14px", borderRadius: 12,
                      border: `1.5px solid ${errors.discountValue ? "#e53935" : "#ebebeb"}`,
                      backgroundColor: "#f9f9f9" }}
                    onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
                    onBlur={(e) => { e.target.style.borderColor = errors.discountValue ? "#e53935" : "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#bbb" }}>
                    {discountType === "percentage" ? "%" : "LKR"}
                  </span>
                </div>
              </div>
              <ErrorMsg msg={errors.discountValue} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel required>Start Date</FieldLabel>
                <DateTimeInput value={startDate} onChange={(v) => { setStartDate(v); mark(); }} error={errors.startDate} />
                <ErrorMsg msg={errors.startDate} />
              </div>
              <div>
                <FieldLabel required>End Date</FieldLabel>
                <DateTimeInput value={endDate} onChange={(v) => { setEndDate(v); mark(); }} error={errors.endDate} />
                <ErrorMsg msg={errors.endDate} />
              </div>
            </div>

            <div>
              <FieldLabel>Banner Image</FieldLabel>
              <label
                className="relative flex items-center justify-center w-full border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all"
                style={{ borderColor: bannerErr ? "#e53935" : "#ddd", backgroundColor: bannerPreview ? "#f9f9f9" : "#fafafa" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#111"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = bannerErr ? "#e53935" : "#ddd"; }}
              >
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleBannerChange} className="hidden" />
                <div className="flex flex-col items-center gap-2 w-full pointer-events-none">
                  {bannerPreview ? (
                    <>
                      <img src={bannerPreview} alt="Banner preview" className="w-full max-h-28 object-cover rounded-xl" />
                      <p style={{ ...INTER, fontSize: 11, color: "#888", fontWeight: 600 }}>Click to change banner</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
                        <ImageOutlinedIcon style={{ fontSize: 20, color: "#aaa" }} />
                      </div>
                      <p style={{ ...INTER, fontSize: 12, color: "#555", fontWeight: 600 }}>Upload banner image</p>
                      <p style={{ ...INTER, fontSize: 11, color: "#bbb" }}>JPEG, PNG, WebP · max 5MB</p>
                    </>
                  )}
                </div>
              </label>
              {bannerErr && <ErrorMsg msg="Invalid banner image — use JPEG, PNG, or WebP under 5MB." />}
            </div>

            <div>
              <FieldLabel>Status</FieldLabel>
              <button
                type="button"
                onClick={() => { setIsActive((p) => !p); mark(); }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all"
                style={{ backgroundColor: isActive ? "#f0fdf4" : "#fef2f2", border: `1.5px solid ${isActive ? "#bbf7d0" : "#fecaca"}` }}
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
                  ? <ToggleOnIcon style={{ fontSize: 36, color: "#16a34a" }} />
                  : <ToggleOffIcon style={{ fontSize: 36, color: "#ef4444" }} />
                }
              </button>
            </div>
          </div>
        </div>

        {errors.form && (
          <div className="px-6 pb-2">
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
              <WarningAmberOutlinedIcon style={{ fontSize: 16, color: "#e53935", flexShrink: 0, marginTop: 1 }} />
              <p style={{ ...INTER, fontSize: 12, color: "#e53935" }}>{errors.form}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 px-6 py-4 shrink-0" style={{ borderTop: "1px solid #f0f0f0" }}>
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
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white transition-all disabled:opacity-60 cursor-pointer"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: saved ? "#16a34a" : "#111", border: "none" }}
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : saved
                ? <CheckCircleOutlinedIcon style={{ fontSize: 16 }} />
                : <SaveOutlinedIcon style={{ fontSize: 16 }} />
            }
            {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionEditOverlay;