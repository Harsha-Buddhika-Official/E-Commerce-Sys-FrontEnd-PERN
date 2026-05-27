import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SaveOutlinedIcon          from "@mui/icons-material/SaveOutlined";
import CheckCircleOutlinedIcon   from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon  from "@mui/icons-material/WarningAmberOutlined";
import LabelOutlinedIcon         from "@mui/icons-material/LabelOutlined";
import ImageOutlinedIcon         from "@mui/icons-material/ImageOutlined";
import StorefrontOutlinedIcon    from "@mui/icons-material/StorefrontOutlined";
import BrokenImageOutlinedIcon   from "@mui/icons-material/BrokenImageOutlined";
import CloseIcon                 from "@mui/icons-material/Close";
import { useCreateBrand }        from "../features/brands/hooks/useCreateBrand.js";

// ─── Font constants — leaf elements only ──────────────────────────────────────
import { SORA, INTER } from "../../../styles/fonts";

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

// ══════════════════════════════════════════════════════════════════════════════
// BRAND CREATE OVERLAY — centred popup modal
// ══════════════════════════════════════════════════════════════════════════════

export default function BrandCreateOverlay({
  isOpen     = true,
  onClose    = null,
  onSuccess  = null,
  onCreated  = null,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { createBrand, loading } = useCreateBrand();

  const [name,     setName]     = useState("");
  const [logoUrl,  setLogoUrl]  = useState("");
  const [logoErr,  setLogoErr]  = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState("");

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleNameChange = (v) => {
    setName(v);
    setSaved(false);
    setApiError("");
    if (errors.name) setErrors((e) => { const n = { ...e }; delete n.name; return n; });
  };

  const handleLogoChange = (v) => {
    setLogoUrl(v);
    setLogoErr(false);
    setSaved(false);
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Brand name is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const created = await createBrand({ name: name.trim(), logo_url: logoUrl.trim() || null });
      setSaved(true);
      setTimeout(() => {
            // Prefer caller's `onCreated` callback (BrandManagementPage passes this).
            if (onCreated) onCreated(created);
            else if (onSuccess) onSuccess(created);
            else navigate("/admin/brands");
      }, 800);
    } catch (err) {
      setApiError(err?.message || "Failed to create brand.");
    }
  };

  const handleClose = () => {
    setName(""); setLogoUrl(""); setLogoErr(false);
    setSaved(false); setErrors({}); setApiError("");
    if (typeof onClose === "function") { onClose(); return; }
    if (location.state?.backgroundLocation) { navigate(-1); return; }
    navigate("/admin/brands", { replace: true });
  };

  const hasLogo      = !logoErr && logoUrl.trim().length > 0;
  const saveDisabled = loading || saved;

  if (!isOpen) return null;

  return (
    // ── Full-screen fixed overlay ──────────────────────────────────────────
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">

      {/* Backdrop — page behind stays visible, softly blurred */}
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
          // Pop-in animation
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
              <StorefrontOutlinedIcon style={{ fontSize: 18, color: "#fff" }} />
            </div>
            <div>
              <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
                Brands / Create
              </p>
              <h2 style={{ ...SORA, fontSize: 16, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
                Add New Brand
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
                  {apiError ? "Unable to save brand" : "Please fix the following:"}
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
              <FieldLabel required>Brand Name</FieldLabel>
              <TextInput
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. DarkFlash, Corsair, ASUS…"
                icon={<LabelOutlinedIcon style={{ fontSize: 16 }} />}
                error={errors.name}
              />
              {errors.name && (
                <p className="flex items-center gap-1 mt-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
                  <WarningAmberOutlinedIcon style={{ fontSize: 12 }} /> {errors.name}
                </p>
              )}
            </div>

            {/* Logo URL */}
            <div>
              <FieldLabel>Logo URL</FieldLabel>
              <TextInput
                value={logoUrl}
                onChange={handleLogoChange}
                placeholder="https://example.com/logo.png"
                icon={<ImageOutlinedIcon style={{ fontSize: 16 }} />}
              />
              <p style={{ ...INTER, fontSize: 11, color: "#bbb", marginTop: 5 }}>
                Paste a direct image URL — PNG, JPG, SVG, or WebP.
              </p>
            </div>
          </div>

          {/* ── Preview ── */}
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
          >
            <p
              className="mb-3"
              style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}
            >
              Preview
            </p>

            {/* Logo box */}
            <div
              className="flex items-center justify-center rounded-xl w-full mb-3"
              style={{ height: 110, backgroundColor: "#fff", border: "1.5px dashed #e0e0e0" }}
            >
              {hasLogo ? (
                <img
                  src={logoUrl}
                  alt="logo preview"
                  className="max-h-16 max-w-[65%] object-contain transition-all"
                  onError={() => setLogoErr(true)}
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <BrokenImageOutlinedIcon style={{ fontSize: 32, color: "#e0e0e0" }} />
                  <span style={{ ...INTER, fontSize: 11, color: "#ccc" }}>No logo yet</span>
                </div>
              )}
            </div>

            {/* Brand card mock */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white"
              style={{ border: "1px solid #ebebeb" }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 overflow-hidden"
                style={{ backgroundColor: "#f5f5f5", border: "1px solid #ebebeb" }}
              >
                {hasLogo ? (
                  <img src={logoUrl} alt="" className="w-full h-full object-contain p-1" onError={() => setLogoErr(true)} />
                ) : (
                  <StorefrontOutlinedIcon style={{ fontSize: 20, color: "#ccc" }} />
                )}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <p className="truncate" style={{ ...SORA, fontSize: 14, fontWeight: 800, color: name ? "#111" : "#ccc" }}>
                  {name || "Brand name"}
                </p>
                <p style={{ ...INTER, fontSize: 11, color: "#bbb" }}>Brand</p>
              </div>
              {/* Status dot */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: name ? "#16a34a" : "#e0e0e0" }}
                />
                <span style={{ ...INTER, fontSize: 11, fontWeight: 600, color: name ? "#16a34a" : "#bbb" }}>
                  {name ? "Ready" : "Incomplete"}
                </span>
              </div>
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
                Brand Created!
              </>
            ) : (
              <>
                <SaveOutlinedIcon style={{ fontSize: 16 }} />
                Create Brand
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}