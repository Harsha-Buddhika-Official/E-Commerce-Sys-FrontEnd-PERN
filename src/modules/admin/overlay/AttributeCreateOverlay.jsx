import { useState } from "react";
import AddOutlinedIcon           from "@mui/icons-material/AddOutlined";
import CloseIcon                 from "@mui/icons-material/Close";
import WarningAmberOutlinedIcon  from "@mui/icons-material/WarningAmberOutlined";
import { useCreateAttributes }   from "../features/attributes/hooks/useCreateAttributes";

import { SORA, INTER } from "../../../styles/fonts";

const AttributeCreateOverlay = ({ categories, defaultCategoryId, onClose, onCreated }) => {
  const { loading, error, createAttribute } = useCreateAttributes();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategoryId ? String(defaultCategoryId) : "");
  const [localError, setLocalError] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      setLocalError("Attribute name is required.");
      return;
    }

    if (!categoryId) {
      setLocalError("Please select a category.");
      return;
    }

    try {
      setLocalError("");
      const createdAttribute = await createAttribute({
        name: name.trim(),
        category_id: Number(categoryId),
      });

      onCreated?.(createdAttribute);
      onClose?.();
    } catch {
      // The hook already exposes the API error; keep the overlay open.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">

      {/* Backdrop — softly blurred page behind */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
        onClick={onClose}
      />

      <div
        className="bg-white w-full overflow-hidden relative rounded-t-2xl sm:rounded-2xl"
        style={{ maxWidth: 500, maxHeight: "90vh", boxShadow: "0 24px 64px rgba(0,0,0,0.22)", animation: "popIn 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        <style>{`\n          @keyframes popIn {\n            from { transform: scale(0.92); opacity: 0; }\n            to   { transform: scale(1);    opacity: 1; }\n          }\n        `}</style>

        <div className="flex items-center justify-between px-4 sm:px-6 py-4" style={{ borderBottom: "1px solid #f0f0f0" }}>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Attributes / Create</p>
            <h2 style={{ ...SORA, fontSize: 16, fontWeight: 800, color: "#111" }}>New Attribute</h2>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 bg-transparent cursor-pointer transition-all hover:bg-gray-50 shrink-0" style={{ color: "#888" }}>
            <CloseIcon style={{ fontSize: 17 }} />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-5 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: "60vh" }}>
          <div>
            <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
              Attribute Name <span style={{ color: "#e53935" }}>*</span>
            </p>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setLocalError(""); }}
              placeholder="e.g. Processor, RAM, Color…"
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

          <div>
            <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
              Category <span style={{ color: "#e53935" }}>*</span>
            </p>
            <select
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setLocalError(""); }}
              className="w-full appearance-none outline-none cursor-pointer transition-all"
              style={{
                ...INTER, fontSize: 13, fontWeight: 600,
                color: categoryId ? "#111" : "#bbb",
                padding: "10px 14px",
                borderRadius: 12,
                border: "1.5px solid #ebebeb",
                backgroundColor: "#f9f9f9",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
            >
              <option value="" disabled>Select a category…</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>{c.name}</option>
              ))}
            </select>
          </div>

          {localError && (
            <p className="flex items-center gap-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
              <WarningAmberOutlinedIcon style={{ fontSize: 13 }} /> {localError}
            </p>
          )}
          {error && !localError && (
            <p className="flex items-center gap-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
              <WarningAmberOutlinedIcon style={{ fontSize: 13 }} /> {error.message || String(error)}
            </p>
          )}
        </div>

        <div className="flex gap-3 px-4 sm:px-6 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555", background: "#fff" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-70" style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}>
            <AddOutlinedIcon style={{ fontSize: 16 }} /> {loading ? "Creating..." : "Create Attribute"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttributeCreateOverlay;