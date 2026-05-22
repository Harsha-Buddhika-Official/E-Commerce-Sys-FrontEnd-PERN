import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon     from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon          from "@mui/icons-material/SaveOutlined";
import CheckCircleOutlinedIcon   from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon  from "@mui/icons-material/WarningAmberOutlined";
import LabelOutlinedIcon         from "@mui/icons-material/LabelOutlined";
import ImageOutlinedIcon         from "@mui/icons-material/ImageOutlined";
import StorefrontOutlinedIcon    from "@mui/icons-material/StorefrontOutlined";
import BrokenImageOutlinedIcon   from "@mui/icons-material/BrokenImageOutlined";
import { useCreateBrand } from "../features/brands/hooks/useCreateBrand.js";

// ─── Font constants ───────────────────────────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionCard({ children }) {
  return (
    <div
      className="bg-white rounded-2xl p-6"
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
        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
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

function FieldLabel({ children, required }) {
  return (
    <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
      {children}{required && <span style={{ color: "#e53935" }}> *</span>}
    </p>
  );
}

function TextInput({ value, onChange, placeholder, icon, mono, readOnly, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative flex items-center">
      {icon && (
        <div
          className="absolute left-3 pointer-events-none"
          style={{ color: focused ? "#111" : "#bbb", display: "flex", alignItems: "center" }}
        >
          {icon}
        </div>
      )}
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full outline-none transition-all"
        style={{
          ...INTER,
          fontSize: 13,
          fontWeight: 600,
          color: readOnly ? "#aaa" : "#111",
          fontFamily: mono ? "'Courier New', monospace" : INTER.fontFamily,
          letterSpacing: mono ? "0.02em" : 0,
          padding: `10px 14px 10px ${icon ? "38px" : "14px"}`,
          borderRadius: 12,
          border: `1.5px solid ${error ? "#e53935" : focused ? "#111" : "#ebebeb"}`,
          backgroundColor: readOnly ? "#f5f5f5" : focused ? "#fff" : "#f9f9f9",
          cursor: readOnly ? "not-allowed" : "text",
        }}
        onFocus={() => !readOnly && setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BRAND CREATE PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function BrandCreatePage({ onBack = null, onSuccess = null }) {
  const navigate = useNavigate();
  const { createBrand, loading } = useCreateBrand();
  const [name,    setName]    = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoErr, setLogoErr] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [errors,  setErrors]  = useState({});
  const [apiError, setApiError] = useState("");

  // ── Handlers ────────────────────────────────────────────────────────────────
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
    const payload = {
      name:     name.trim(),
      logo_url: logoUrl.trim() || null,
    };
    try {
      const createdBrand = await createBrand(payload);
      setSaved(true);
      if (onSuccess) {
        onSuccess(createdBrand);
      } else {
        navigate("/admin/brands");
      }
    } catch (err) {
      setApiError(err?.message || "Failed to create brand.");
    }
  };

  const hasLogo = !logoErr && logoUrl.trim().length > 0;
  const saveDisabled = loading || saved;
  const handleBackClick = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate("/admin/brands");
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer"
          >
            <ArrowBackOutlinedIcon style={{ fontSize: 18 }} />
          </button>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Brands / Create</p>
            <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
              Add New Brand
            </h1>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saveDisabled}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all cursor-pointer disabled:opacity-60"
          style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: saved ? "#16a34a" : "#111", border: "none" }}
          onMouseEnter={(e) => { if (!loading && !saved) e.currentTarget.style.backgroundColor = "#222"; }}
          onMouseLeave={(e) => { if (!loading && !saved) e.currentTarget.style.backgroundColor = saved ? "#16a34a" : "#111"; }}
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
          ) : saved ? (
            <><CheckCircleOutlinedIcon style={{ fontSize: 16 }} /> Brand Created!</>
          ) : (
            <><SaveOutlinedIcon style={{ fontSize: 16 }} /> Create Brand</>
          )}
        </button>
      </div>

      {/* Validation error banner */}
      {Object.keys(errors).length > 0 && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5"
          style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
        >
          <WarningAmberOutlinedIcon style={{ fontSize: 16, color: "#e53935", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#e53935", marginBottom: 4 }}>
              Please fix the following:
            </p>
            {Object.values(errors).map((err, i) => (
              <p key={i} style={{ ...INTER, fontSize: 12, color: "#e53935" }}>• {err}</p>
            ))}
          </div>
        </div>
      )}

      {apiError && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5"
          style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
        >
          <WarningAmberOutlinedIcon style={{ fontSize: 16, color: "#e53935", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#e53935", marginBottom: 4 }}>
              Unable to save brand
            </p>
            <p style={{ ...INTER, fontSize: 12, color: "#e53935" }}>{apiError}</p>
          </div>
        </div>
      )}

      {/* ── 2-col grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ══ LEFT (col-span-2) ══ */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          <SectionCard>
            <SectionTitle icon={<StorefrontOutlinedIcon style={{ fontSize: 16 }} />}>
              Brand Details
            </SectionTitle>

            <div className="flex flex-col gap-5">

              {/* Name */}
              <div>
                <FieldLabel required>Brand Name</FieldLabel>
                <TextInput
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. DarkFlash"
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
          </SectionCard>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="flex flex-col gap-5">

          {/* Logo preview */}
          <SectionCard>
            <SectionTitle icon={<ImageOutlinedIcon style={{ fontSize: 16 }} />}>
              Logo Preview
            </SectionTitle>

            <div
              className="flex items-center justify-center rounded-2xl w-full mb-4"
              style={{ height: 140, backgroundColor: "#f9f9f9", border: "1.5px dashed #e0e0e0" }}
            >
              {hasLogo ? (
                <img
                  src={logoUrl}
                  alt="logo preview"
                  className="max-h-20 max-w-[75%] object-contain transition-all"
                  onError={() => setLogoErr(true)}
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <BrokenImageOutlinedIcon style={{ fontSize: 36, color: "#ddd" }} />
                  <span style={{ ...INTER, fontSize: 11, color: "#ccc", fontWeight: 500 }}>
                    No logo yet
                  </span>
                </div>
              )}
            </div>

            {/* Brand name preview */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
            >
              {/* Mini logo */}
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: "#fff", border: "1px solid #ebebeb" }}
              >
                {hasLogo ? (
                  <img src={logoUrl} alt="" className="w-full h-full object-contain p-1" onError={() => setLogoErr(true)} />
                ) : (
                  <StorefrontOutlinedIcon style={{ fontSize: 18, color: "#ccc" }} />
                )}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <p
                  className="truncate"
                  style={{ ...SORA, fontSize: 13, fontWeight: 800, color: name ? "#111" : "#ccc" }}
                >
                  {name || "Brand name"}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Save button (repeated) */}
          <button
            onClick={handleSave}
            disabled={saveDisabled}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white transition-all cursor-pointer disabled:opacity-60"
            style={{ ...SORA, fontSize: 14, fontWeight: 800, backgroundColor: saved ? "#16a34a" : "#111", border: "none" }}
            onMouseEnter={(e) => { if (!loading && !saved) e.currentTarget.style.backgroundColor = "#222"; }}
            onMouseLeave={(e) => { if (!loading && !saved) e.currentTarget.style.backgroundColor = saved ? "#16a34a" : "#111"; }}
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Brand…</>
            ) : saved ? (
              <><CheckCircleOutlinedIcon style={{ fontSize: 18 }} /> Brand Created!</>
            ) : (
              <><SaveOutlinedIcon style={{ fontSize: 18 }} /> Create Brand</>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
