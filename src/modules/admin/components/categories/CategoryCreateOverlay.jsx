import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SaveOutlinedIcon          from "@mui/icons-material/SaveOutlined";
import CheckCircleOutlinedIcon   from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon  from "@mui/icons-material/WarningAmberOutlined";
import LabelOutlinedIcon         from "@mui/icons-material/LabelOutlined";
import ImageOutlinedIcon         from "@mui/icons-material/ImageOutlined";
import CategoryOutlinedIcon      from "@mui/icons-material/CategoryOutlined";
import InventoryOutlinedIcon     from "@mui/icons-material/InventoryOutlined";
import ExtensionOutlinedIcon     from "@mui/icons-material/ExtensionOutlined";
import CloseIcon                 from "@mui/icons-material/Close";
import { useCreateCategory }     from "../../features/categories/hooks/useCreateCategory.js";

import { SORA, INTER } from "../../../../styles/fonts.js";

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({ children, required }) {
  return (
    <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
      {children}
      {required && <span style={{ color: "#e53935" }}> *</span>}
    </p>
  );
}

function TextInput({ value, onChange, placeholder, icon, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative flex items-center">
      {icon && (
        <div
          className="absolute left-3 pointer-events-none flex items-center"
          style={{ color: focused ? "#111" : "#bbb" }}
        >
          {icon}
        </div>
      )}
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full outline-none transition-all"
        style={{
          ...INTER,
          fontSize: 13,
          fontWeight: 600,
          color: "#111",
          padding: `11px 14px 11px ${icon ? "40px" : "14px"}`,
          borderRadius: 12,
          border: `1.5px solid ${error ? "#e53935" : focused ? "#111" : "#ebebeb"}`,
          backgroundColor: focused ? "#fff" : "#f9f9f9",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

const CATEGORY_TYPES = [
  { value: "product",   label: "Product",   icon: InventoryOutlinedIcon },
  { value: "accessory", label: "Accessory", icon: ExtensionOutlinedIcon },
];

function TypeSelector({ value, onChange, error }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CATEGORY_TYPES.map(({ value: v, label, icon: Icon }) => {
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all cursor-pointer"
            style={{
              borderColor: active ? "#111" : error ? "#e53935" : "#ebebeb",
              backgroundColor: active ? "#111" : "#f9f9f9",
            }}
          >
            <Icon style={{ fontSize: 18, color: active ? "#fff" : "#888" }} />
            <span style={{ ...INTER, fontSize: 13, fontWeight: 700, color: active ? "#fff" : "#555" }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CATEGORY CREATE OVERLAY — centred popup modal
// ══════════════════════════════════════════════════════════════════════════════

export default function CategoryCreateOverlay({
  isOpen     = true,
  onClose    = null,
  onSuccess  = null,
  onCreated  = null,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { createCategory, loading } = useCreateCategory();

  const [name,           setName]           = useState("");
  const [categoryType,   setCategoryType]   = useState("");
  const [imageFile,      setImageFile]      = useState(null);
  const [imagePreview,   setImagePreview]   = useState("");
  const [imageErr,       setImageErr]       = useState(false);
  const [saved,          setSaved]          = useState(false);
  const [errors,         setErrors]         = useState({});
  const [apiError,       setApiError]       = useState("");

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleNameChange = (v) => {
    setName(v);
    setSaved(false);
    setApiError("");
    if (errors.name) setErrors((e) => { const n = { ...e }; delete n.name; return n; });
  };

  const handleTypeChange = (v) => {
    setCategoryType(v);
    setSaved(false);
    setApiError("");
    if (errors.category_type) setErrors((e) => { const n = { ...e }; delete n.category_type; return n; });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setImageErr(true);
      setApiError("Please upload a valid image (JPEG, PNG, or WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageErr(true);
      setApiError("Image size must be less than 5MB.");
      return;
    }

    setImageFile(file);
    setImageErr(false);
    setSaved(false);
    setApiError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result || "");
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Category name is required.";
    if (!categoryType) e.category_type = "Please select a category type.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const created = await createCategory({name: name.trim(), category_type: categoryType, image: imageFile});
      setSaved(true);
      setTimeout(() => {
        if (onCreated) onCreated(created);
        else if (onSuccess) onSuccess(created);
        else navigate("/admin/categories");
      }, 800);
    } catch (err) {
      setApiError(err?.message || "Failed to create category.");
    }
  };

  const handleClose = () => {
    setName("");
    setCategoryType("");
    setImageFile(null);
    setImagePreview("");
    setImageErr(false);
    setSaved(false);
    setErrors({});
    setApiError("");
    if (typeof onClose === "function") { onClose(); return; }
    if (location.state?.backgroundLocation) { navigate(-1); return; }
    navigate("/admin/categories", { replace: true });
  };

  const saveDisabled = loading || saved;

  if (!isOpen) return null;

  return (
    // ── Full-screen fixed overlay ──────────────────────────────────────────
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">

      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
        onClick={handleClose}
      />

      {/* ── Centred modal card ── */}
      <div
        className="relative flex flex-col bg-white rounded-2xl overflow-hidden w-full"
        style={{
          maxWidth: 500,
          maxHeight: "90vh",
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          animation: "popIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <style>{`
          @keyframes popIn {
            from { transform: scale(0.92); opacity: 0; }
            to   { transform: scale(1);    opacity: 1; }
          }
        `}</style>

        {/* ── Modal header ── */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid #f0f0f0" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
              style={{ backgroundColor: "#111" }}
            >
              <CategoryOutlinedIcon style={{ fontSize: 18, color: "#fff" }} />
            </div>
            <div>
              <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
                Categories / Create
              </p>
              <h2 style={{ ...SORA, fontSize: 16, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
                Add New Category
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-transparent text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all cursor-pointer"
          >
            <CloseIcon style={{ fontSize: 18 }} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Error banner */}
          {(Object.keys(errors).length > 0 || apiError) && (
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
            >
              <WarningAmberOutlinedIcon style={{ fontSize: 16, color: "#e53935", flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#e53935", marginBottom: 4 }}>
                  {apiError ? "Unable to save category" : "Please fix the following:"}
                </p>
                {apiError
                  ? <p style={{ ...INTER, fontSize: 12, color: "#e53935" }}>{apiError}</p>
                  : Object.values(errors).map((err, i) => (
                      <p key={i} style={{ ...INTER, fontSize: 12, color: "#e53935" }}>• {err}</p>
                    ))
                }
              </div>
            </div>
          )}

          {/* ── Form fields ── */}
          <div className="flex flex-col gap-5">

            {/* Name */}
            <div>
              <FieldLabel required>Category Name</FieldLabel>
              <TextInput
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Laptops, Keyboards, Monitors…"
                icon={<LabelOutlinedIcon style={{ fontSize: 16 }} />}
                error={errors.name}
              />
              {errors.name && (
                <p className="flex items-center gap-1 mt-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
                  <WarningAmberOutlinedIcon style={{ fontSize: 12 }} /> {errors.name}
                </p>
              )}
            </div>

            {/* Category type */}
            <div>
              <FieldLabel required>Category Type</FieldLabel>
              <TypeSelector value={categoryType} onChange={handleTypeChange} error={errors.category_type} />
              {errors.category_type && (
                <p className="flex items-center gap-1 mt-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
                  <WarningAmberOutlinedIcon style={{ fontSize: 12 }} /> {errors.category_type}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <FieldLabel>Category Image</FieldLabel>

              <label className="relative flex items-center justify-center w-full border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all"
                style={{
                  borderColor: imageErr ? "#e53935" : "#ddd",
                  backgroundColor: imageFile ? "#f0f7ff" : "#fafafa",
                }}
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Category preview"
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                      <p style={{ ...INTER, fontSize: 12, color: "#666", fontWeight: 600 }}>
                        Click to change image
                      </p>
                    </>
                  ) : (
                    <>
                      <ImageOutlinedIcon style={{ fontSize: 32, color: "#bbb" }} />
                      <p style={{ ...INTER, fontSize: 12, color: "#666", fontWeight: 600 }}>
                        Click to upload or drag and drop
                      </p>
                      <p style={{ ...INTER, fontSize: 11, color: "#999" }}>
                        JPEG, PNG, or WebP (max 5MB)
                      </p>
                    </>
                  )}
                </div>
              </label>
              {imageErr && (
                <p className="flex items-center gap-1 mt-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
                  <WarningAmberOutlinedIcon style={{ fontSize: 12 }} /> Invalid image
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Sticky footer ── */}
        <div
          className="shrink-0 px-6 py-4 flex items-center gap-3"
          style={{ borderTop: "1px solid #f0f0f0", backgroundColor: "#fff" }}
        >
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all cursor-pointer"
            style={{ ...INTER, fontSize: 13, fontWeight: 600, background: "#fff" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saveDisabled}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white transition-all cursor-pointer disabled:opacity-60"
            style={{
              ...SORA,
              fontSize: 13,
              fontWeight: 700,
              backgroundColor: saved ? "#16a34a" : "#111",
              border: "none",
            }}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : saved ? (
              <>
                <CheckCircleOutlinedIcon style={{ fontSize: 16 }} />
                Category Created!
              </>
            ) : (
              <>
                <SaveOutlinedIcon style={{ fontSize: 16 }} />
                Create Category
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}