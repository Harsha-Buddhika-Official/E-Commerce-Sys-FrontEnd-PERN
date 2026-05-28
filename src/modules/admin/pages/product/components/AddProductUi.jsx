import { useState } from "react";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export const SORA = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
export const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };
export const MAX_IMAGES = 3;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const TAG_OPTIONS = ["", "BEST_SELLER", "NEW", "HOT", "SALE"];

export const formatLabel = (value) =>
  String(value || "").replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());

export const normalizeOptions = (items, valueKeys, labelKeys) => {
  const list = Array.isArray(items?.data)
    ? items.data
    : Array.isArray(items?.brands)
      ? items.brands
      : Array.isArray(items?.categories)
        ? items.categories
        : Array.isArray(items)
          ? items
          : [];

  return list
    .map((item) => {
      if (typeof item === "string") return { value: item, label: item };

      const pick = (keys, fallback) => {
        for (const key of keys) {
          if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== "") return String(item[key]);
        }
        return fallback;
      };

      const value = pick(valueKeys, item?.id ?? item?.name ?? "");
      const label = pick(labelKeys, value);
      return value || label ? { value: String(value), label: String(label) } : null;
    })
    .filter(Boolean);
};

export const normalizeAttributes = (payload) => {
  const list = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.attributes)
      ? payload.attributes
      : Array.isArray(payload)
        ? payload
        : [];

  const normalized = list
    .map((attribute) => {
      if (!attribute || typeof attribute !== "object") return null;
      const values = Array.isArray(attribute.values)
        ? attribute.values
        : Array.isArray(attribute.options)
          ? attribute.options
          : Array.isArray(attribute.attribute_values)
            ? attribute.attribute_values
            : [];

      return {
        attribute_id: Number(attribute.attribute_id ?? attribute.id ?? 0),
        name: String(attribute.name ?? attribute.attribute_name ?? attribute.label ?? ""),
        values: values.map((value) =>
          typeof value === "string"
            ? { attribute_value_id: value, value }
            : {
                attribute_value_id: Number(value.attribute_value_id ?? value.id ?? 0),
                value: String(value.value ?? value.name ?? ""),
              },
        ),
      };
    })
    .filter((attribute) => attribute && attribute.attribute_id);

  // Dedupe attributes and their values in case backend returns repeated rows.
  const byAttributeId = new Map();

  for (const attribute of normalized) {
    const existing = byAttributeId.get(attribute.attribute_id);
    if (!existing) {
      const seenValues = new Set();
      const uniqueValues = [];
      for (const value of attribute.values || []) {
        const key = `${String(value.attribute_value_id)}::${String(value.value)}`;
        if (seenValues.has(key)) continue;
        seenValues.add(key);
        uniqueValues.push(value);
      }
      byAttributeId.set(attribute.attribute_id, { ...attribute, values: uniqueValues });
      continue;
    }

    const seenValues = new Set(
      (existing.values || []).map((value) => `${String(value.attribute_value_id)}::${String(value.value)}`),
    );

    for (const value of attribute.values || []) {
      const key = `${String(value.attribute_value_id)}::${String(value.value)}`;
      if (seenValues.has(key)) continue;
      seenValues.add(key);
      existing.values.push(value);
    }
  }

  return Array.from(byAttributeId.values());
};

export function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden ${className}`}
      style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {children}
    </div>
  );
}

export function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f0f0f0]">
      <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0" style={{ backgroundColor: "#111" }}>
        <span style={{ color: "#fff", display: "flex" }}>{icon}</span>
      </div>
      <div>
        <p style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111" }}>{title}</p>
        {subtitle && <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>{subtitle}</p>}
      </div>
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

export function TextField({ value, onChange, placeholder, type = "text", error, rows }) {
  const [focused, setFocused] = useState(false);
  const base = {
    ...INTER,
    fontSize: 13,
    fontWeight: 500,
    color: "#111",
    backgroundColor: focused ? "#fff" : "#f9f9f9",
    border: `1.5px solid ${error ? "#e53935" : focused ? "#111" : "#ebebeb"}`,
    borderRadius: 12,
    padding: "10px 14px",
    outline: "none",
    transition: "all 0.15s",
    width: "100%",
  };

  return rows ? (
    <textarea
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="resize-none"
      style={{ ...base, lineHeight: 1.7 }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  ) : (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      style={base}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export function SelectField({ value, onChange, options, placeholder, error, disabled }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full appearance-none outline-none transition-all cursor-pointer"
        style={{
          ...INTER,
          fontSize: 13,
          fontWeight: 500,
          color: value ? "#111" : "#9ca3af",
          backgroundColor: disabled ? "#f3f4f6" : focused ? "#fff" : "#f9f9f9",
          border: `1.5px solid ${error ? "#e53935" : focused ? "#111" : "#ebebeb"}`,
          borderRadius: 12,
          padding: "10px 38px 10px 14px",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <KeyboardArrowDownOutlinedIcon style={{ fontSize: 18, color: "#bbb", position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  );
}

export function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 mt-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
      <WarningAmberOutlinedIcon style={{ fontSize: 12 }} />{message}
    </p>
  );
}

export function ErrorBanner({ title, message }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}>
      <WarningAmberOutlinedIcon style={{ fontSize: 16, color: "#e53935", flexShrink: 0, marginTop: 1 }} />
      <div>
        <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#e53935", marginBottom: 3 }}>{title}</p>
        <p style={{ ...INTER, fontSize: 12, color: "#e53935" }}>{message}</p>
      </div>
    </div>
  );
}

export function PreviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#f8f8f8] last:border-0">
      <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}>{label}</span>
      <span style={{ ...INTER, fontSize: 13, fontWeight: 700, color: value ? "#111" : "#ccc" }}>{value || "—"}</span>
    </div>
  );
}
