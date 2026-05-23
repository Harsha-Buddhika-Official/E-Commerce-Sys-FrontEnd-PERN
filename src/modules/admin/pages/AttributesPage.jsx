import { useEffect, useMemo, useState } from "react";
import AddOutlinedIcon           from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon                 from "@mui/icons-material/CloseOutlined";
import SearchOutlinedIcon        from "@mui/icons-material/SearchOutlined";
import WarningAmberOutlinedIcon  from "@mui/icons-material/WarningAmberOutlined";
import TagOutlinedIcon           from "@mui/icons-material/TagOutlined";
import TuneOutlinedIcon          from "@mui/icons-material/TuneOutlined";
import { useAttributesCatalog }  from "../features/attributes/hooks/useAttributesCatalog";
import { useCreateAttributes } from "../features/attributes/hooks/useCreateAttributes";
import { useDeleteAttributes } from "../features/attributes/hooks/useDeleteAttributes"

// ─── Font constants ───────────────────────────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ──────────────────────────────────────────────────────────────────────────────
// Delete Modal
// ──────────────────────────────────────────────────────────────────────────────
function DeleteModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-7 flex flex-col gap-4 w-full" style={{ maxWidth: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 flex-shrink-0">
            <WarningAmberOutlinedIcon style={{ fontSize: 20, color: "#e53935" }} />
          </div>
          <h3 style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Confirm Delete</h3>
        </div>
        <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555", background: "#fff" }}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-white cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 700, background: "#e53935", border: "none" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#c62828"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e53935"}
          >Delete</button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Create Attribute Modal
// ──────────────────────────────────────────────────────────────────────────────
function CreateAttributeModal({ categories, defaultCategoryId, onSave, onClose, isSaving, saveError }) {
  const [name,       setName]       = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategoryId ? String(defaultCategoryId) : "");
  const [error,      setError]      = useState("");
  const [focused,    setFocused]    = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { setError("Attribute name is required."); return; }
    if (!categoryId)  { setError("Please select a category."); return; }
    await onSave({ name: name.trim(), category_id: Number(categoryId) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full overflow-hidden" style={{ maxWidth: 440, boxShadow: "0 16px 48px rgba(0,0,0,0.18)", border: "1px solid #ebebeb" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f0f0f0" }}>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Attributes / Create</p>
            <h2 style={{ ...SORA, fontSize: 16, fontWeight: 800, color: "#111" }}>New Attribute</h2>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 bg-transparent cursor-pointer transition-all hover:bg-gray-50" style={{ color: "#888" }}>
            <CloseIcon style={{ fontSize: 17 }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Name */}
          <div>
            <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
              Attribute Name <span style={{ color: "#e53935" }}>*</span>
            </p>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
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

          {/* Category */}
          <div>
            <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
              Category <span style={{ color: "#e53935" }}>*</span>
            </p>
            <select
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setError(""); }}
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
              onBlur={(e)  => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
            >
              <option value="" disabled>Select a category…</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>{c.name}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="flex items-center gap-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
              <WarningAmberOutlinedIcon style={{ fontSize: 13 }} /> {error}
            </p>
          )}
          {saveError && !error && (
            <p className="flex items-center gap-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
              <WarningAmberOutlinedIcon style={{ fontSize: 13 }} /> {saveError.message || String(saveError)}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555", background: "#fff" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={isSaving} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-70" style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#222"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#111"}
          >
            <AddOutlinedIcon style={{ fontSize: 16 }} /> {isSaving ? "Creating..." : "Create Attribute"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Create Value Modal
// ──────────────────────────────────────────────────────────────────────────────
function CreateValueModal({ attribute, onSave, onClose }) {
  const [value,   setValue]   = useState("");
  const [error,   setError]   = useState("");
  const [focused, setFocused] = useState(false);

  const handleSave = () => {
    if (!value.trim()) { setError("Value is required."); return; }
    onSave({ attribute_id: attribute.attribute_id, value: value.trim(), slug: slugify(value.trim()) });
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
            {value && (
              <div className="flex items-center gap-2 mt-2">
                <span style={{ ...INTER, fontSize: 11, color: "#bbb" }}>Slug:</span>
                <span className="px-2 py-0.5 rounded-md" style={{ ...INTER, fontSize: 11, color: "#555", fontFamily: "'Courier New', monospace", backgroundColor: "#f5f5f5" }}>
                  {slugify(value)}
                </span>
              </div>
            )}
          </div>
          {error && (
            <p className="flex items-center gap-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
              <WarningAmberOutlinedIcon style={{ fontSize: 13 }} /> {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555", background: "#fff" }}>
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white cursor-pointer transition-all" style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#222"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#111"}
          >
            <AddOutlinedIcon style={{ fontSize: 16 }} /> Add Value
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Attribute Card
// ──────────────────────────────────────────────────────────────────────────────
function AttributeCard({ attribute, onDeleteAttribute, onAddValue, onDeleteValue }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f5f5f5" }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ backgroundColor: "#111" }}>
            <TagOutlinedIcon style={{ fontSize: 16, color: "#fff" }} />
          </div>
          <div className="min-w-0">
            <p style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111" }}>{attribute.name}</p>
            <p style={{ ...INTER, fontSize: 11, color: "#bbb" }}>
              {attribute.values.length} value{attribute.values.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onAddValue(attribute)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all"
            style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: "#f5f5f5", color: "#111", border: "1px solid #ebebeb" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ebebeb"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
          >
            <AddOutlinedIcon style={{ fontSize: 13 }} /> Value
          </button>
          <button
            onClick={() => onDeleteAttribute(attribute)}
            className="flex items-center justify-center w-8 h-8 rounded-xl cursor-pointer transition-all"
            style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#e53935" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fef2f2"}
          >
            <DeleteOutlineOutlinedIcon style={{ fontSize: 15 }} />
          </button>
        </div>
      </div>

      {/* Values */}
      <div className="px-5 py-4 flex-1">
        {attribute.values.length === 0 ? (
          <button
            onClick={() => onAddValue(attribute)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl cursor-pointer transition-all"
            style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#bbb", border: "1.5px dashed #e5e5e5", backgroundColor: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.color = "#111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.color = "#bbb"; }}
          >
            <AddOutlinedIcon style={{ fontSize: 15 }} /> Add first value
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            {attribute.values.map((val) => (
              <div
                key={val.attribute_value_id}
                className="group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full transition-all"
                style={{ backgroundColor: "#f5f5f5", border: "1px solid #ebebeb" }}
              >
                <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#333" }}>
                  {val.value}
                </span>
                <button
                  onClick={() => onDeleteValue(attribute, val)}
                  className="flex items-center justify-center w-4 h-4 rounded-full cursor-pointer border-none transition-all flex-shrink-0"
                  style={{ backgroundColor: "transparent", color: "#ccc" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fee2e2"; e.currentTarget.style.color = "#e53935"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#ccc"; }}
                >
                  <CloseIcon style={{ fontSize: 11 }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Category Filter Chip
// ──────────────────────────────────────────────────────────────────────────────
function CategoryChip({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border flex-shrink-0 cursor-pointer transition-all"
      style={{
        ...INTER,
        fontSize: 12,
        fontWeight: 700,
        backgroundColor: active ? "#111" : "#fff",
        color:           active ? "#fff" : "#555",
        borderColor:     active ? "#111" : "#e5e5e5",
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "#aaa"; e.currentTarget.style.backgroundColor = "#f9f9f9"; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.backgroundColor = "#fff"; } }}
    >
      {label}
      <span
        className="flex items-center justify-center min-w-[20px] h-5 rounded-full px-1"
        style={{
          fontSize: 10,
          fontWeight: 800,
          backgroundColor: active ? "rgba(255,255,255,0.2)" : "#f0f0f0",
          color:           active ? "#fff" : "#888",
        }}
      >
        {count}
      </span>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ATTRIBUTES PAGE
// ══════════════════════════════════════════════════════════════════════════════
const AttributesPage = () => {
  const { categories: apiCategories, attributes: apiAttributes, loading: catalogLoading, error: catalogError, refresh, } = useAttributesCatalog();
  const { loading: createLoading, error: createError, createAttribute, } = useCreateAttributes();
  const { loading: deleteLoading, error: deleteError, deleteAttribute, } = useDeleteAttributes()

  const [attributes, setAttributes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [activeCategory,    setActiveCategory]    = useState(null);
  const [search,            setSearch]            = useState("");
  const [showCreateAttr,    setShowCreateAttr]    = useState(false);
  const [createValueFor,    setCreateValueFor]    = useState(null);
  const [deleteAttrTarget,  setDeleteAttrTarget]  = useState(null);
  const [deleteValTarget,   setDeleteValTarget]   = useState(null);

  useEffect(() => {
    setCategories(apiCategories);
    setAttributes(apiAttributes);
  }, [apiCategories, apiAttributes]);

  // ── Category stats ────────────────────────────────────────────────────────
  const catStats = useMemo(() => {
    const map = {};
    attributes.forEach((a) => {
      if (!map[a.category_id]) map[a.category_id] = { count: 0, values: 0 };
      map[a.category_id].count  += 1;
      map[a.category_id].values += a.values.length;
    });
    return map;
  }, [attributes]);

  const totalAttrs  = attributes.length;
  const totalValues = attributes.reduce((s, a) => s + a.values.length, 0);

  // ── Filtered attributes ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return attributes.filter((a) => {
      const matchCat    = activeCategory === null || a.category_id === activeCategory;
      const q           = search.toLowerCase();
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.values.some((v) => v.value.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [attributes, activeCategory, search]);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const handleCreateAttribute = async ({ name, category_id }) => {
    await createAttribute({ name, category_id });
    await refresh();
    setShowCreateAttr(false);
  };

  const handleDeleteAttribute = async (attr) => {
    await deleteAttribute(attr.attribute_id);
    await refresh();
    setDeleteAttrTarget(null);
  };

  const handleCreateValue = ({ attribute_id, value, slug }) => {
    setAttributes((prev) =>
      prev.map((a) =>
        a.attribute_id === attribute_id
          ? { ...a, values: [...a.values, { attribute_value_id: Date.now(), value, slug }] }
          : a
      )
    );
    setCreateValueFor(null);
  };

  const handleDeleteValue = (attribute, val) => {
    setAttributes((prev) =>
      prev.map((a) =>
        a.attribute_id === attribute.attribute_id
          ? { ...a, values: a.values.filter((v) => v.attribute_value_id !== val.attribute_value_id) }
          : a
      )
    );
    setDeleteValTarget(null);
  };

  const activeCatName = activeCategory
    ? categories.find((c) => c.category_id === activeCategory)?.name
    : "All";

  if (catalogLoading && categories.length === 0 && attributes.length === 0) {
    return (
      <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl px-6 py-5" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Loading attributes catalog…</p>
          <p style={{ ...INTER, fontSize: 13, color: "#777", marginTop: 4 }}>Fetching categories and attribute definitions from the API.</p>
        </div>
      </div>
    );
  }

  if (catalogError && categories.length === 0 && attributes.length === 0) {
    return (
      <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl px-6 py-5 max-w-md w-full" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Failed to load attributes</p>
          <p style={{ ...INTER, fontSize: 13, color: "#777", marginTop: 4 }}>{catalogError.message || String(catalogError)}</p>
          <button
            onClick={refresh}
            className="mt-4 flex items-center justify-center px-4 py-2.5 rounded-xl text-white cursor-pointer transition-all"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#222"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#111"}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* ── Modals ── */}
      {showCreateAttr && (
        <CreateAttributeModal
          categories={categories}
          defaultCategoryId={activeCategory}
          onSave={handleCreateAttribute}
          onClose={() => setShowCreateAttr(false)}
          isSaving={createLoading}
          saveError={createError}
        />
      )}
      {createValueFor && (
        <CreateValueModal
          attribute={createValueFor}
          onSave={handleCreateValue}
          onClose={() => setCreateValueFor(null)}
        />
      )}
      {deleteAttrTarget && (
        <DeleteModal
          message={<>Delete <strong>"{deleteAttrTarget.name}"</strong>? All values and product links will be permanently removed.</>}
          onConfirm={() => handleDeleteAttribute(deleteAttrTarget)}
          onCancel={() => setDeleteAttrTarget(null)}
        />
      )}
      {deleteValTarget && (
        <DeleteModal
          message={<>Remove value <strong>"{deleteValTarget.value.value}"</strong> from <strong>{deleteValTarget.attribute.name}</strong>? Products using this value may be affected.</>}
          onConfirm={() => handleDeleteValue(deleteValTarget.attribute, deleteValTarget.value)}
          onCancel={() => setDeleteValTarget(null)}
        />
      )}

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Products / Attributes</p>
          <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
            Attributes
          </h1>
        </div>
        <button
          onClick={() => setShowCreateAttr(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all cursor-pointer"
          style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#222"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#111"}
        >
          <AddOutlinedIcon style={{ fontSize: 18 }} /> Add Attribute
        </button>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: "Total Attributes", value: totalAttrs,  icon: <TuneOutlinedIcon style={{ fontSize: 20 }} />,      bg: "#f5f5f5", color: "#111"    },
          { label: "Total Values",     value: totalValues, icon: <TagOutlinedIcon style={{ fontSize: 20 }} />,        bg: "#dbeafe", color: "#1d4ed8" },
          { label: "Categories",       value: categories.length,
                                                           icon: <TuneOutlinedIcon style={{ fontSize: 20 }} />,       bg: "#f3e8ff", color: "#7e22ce" },
        ].map(({ label, value, icon, bg, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-5 flex items-center gap-4"
            style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0" style={{ backgroundColor: bg, color }}>
              {icon}
            </div>
            <div>
              <p style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
              <p style={{ ...SORA, fontSize: 22, fontWeight: 900, color: "#111" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter + search bar ── */}
      <div
        className="bg-white rounded-2xl p-4 mb-5 flex flex-col gap-3"
        style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
      >
        {/* Search */}
        <div className="relative flex items-center">
          <SearchOutlinedIcon style={{ position: "absolute", left: 14, fontSize: 17, color: "#bbb" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search attributes or values…"
            className="w-full outline-none transition-all"
            style={{
              ...INTER, fontSize: 13, fontWeight: 600, color: "#111",
              padding: "10px 38px",
              borderRadius: 12,
              border: "1.5px solid #ebebeb",
              backgroundColor: "#f9f9f9",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
            onBlur={(e)  => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 flex items-center justify-center w-5 h-5 rounded-md cursor-pointer border-none bg-transparent"
              style={{ color: "#bbb" }}
            >
              <CloseIcon style={{ fontSize: 14 }} />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <CategoryChip
            label="All"
            count={totalAttrs}
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {categories.map((cat) => {
            const s = catStats[cat.category_id] || { count: 0 };
            return (
              <CategoryChip
                key={cat.category_id}
                label={cat.name}
                count={s.count}
                active={activeCategory === cat.category_id}
                onClick={() => setActiveCategory(cat.category_id)}
              />
            );
          })}
        </div>
      </div>

      {/* ── Results header ── */}
      <div className="flex items-center justify-between mb-4">
        <p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}>
          <span style={{ color: "#111", fontWeight: 800 }}>{activeCatName}</span>
          {" — "}
          {filtered.length} attribute{filtered.length !== 1 ? "s" : ""}
          {search && <span> matching "<em>{search}</em>"</span>}
        </p>
        {(search || activeCategory !== null) && (
          <button
            onClick={() => { setSearch(""); setActiveCategory(null); }}
            className="flex items-center gap-1.5 cursor-pointer border-none bg-transparent"
            style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#e53935" }}
          >
            <CloseIcon style={{ fontSize: 13 }} /> Clear filters
          </button>
        )}
      </div>

      {/* ── Attribute cards grid ── */}
      {filtered.length > 0 ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {filtered.map((attr) => (
            <AttributeCard
              key={attr.attribute_id}
              attribute={attr}
              onDeleteAttribute={(a) => setDeleteAttrTarget(a)}
              onAddValue={(a) => setCreateValueFor(a)}
              onDeleteValue={(a, v) => setDeleteValTarget({ attribute: a, value: v })}
            />
          ))}
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl flex flex-col items-center justify-center py-20 gap-4"
          style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl" style={{ backgroundColor: "#f5f5f5" }}>
            <TagOutlinedIcon style={{ fontSize: 32, color: "#ccc" }} />
          </div>
          <div className="text-center">
            <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>No attributes found</p>
            <p style={{ ...INTER, fontSize: 13, color: "#bbb", marginTop: 4 }}>
              {search ? `No results for "${search}"` : "Add your first attribute to get started"}
            </p>
          </div>
          <button
            onClick={() => setShowCreateAttr(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white cursor-pointer transition-all"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#222"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#111"}
          >
            <AddOutlinedIcon style={{ fontSize: 18 }} /> Add Attribute
          </button>
        </div>
      )}
    </div>
  );
};

export default AttributesPage;