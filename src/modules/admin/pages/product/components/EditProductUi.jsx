import { useState, useRef } from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────
export function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 ${className}`}
      style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-5 pb-3" style={{ borderBottom: "1px solid #f0f0f0" }}>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: "#f5f5f5", color: "#111" }}>
        {icon}
      </div>
      <span style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111", letterSpacing: "0.02em" }}>
        {children}
      </span>
    </div>
  );
}

export function FieldLabel({ children, required }) {
  return (
    <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
      {children}{required && <span style={{ color: "#e53935" }}> *</span>}
    </p>
  );
}

export function TextInput({ value, onChange, placeholder, type = "text", disabled, mono }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full outline-none transition-all"
      style={{
        ...INTER,
        fontSize: 13,
        fontWeight: 600,
        color: disabled ? "#aaa" : "#111",
        fontFamily: mono ? "'Courier New', monospace" : INTER.fontFamily,
        backgroundColor: disabled ? "#f5f5f5" : focused ? "#fff" : "#f9f9f9",
        border: `1.5px solid ${focused ? "#111" : "#ebebeb"}`,
        borderRadius: 12,
        padding: "10px 14px",
        cursor: disabled ? "not-allowed" : "text",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export function PriceInput({ value, onChange, placeholder, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min="0"
        className="w-full outline-none transition-all"
        style={{
          ...INTER,
          fontSize: 13,
          fontWeight: 600,
          color: "#111",
          backgroundColor: focused ? "#fff" : "#f9f9f9",
          border: `1.5px solid ${error ? "#e53935" : focused ? "#111" : "#ebebeb"}`,
          borderRadius: 12,
          padding: "10px 48px 10px 14px",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#bbb" }}>
        LKR
      </span>
    </div>
  );
}

export function SelectInput({ value, onChange, options, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none outline-none cursor-pointer transition-all"
        style={{
          ...INTER,
          fontSize: 13,
          fontWeight: 600,
          color: "#111",
          backgroundColor: focused ? "#fff" : "#f9f9f9",
          border: `1.5px solid ${focused ? "#111" : "#ebebeb"}`,
          borderRadius: 12,
          padding: "10px 38px 10px 14px",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {options.map((option) => (
          <option
            key={typeof option === "string" ? option : option.value}
            value={typeof option === "string" ? option : option.value}
          >
            {typeof option === "string" ? option : option.label}
          </option>
        ))}
      </select>
      <KeyboardArrowDownOutlinedIcon style={{ fontSize: 18, color: "#bbb", position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MODALS & STATES
// ─────────────────────────────────────────────────────────────
export function DiscardModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-7 flex flex-col gap-4 w-full" style={{ maxWidth: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0" style={{ backgroundColor: "#fff7ed" }}>
            <WarningAmberOutlinedIcon style={{ fontSize: 20, color: "#f97316" }} />
          </div>
          <h3 style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Discard Changes?</h3>
        </div>
        <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
          You have unsaved changes. Going back will discard all edits.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
            style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555", background: "#fff" }}
          >
            Keep Editing
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-white cursor-pointer"
            style={{ ...INTER, fontSize: 13, fontWeight: 700, background: "#f97316", border: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ea6c00")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f97316")}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="h-full bg-[#f5f5f5] flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        <p style={{ ...INTER, fontSize: 13, color: "#888" }}>Loading product…</p>
      </div>
    </div>
  );
}

export function NotFoundState({ error, onBack }) {
  return (
    <div className="h-full bg-[#f5f5f5] flex items-center justify-center p-6">
      <SectionCard className="max-w-sm w-full">
        <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Product not found</p>
        <p style={{ ...INTER, fontSize: 13, color: "#666", marginTop: 6 }}>{error}</p>
        <button
          onClick={onBack}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white cursor-pointer"
          style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
        >
          <ArrowBackOutlinedIcon style={{ fontSize: 16 }} /> Go Back
        </button>
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────────────────────
export function EditProductHeader({ productId, dirty, saved, saving, updateLoading, onBack, onSave }) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer"
        >
          <ArrowBackOutlinedIcon style={{ fontSize: 18 }} />
        </button>
        <div>
          <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Products / #{productId ?? "—"} / Edit</p>
          <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Edit Product</h1>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        {dirty && !saved && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ ...INTER, fontSize: 11, fontWeight: 600, backgroundColor: "#fff7ed", color: "#f97316", border: "1px solid #fed7aa" }}>
            <InfoOutlinedIcon style={{ fontSize: 13 }} /> Unsaved changes
          </span>
        )}
        {saved && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ ...INTER, fontSize: 11, fontWeight: 600, backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>
            <CheckCircleOutlinedIcon style={{ fontSize: 13 }} /> Saved
          </span>
        )}
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all cursor-pointer"
          style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555" }}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving || updateLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all cursor-pointer disabled:opacity-60"
          style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: saved ? "#16a34a" : "#111", border: "none" }}
          onMouseEnter={(e) => { if (!saving && !saved) e.currentTarget.style.backgroundColor = "#222"; }}
          onMouseLeave={(e) => { if (!saving && !saved) e.currentTarget.style.backgroundColor = saved ? "#16a34a" : "#111"; }}
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
          ) : saved ? (
            <><CheckCircleOutlinedIcon style={{ fontSize: 16 }} /> Saved!</>
          ) : (
            <><SaveOutlinedIcon style={{ fontSize: 16 }} /> Save Changes</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRODUCT IMAGES SECTION  (deferred — no API calls on remove/upload)
// ─────────────────────────────────────────────────────────────
export function ProductImagesSection({
  productId,        // still needed for reorderImages (instant) only
  images,           // saved images from DB
  onImagesChange,   // update saved images list (reorder only)
  reorderImages,    // instant reorder API — stays live
  reorderImagesLoading,
  pendingAdds,      // File[]  — queued uploads
  onPendingAddsChange,
  pendingRemoves,   // image_id[] — queued deletes
  onPendingRemovesChange,
}) {
  const fileInputRef     = useRef(null);
  const [reordering, setReordering] = useState(false);

  // Derive what to show: saved images minus pending removes + pending-add previews
  const savedVisible = images.filter((img) => !pendingRemoves.includes(img.image_id));

  const pendingPreviews = pendingAdds.map((file, i) => ({
    _key:          `pending-${i}`,
    image_id:      null,
    image_url:     URL.createObjectURL(file),
    alt_text:      file.name,
    is_primary:    false,
    _pendingIndex: i,
  }));

  const displayImages  = [...savedVisible, ...pendingPreviews];
  const totalVisible   = displayImages.length;
  const slotsRemaining = 3 - totalVisible;

  // ── Upload — queued, no API call ────────────────────────────
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (totalVisible + files.length > 3) {
      alert(`Cannot add ${files.length} image(s). You already have ${totalVisible}. Maximum is 3.`);
      e.target.value = "";
      return;
    }
    onPendingAddsChange([...pendingAdds, ...files]);
    e.target.value = "";
  };

  // ── Remove — queued, no API call ────────────────────────────
  const handleRemove = (img) => {
    if (img._pendingIndex !== undefined) {
      // Remove from pending adds queue
      onPendingAddsChange(pendingAdds.filter((_, i) => i !== img._pendingIndex));
      return;
    }
    // Queue a deferred DB delete
    onPendingRemovesChange([...pendingRemoves, img.image_id]);
  };

  // ── Set Primary — instant API call (no content change) ──────
  const handleSetPrimary = async (img) => {
    if (!img.image_id) return;
    const order = savedVisible.map((i) => i.image_id).filter(Boolean);
    setReordering(true);
    try {
      const updated = await reorderImages(productId, img.image_id, order);
      onImagesChange(updated.map((i, index) => ({ ...i, _key: i.image_id ?? index })));
    } catch (err) {
      alert(`Failed to set primary: ${err?.message || "Unknown error"}`);
    } finally {
      setReordering(false);
    }
  };

  // ── Move Up / Down — instant API call (saved images only) ───
  const handleMove = async (img, dir) => {
    // Only allow reordering saved images (pending previews can't be reordered via API)
    if (img._pendingIndex !== undefined) return;

    const idx = savedVisible.findIndex((i) => i.image_id === img.image_id);
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === savedVisible.length - 1)) return;

    const next = [...savedVisible];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    const reordered = next.map((i, index) => ({ ...i, sort_order: index }));
    onImagesChange(reordered);

    const primaryImg = reordered.find((i) => i.is_primary);
    const order      = reordered.map((i) => i.image_id).filter(Boolean);

    setReordering(true);
    try {
      const updated = await reorderImages(productId, primaryImg?.image_id ?? order[0], order);
      onImagesChange(updated.map((i, index) => ({ ...i, _key: i.image_id ?? index })));
    } catch (err) {
      alert(`Failed to reorder images: ${err?.message || "Unknown error"}`);
    } finally {
      setReordering(false);
    }
  };

  const isAnyLoading = reordering || reorderImagesLoading;

  return (
    <SectionCard>
      <SectionTitle icon={<ImageOutlinedIcon style={{ fontSize: 16 }} />}>
        <span>Product Images ({totalVisible}/3)</span>
        {isAnyLoading && (
          <span className="ml-2 inline-flex items-center gap-1" style={{ ...INTER, fontSize: 11, color: "#888", fontWeight: 500 }}>
            <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            Updating…
          </span>
        )}
        {pendingRemoves.length > 0 && (
          <span className="ml-2 px-2 py-0.5 rounded-full" style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#fef2f2", color: "#e53935", border: "1px solid #fecaca" }}>
            {pendingRemoves.length} pending removal{pendingRemoves.length !== 1 ? "s" : ""}
          </span>
        )}
        {pendingAdds.length > 0 && (
          <span className="ml-1 px-2 py-0.5 rounded-full" style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>
            {pendingAdds.length} pending upload{pendingAdds.length !== 1 ? "s" : ""}
          </span>
        )}
      </SectionTitle>

      {/* Pending-save notice */}
      {(pendingAdds.length > 0 || pendingRemoves.length > 0) && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}>
          <InfoOutlinedIcon style={{ fontSize: 14, color: "#f97316", flexShrink: 0 }} />
          <p style={{ ...INTER, fontSize: 12, color: "#c2410c" }}>
            Image changes are staged. Click <strong>Save Changes</strong> to apply them.
          </p>
        </div>
      )}

      {/* Image list */}
      <div className="flex flex-col gap-2.5 mb-5">
        {displayImages.length === 0 && (
          <p style={{ ...INTER, fontSize: 13, color: "#bbb" }}>No images added yet.</p>
        )}

        {displayImages.map((img, idx) => {
          const isPendingAdd    = img._pendingIndex !== undefined;
          const isPendingRemove = !isPendingAdd && pendingRemoves.includes(img.image_id);

          return (
            <div
              key={img._key ?? idx}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{
                backgroundColor: isPendingRemove
                  ? "#fef2f2"
                  : isPendingAdd
                  ? "#f0fdf4"
                  : img.is_primary
                  ? "#f0f6ff"
                  : "#f9f9f9",
                border: `1.5px solid ${
                  isPendingRemove
                    ? "#fecaca"
                    : isPendingAdd
                    ? "#bbf7d0"
                    : img.is_primary
                    ? "#93c5fd"
                    : "#f0f0f0"
                }`,
                opacity: isPendingRemove ? 0.6 : 1,
              }}
            >
              <DragIndicatorOutlinedIcon style={{ fontSize: 18, color: "#ccc", flexShrink: 0 }} />

              {/* Thumbnail */}
              <div
                className="flex items-center justify-center rounded-xl overflow-hidden shrink-0 bg-white"
                style={{ width: 52, height: 52, border: "1px solid #ebebeb" }}
              >
                {img.image_url ? (
                  <img
                    src={img.image_url}
                    alt={img.alt_text}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <InventoryOutlinedIcon style={{ fontSize: 20, color: "#ccc" }} />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="truncate flex-1" style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#555" }}>
                    {img.alt_text || img.image_url?.split("/").pop() || "Image"}
                  </p>

                  {isPendingRemove && (
                    <span className="px-1.5 py-0.5 rounded shrink-0" style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#fef2f2", color: "#e53935", border: "1px solid #fecaca" }}>
                      Will be removed
                    </span>
                  )}
                  {isPendingAdd && (
                    <span className="px-1.5 py-0.5 rounded shrink-0" style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>
                      Pending upload
                    </span>
                  )}
                  {!isPendingAdd && !isPendingRemove && img.is_primary && (
                    <span className="px-1.5 py-0.5 rounded shrink-0" style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#111", color: "#fff" }}>
                      Primary
                    </span>
                  )}
                </div>
                <p className="truncate" style={{ ...INTER, fontSize: 10, color: "#ccc", fontFamily: "'Courier New', monospace" }}>
                  {img.image_url}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Move up/down only for saved images not pending removal */}
                {!isPendingAdd && !isPendingRemove && (
                  <>
                    <button
                      onClick={() => handleMove(img, -1)}
                      disabled={idx === 0 || isAnyLoading}
                      className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white cursor-pointer disabled:opacity-30 transition-all"
                      style={{ ...INTER, fontSize: 12, color: "#555" }}
                      title="Move up"
                    >↑</button>

                    <button
                      onClick={() => handleMove(img, 1)}
                      disabled={idx === savedVisible.length - 1 || isAnyLoading}
                      className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white cursor-pointer disabled:opacity-30 transition-all"
                      style={{ ...INTER, fontSize: 12, color: "#555" }}
                      title="Move down"
                    >↓</button>

                    <button
                      onClick={() => handleSetPrimary(img)}
                      disabled={img.is_primary || isAnyLoading}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border cursor-pointer transition-all disabled:opacity-40"
                      style={{
                        ...INTER, fontSize: 10, fontWeight: 700,
                        backgroundColor: img.is_primary ? "#111" : "#f5f5f5",
                        borderColor:     img.is_primary ? "#111" : "#e5e5e5",
                        color:           img.is_primary ? "#fff" : "#888",
                      }}
                      title="Set as primary"
                    >
                      <StarOutlinedIcon style={{ fontSize: 11 }} />
                      {img.is_primary ? "Primary" : "Set Primary"}
                    </button>
                  </>
                )}

                {/* Undo pending remove */}
                {isPendingRemove && (
                  <button
                    onClick={() => onPendingRemovesChange(pendingRemoves.filter((id) => id !== img.image_id))}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg border cursor-pointer transition-all"
                    style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: "#fff7ed", borderColor: "#fed7aa", color: "#f97316" }}
                    title="Undo removal"
                  >
                    Undo
                  </button>
                )}

                {/* Remove / cancel pending add */}
                <button
                  onClick={() => handleRemove(img)}
                  disabled={isAnyLoading}
                  className="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer transition-all disabled:opacity-40"
                  style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#e53935" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fef2f2"}
                  title={isPendingAdd ? "Cancel upload" : "Remove image"}
                >
                  <CloseOutlinedIcon style={{ fontSize: 13 }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload area */}
      {slotsRemaining > 0 ? (
        <div className="rounded-xl p-4" style={{ backgroundColor: "#f9f9f9", border: "1.5px dashed #e5e5e5" }}>
          <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
            Upload Images ({slotsRemaining} slot{slotsRemaining !== 1 ? "s" : ""} remaining)
          </p>
          <p style={{ ...INTER, fontSize: 12, color: "#aaa", marginBottom: 10 }}>
            Images are uploaded when you save the product.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border cursor-pointer transition-all"
            style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#555", borderColor: "#e5e5e5", backgroundColor: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.color = "#111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.color = "#555"; }}
          >
            <CloudUploadOutlinedIcon style={{ fontSize: 17 }} /> Choose images…
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      ) : (
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "#f9f9f9", border: "1.5px dashed #e5e5e5" }}>
          <p style={{ ...INTER, fontSize: 12, color: "#aaa" }}>
            Maximum 3 images reached. Remove an image to upload a new one.
          </p>
        </div>
      )}
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// BASICS
// ─────────────────────────────────────────────────────────────
export function ProductBasicsSection({ name, onNameChange, description, onDescriptionChange, brandId, brandOptions, onBrandChange, categoryId, categoryOptions, onCategoryChange }) {
  return (
    <SectionCard>
      <SectionTitle icon={<EditOutlinedIcon style={{ fontSize: 16 }} />}>
        Basic Information
      </SectionTitle>
      <div className="flex flex-col gap-4">
        <div>
          <FieldLabel required>Product Name</FieldLabel>
          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Product name…"
            className="w-full outline-none transition-all"
            style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #ebebeb", backgroundColor: "#f9f9f9" }}
            onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
            onBlur={(e)  => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
          />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={4}
            placeholder="Product description…"
            className="w-full outline-none resize-none transition-all"
            style={{ ...INTER, fontSize: 13, fontWeight: 500, color: "#111", lineHeight: 1.7, padding: "10px 14px", borderRadius: 12, border: "1.5px solid #ebebeb", backgroundColor: "#f9f9f9" }}
            onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
            onBlur={(e)  => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel required>Brand</FieldLabel>
            <SelectInput value={brandId} onChange={onBrandChange} options={brandOptions} />
          </div>
          <div>
            <FieldLabel required>Category</FieldLabel>
            <SelectInput value={categoryId} onChange={onCategoryChange} options={categoryOptions} />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// ATTRIBUTES
// ─────────────────────────────────────────────────────────────
export function ProductAttributesSection({ productCategoryId, catalogAttributes, attributesLoading, attributesError, attributeSelections, onAttributeChange, attributeOptionsById }) {
  return (
    <SectionCard>
      <SectionTitle icon={<TagOutlinedIcon style={{ fontSize: 16 }} />}>
        Product Attributes ({Array.isArray(catalogAttributes) ? catalogAttributes.length : 0})
      </SectionTitle>
      {!productCategoryId ? (
        <p style={{ ...INTER, fontSize: 13, color: "#888" }}>Select a category to load attributes.</p>
      ) : attributesLoading ? (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
          <p style={{ ...INTER, fontSize: 13, color: "#888" }}>Loading attributes…</p>
        </div>
      ) : attributesError ? (
        <p style={{ ...INTER, fontSize: 13, color: "#b91c1c" }}>{attributesError}</p>
      ) : Array.isArray(catalogAttributes) && catalogAttributes.length > 0 ? (
        <div className="flex flex-col gap-3">
          {catalogAttributes.map((attribute) => (
            <div key={attribute.attribute_id} className="rounded-xl p-4" style={{ backgroundColor: "#f9f9f9", border: "1.5px solid #ebebeb" }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <FieldLabel>{attribute.name}</FieldLabel>
                <span style={{ ...INTER, fontSize: 11, color: "#aaa" }}>#{attribute.attribute_id}</span>
              </div>
              <SelectInput
                value={attributeSelections[String(attribute.attribute_id)] || ""}
                onChange={(value) => onAttributeChange(attribute.attribute_id, value)}
                options={attributeOptionsById[String(attribute.attribute_id)] || [{ value: "", label: "No values" }]}
              />
            </div>
          ))}
        </div>
      ) : (
        <p style={{ ...INTER, fontSize: 13, color: "#888" }}>No attributes are configured for this category.</p>
      )}
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────────────────────
export function ProductPricingSection({ basePrice, sellingPrice, discPrice, onBasePriceChange, onSellingPriceChange, onDiscPriceChange, discPriceError }) {
  return (
    <SectionCard>
      <SectionTitle icon={<LocalOfferOutlinedIcon style={{ fontSize: 16 }} />}>
        Pricing
      </SectionTitle>
      <div className="flex flex-col gap-4">
        <div>
          <FieldLabel>Base Price</FieldLabel>
          <PriceInput value={basePrice} onChange={onBasePriceChange} placeholder="0.00" />
        </div>
        <div>
          <FieldLabel required>Selling Price</FieldLabel>
          <PriceInput value={sellingPrice} onChange={onSellingPriceChange} placeholder="0.00" />
        </div>
        <div>
          <FieldLabel>Discounted Price</FieldLabel>
          <PriceInput value={discPrice} onChange={onDiscPriceChange} placeholder="0.00" error={discPriceError} />
          {discPriceError && (
            <p className="flex items-center gap-1 mt-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
              <WarningAmberOutlinedIcon style={{ fontSize: 12 }} /> Cannot exceed selling price
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// INVENTORY
// ─────────────────────────────────────────────────────────────
export function ProductInventorySection({ stockQty, onStockQtyChange, warrantyMonths, onWarrantyMonthsChange }) {
  return (
    <SectionCard>
      <SectionTitle icon={<InventoryOutlinedIcon style={{ fontSize: 16 }} />}>
        Inventory
      </SectionTitle>
      <div className="flex flex-col gap-4">
        <div>
          <FieldLabel>Stock Quantity</FieldLabel>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStockQtyChange(Math.max(0, Number(stockQty) - 1))}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-all"
              style={{ ...INTER, fontSize: 18, color: "#555" }}
            >−</button>
            <input
              type="number"
              value={stockQty}
              onChange={(e) => onStockQtyChange(Number(e.target.value))}
              min="0"
              className="flex-1 text-center outline-none transition-all"
              style={{ ...SORA, fontSize: 16, fontWeight: 900, color: "#111", padding: "9px 14px", borderRadius: 12, border: "1.5px solid #ebebeb", backgroundColor: "#f9f9f9" }}
              onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
              onBlur={(e)  => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
            />
            <button
              onClick={() => onStockQtyChange(Number(stockQty) + 1)}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-all"
              style={{ ...INTER, fontSize: 18, color: "#555" }}
            >+</button>
          </div>
        </div>
        <div>
          <FieldLabel>Warranty (months)</FieldLabel>
          <TextInput type="number" value={warrantyMonths} onChange={onWarrantyMonthsChange} placeholder="12" />
        </div>
      </div>
    </SectionCard>
  );
}