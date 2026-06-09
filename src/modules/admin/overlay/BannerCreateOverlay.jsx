import { useState, useRef, useEffect }  from "react";
import { useNavigate, useLocation }     from "react-router-dom";
import { SORA, INTER }                  from "../../../styles/fonts.js";

import SaveOutlinedIcon                 from "@mui/icons-material/SaveOutlined";
import CheckCircleOutlinedIcon          from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon         from "@mui/icons-material/WarningAmberOutlined";
import LabelOutlinedIcon                from "@mui/icons-material/LabelOutlined";
import CloudUploadOutlinedIcon          from "@mui/icons-material/CloudUploadOutlined";
import AddPhotoAlternateOutlinedIcon    from "@mui/icons-material/AddPhotoAlternateOutlined";
import VideocamOutlinedIcon             from "@mui/icons-material/VideocamOutlined";
import CloseIcon                        from "@mui/icons-material/Close";

import { useCreateBanner }              from "../features/banners/hooks/useCreateBanner.js";


// ─── Field primitives ─────────────────────────────────────────────────────────
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
        <div className="absolute left-3 pointer-events-none flex items-center"
          style={{ color: focused ? "#111" : "#bbb" }}>
          {icon}
        </div>
      )}
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full outline-none transition-all"
        style={{
          ...INTER, fontSize: 13, fontWeight: 600, color: "#111",
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
// CREATE BANNER OVERLAY
// ══════════════════════════════════════════════════════════════════════════════
export default function BannerCreateOverlay({ isOpen = true, onClose = null, onCreated = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { createBanner, loading } = useCreateBanner();

  const [title,       setTitle]       = useState("");
  const [mediaFile,   setMediaFile]   = useState(null);   // the raw File object
  const [mediaType,   setMediaType]   = useState(null);   // "image" | "video"
  const [preview,     setPreview]     = useState("");     // object URL
  const [saved,       setSaved]       = useState(false);
  const [errors,      setErrors]      = useState({});
  const [apiError,    setApiError]    = useState("");
  const [mediaErr,    setMediaErr]    = useState(false);

  const fileRef = useRef();

  // ── Reset on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setMediaFile(null);
      setMediaType(null);
      setPreview("");
      setSaved(false);
      setErrors({});
      setApiError("");
      setMediaErr(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [isOpen]);

  // ── Cleanup object URL on unmount ──────────────────────────────────────────
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleTitleChange = (v) => {
    setTitle(v);
    setSaved(false);
    setApiError("");
    if (errors.title) setErrors((e) => { const n = { ...e }; delete n.title; return n; });
  };

  const handleFile = (file) => {
    if (!file) return;

    const validImages = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const validVideos = ["video/mp4", "video/webm", "video/ogg"];
    const maxSize     = 100 * 1024 * 1024; // 100 MB for videos

    const isImage = validImages.includes(file.type);
    const isVideo = validVideos.includes(file.type);

    if (!isImage && !isVideo) {
      setMediaErr(true);
      setApiError("Please upload a valid file (JPEG, PNG, WebP, GIF, MP4, WebM, or OGG).");
      return;
    }

    if (isImage && file.size > 10 * 1024 * 1024) {
      setMediaErr(true);
      setApiError("Image size must be less than 10 MB.");
      return;
    }

    if (isVideo && file.size > maxSize) {
      setMediaErr(true);
      setApiError("Video size must be less than 100 MB.");
      return;
    }

    // Revoke old preview URL before creating a new one
    if (preview) URL.revokeObjectURL(preview);

    setMediaFile(file);
    setMediaType(isImage ? "image" : "video");
    setMediaErr(false);
    setApiError("");
    setSaved(false);
    setPreview(URL.createObjectURL(file));

    if (errors.media) setErrors((e) => { const n = { ...e }; delete n.media; return n; });
  };

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Banner title is required.";
    if (!mediaFile)    e.media = "Please upload a banner image or video.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const created = await createBanner({ title: title.trim(), image: mediaFile });
      setSaved(true);
      setTimeout(() => {
        if (onCreated) { onCreated(created); return; }
        navigate("/admin/banners");
      }, 800);
    } catch (err) {
      setApiError(err?.message || "Failed to create banner.");
    }
  };

  const handleClose = () => {
    if (typeof onClose === "function") { onClose(); return; }
    if (location.state?.backgroundLocation) { navigate(-1); return; }
    navigate("/admin/banners", { replace: true });
  };

  const saveDisabled = loading || saved;
  const hasErrors    = Object.keys(errors).length > 0 || !!apiError;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">

      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
        onClick={handleClose}
      />

      {/* Modal card */}
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
          @keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        `}</style>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid #f0f0f0" }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
              style={{ backgroundColor: "#111" }}>
              {mediaType === "video"
                ? <VideocamOutlinedIcon          style={{ fontSize: 18, color: "#fff" }} />
                : <AddPhotoAlternateOutlinedIcon style={{ fontSize: 18, color: "#fff" }} />
              }
            </div>
            <div>
              <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Banners / Create</p>
              <h2 style={{ ...SORA, fontSize: 16, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
                Add New Banner
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-transparent
                       text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all cursor-pointer"
          >
            <CloseIcon style={{ fontSize: 18 }} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Error banner */}
          {hasErrors && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
              <WarningAmberOutlinedIcon style={{ fontSize: 16, color: "#e53935", flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#e53935", marginBottom: 4 }}>
                  {apiError ? "Unable to save banner" : "Please fix the following:"}
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

          <div className="flex flex-col gap-5">

            {/* Title */}
            <div>
              <FieldLabel required>Banner Title</FieldLabel>
              <TextInput
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Summer Sale 2026"
                icon={<LabelOutlinedIcon style={{ fontSize: 16 }} />}
                error={errors.title}
              />
              {errors.title && (
                <p className="flex items-center gap-1 mt-1.5"
                  style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
                  <WarningAmberOutlinedIcon style={{ fontSize: 12 }} /> {errors.title}
                </p>
              )}
            </div>

            {/* Media upload */}
            <div>
              <FieldLabel required>Banner Image or Video</FieldLabel>
              <label
                className="relative flex flex-col items-center justify-center w-full rounded-xl cursor-pointer transition-all overflow-hidden"
                style={{
                  border: `2px dashed ${errors.media || mediaErr ? "#e53935" : "#ddd"}`,
                  backgroundColor: preview ? "#000" : "#fafafa",
                  minHeight: preview ? 160 : 140,
                }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                {/* ── Preview: image ── */}
                {preview && mediaType === "image" && (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full object-cover"
                      style={{ maxHeight: 200, opacity: 0.92 }}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                      <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#fff" }}>
                        Click to replace
                      </span>
                    </div>
                  </>
                )}

                {/* ── Preview: video ── */}
                {preview && mediaType === "video" && (
                  <>
                    <video
                      src={preview}
                      className="w-full object-cover"
                      style={{ maxHeight: 200, opacity: 0.92 }}
                      muted
                      playsInline
                      loop
                      autoPlay
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                      <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#fff" }}>
                        Click to replace
                      </span>
                    </div>
                  </>
                )}

                {/* ── Empty state ── */}
                {!preview && (
                  <div className="flex flex-col items-center gap-2 py-8 px-6 text-center">
                    <CloudUploadOutlinedIcon style={{ fontSize: 34, color: "#bbb" }} />
                    <p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#666" }}>
                      Click to upload or drag & drop
                    </p>
                    <p style={{ ...INTER, fontSize: 11, color: "#999" }}>
                      Images: JPEG, PNG, WebP, GIF · Videos: MP4, WebM, OGG
                    </p>
                    <p style={{ ...INTER, fontSize: 11, color: "#bbb" }}>
                      Max 10 MB for images · Max 100 MB for videos
                    </p>
                  </div>
                )}
              </label>

              {/* File type badge — shown after selection */}
              {mediaFile && !mediaErr && (
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                    style={{
                      backgroundColor: mediaType === "video" ? "#eff6ff" : "#f0fdf4",
                      border: `1px solid ${mediaType === "video" ? "#bfdbfe" : "#bbf7d0"}`,
                    }}
                  >
                    {mediaType === "video"
                      ? <VideocamOutlinedIcon          style={{ fontSize: 13, color: "#2563eb" }} />
                      : <AddPhotoAlternateOutlinedIcon style={{ fontSize: 13, color: "#16a34a" }} />
                    }
                    <span style={{
                      ...INTER, fontSize: 11, fontWeight: 700,
                      color: mediaType === "video" ? "#2563eb" : "#15803d",
                    }}>
                      {mediaType === "video" ? "Video" : "Image"} · {mediaFile.name} · {(mediaFile.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                </div>
              )}

              {(errors.media || mediaErr) && (
                <p className="flex items-center gap-1 mt-1.5"
                  style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
                  <WarningAmberOutlinedIcon style={{ fontSize: 12 }} />
                  {errors.media || "Invalid file"}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ── Sticky footer ── */}
        <div className="shrink-0 px-6 py-4 flex items-center gap-3"
          style={{ borderTop: "1px solid #f0f0f0", backgroundColor: "#fff" }}>
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
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: saved ? "#16a34a" : "#111", border: "none" }}
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            ) : saved ? (
              <><CheckCircleOutlinedIcon style={{ fontSize: 16 }} /> Banner Created!</>
            ) : (
              <><SaveOutlinedIcon style={{ fontSize: 16 }} /> Create Banner</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}