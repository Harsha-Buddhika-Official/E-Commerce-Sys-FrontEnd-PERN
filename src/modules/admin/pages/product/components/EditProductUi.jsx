import { useState } from "react";
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

const SORA = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

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
          <option key={typeof option === "string" ? option : option.value} value={typeof option === "string" ? option : option.value}>
            {typeof option === "string" ? option : option.label}
          </option>
        ))}
      </select>
      <KeyboardArrowDownOutlinedIcon style={{ fontSize: 18, color: "#bbb", position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  );
}

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
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555", background: "#fff" }}>
            Keep Editing
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-white cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 700, background: "#f97316", border: "none" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ea6c00"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f97316"}
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
        <button onClick={onBack} className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white cursor-pointer" style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}>
          <ArrowBackOutlinedIcon style={{ fontSize: 16 }} /> Go Back
        </button>
      </SectionCard>
    </div>
  );
}

export function EditProductHeader({ productId, dirty, saved, saving, updateLoading, onBack, onSave }) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer">
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

        <button onClick={onBack} className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555" }}>
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving || updateLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all cursor-pointer disabled:opacity-60"
          style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: saved ? "#16a34a" : "#111", border: "none" }}
          onMouseEnter={(e) => { if (!saving && !saved) e.currentTarget.style.backgroundColor = "#222"; }}
          onMouseLeave={(e) => { if (!saving && !saved) e.currentTarget.style.backgroundColor = "#111"; }}
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
            onBlur={(e) => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
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
            onBlur={(e) => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
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

export function ProductImagesSection({ images, onFileUpload, onSetPrimary, onUpdateAlt, onRemoveImage, onMoveImage, fileInputRef }) {
  return (
    <SectionCard>
      <SectionTitle icon={<ImageOutlinedIcon style={{ fontSize: 16 }} />}>
        Product Images ({images.length})
      </SectionTitle>

      <div className="flex flex-col gap-2.5 mb-5">
        {images.length === 0 && <p style={{ ...INTER, fontSize: 13, color: "#bbb" }}>No images added yet.</p>}
        {images.map((img, idx) => (
          <div
            key={img._key}
            className="flex items-center gap-3 p-3 rounded-xl transition-all"
            style={{ backgroundColor: img.is_primary ? "#f0f6ff" : "#f9f9f9", border: `1.5px solid ${img.is_primary ? "#93c5fd" : "#f0f0f0"}` }}
          >
            <DragIndicatorOutlinedIcon style={{ fontSize: 18, color: "#ccc", flexShrink: 0 }} />

            <div className="flex items-center justify-center rounded-xl overflow-hidden shrink-0 bg-white" style={{ width: 52, height: 52, border: "1px solid #ebebeb" }}>
              {img.image_url ? (
                <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-contain p-1" onError={(e) => { e.target.style.display = "none"; }} />
              ) : (
                <InventoryOutlinedIcon style={{ fontSize: 20, color: "#ccc" }} />
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <input
                value={img.alt_text}
                onChange={(e) => onUpdateAlt(img._key, e.target.value)}
                placeholder="Alt text…"
                className="w-full outline-none transition-all"
                style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#111", padding: "6px 10px", borderRadius: 8, border: "1.5px solid #ebebeb", backgroundColor: "#fff" }}
                onFocus={(e) => e.target.style.borderColor = "#111"}
                onBlur={(e) => e.target.style.borderColor = "#ebebeb"}
              />
              <p className="truncate" style={{ ...INTER, fontSize: 10, color: "#ccc", fontFamily: "'Courier New', monospace" }}>{img.image_url}</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => onMoveImage(img._key, -1)} disabled={idx === 0} className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white cursor-pointer disabled:opacity-30 transition-all" style={{ ...INTER, fontSize: 12, color: "#555" }}>↑</button>
              <button onClick={() => onMoveImage(img._key, 1)} disabled={idx === images.length - 1} className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white cursor-pointer disabled:opacity-30 transition-all" style={{ ...INTER, fontSize: 12, color: "#555" }}>↓</button>
              <button onClick={() => onSetPrimary(img._key)} className="flex items-center gap-1 px-2 py-1 rounded-lg border cursor-pointer transition-all" style={{ ...INTER, fontSize: 10, fontWeight: 700, backgroundColor: img.is_primary ? "#111" : "#f5f5f5", borderColor: img.is_primary ? "#111" : "#e5e5e5", color: img.is_primary ? "#fff" : "#888" }}>
                <StarOutlinedIcon style={{ fontSize: 11 }} />
                {img.is_primary ? "Primary" : "Set Primary"}
              </button>
              <button onClick={() => onRemoveImage(img._key)} className="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer transition-all" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#e53935" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fef2f2"}>
                <CloseOutlinedIcon style={{ fontSize: 13 }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-4" style={{ backgroundColor: "#f9f9f9", border: "1.5px dashed #e5e5e5" }}>
        <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Upload Images</p>
        <p style={{ ...INTER, fontSize: 12, color: "#666", marginBottom: 10 }}>Upload image files from your device. Pasting image URLs is not supported.</p>
        <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border cursor-pointer transition-all bg-transparent" style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#555", borderColor: "#e5e5e5" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.color = "#111"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.color = "#555"; }}>
          <CloudUploadOutlinedIcon style={{ fontSize: 17 }} /> Upload from device
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={onFileUpload} />
      </div>
    </SectionCard>
  );
}

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
      ) : (Array.isArray(catalogAttributes) && catalogAttributes.length > 0) ? (
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
            <button onClick={() => onStockQtyChange(Math.max(0, Number(stockQty) - 1))} className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-all" style={{ ...INTER, fontSize: 18, color: "#555" }}>−</button>
            <input
              type="number"
              value={stockQty}
              onChange={(e) => onStockQtyChange(Number(e.target.value))}
              min="0"
              className="flex-1 text-center outline-none transition-all"
              style={{ ...SORA, fontSize: 16, fontWeight: 900, color: "#111", padding: "9px 14px", borderRadius: 12, border: "1.5px solid #ebebeb", backgroundColor: "#f9f9f9" }}
              onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
            />
            <button onClick={() => onStockQtyChange(Number(stockQty) + 1)} className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-all" style={{ ...INTER, fontSize: 18, color: "#555" }}>+</button>
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