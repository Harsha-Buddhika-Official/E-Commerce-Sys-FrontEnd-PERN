import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useCreateValue } from "../../features/attributes/hooks/useCreateValue";

import { SORA, INTER } from "../../../../styles/fonts";

export default function CreateValueModal({ attribute, onSave, onClose }) {
  const [value,   setValue]   = useState("");
  const [error,   setError]   = useState("");
  const [focused, setFocused] = useState(false);
  const { createValue, loading, error: createValueError } = useCreateValue();

  const handleSave = async () => {
    if (!value.trim()) { setError("Value is required."); return; }

    const savedValue = await createValue(attribute.attribute_id, { value: value.trim() });
    onSave?.({
      attribute_id: attribute.attribute_id,
      value: savedValue?.value ?? value.trim(),
      slug: savedValue?.slug,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full overflow-hidden" style={{ maxWidth: 420, boxShadow: "0 16px 48px rgba(0,0,0,0.18)", border: "1px solid #ebebeb" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f0f0f0" }}>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Attributes / Add Value</p>
            <h2 style={{ ...SORA, fontSize: 16, fontWeight: 800, color: "#111" }}>
              {attribute.name}
            </h2>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 bg-transparent cursor-pointer transition-all hover:bg-gray-50" style={{ color: "#888" }}>
            <CloseIcon style={{ fontSize: 17 }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-3">
          <div>
            <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
              Value <span style={{ color: "#e53935" }}>*</span>
            </p>
            <input
              autoFocus
              type="text"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(""); }}
              placeholder="e.g. 16GB DDR5, Intel Core i7…"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
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
          </div>
          {error && (
            <p className="flex items-center gap-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
              <WarningAmberOutlinedIcon style={{ fontSize: 13 }} /> {error}
            </p>
          )}
          {createValueError && !error && (
            <p className="flex items-center gap-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
              <WarningAmberOutlinedIcon style={{ fontSize: 13 }} /> {createValueError.message || String(createValueError)}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555", background: "#fff" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-70" style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#222"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#111"}
          >
            <AddOutlinedIcon style={{ fontSize: 16 }} /> {loading ? "Adding..." : "Add Value"}
          </button>
        </div>
      </div>
    </div>
  );
}
