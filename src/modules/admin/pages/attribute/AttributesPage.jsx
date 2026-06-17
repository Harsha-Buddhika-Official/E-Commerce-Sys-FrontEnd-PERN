import { useEffect, useMemo, useState } from "react";
import AddOutlinedIcon           from "@mui/icons-material/AddOutlined";
import CloseIcon                 from "@mui/icons-material/CloseOutlined";
import SearchOutlinedIcon        from "@mui/icons-material/SearchOutlined";
import TagOutlinedIcon           from "@mui/icons-material/TagOutlined";
import TuneOutlinedIcon          from "@mui/icons-material/TuneOutlined";


import AttributeCreateOverlay    from "../../overlay/AttributeCreateOverlay";
import DeleteModal from "../../components/attributes/DeleteModal";
import CreateAttributeValueOverlay from "../../overlay/CreateAttributeValueOverlay";
import AttributeCard from "../../components/attributes/AttributeCard";
import CategoryChip from "../../components/attributes/CategoryChip";

import { useAttributesCatalog }  from "../../features/attributes/hooks/useAttributesCatalog";
import { useDeleteAttributes } from "../../features/attributes/hooks/useDeleteAttributes"
import { useDeleteValue } from "../../features/attributes/hooks/useDeleteValue";
import { SORA, INTER } from "../../../../styles/fonts";

// ══════════════════════════════════════════════════════════════════════════════
// ATTRIBUTES PAGE
// ══════════════════════════════════════════════════════════════════════════════
const AttributesPage = () => {
  const { categories: apiCategories, attributes: apiAttributes, loading: catalogLoading, error: catalogError, refresh, } = useAttributesCatalog();
  const { loading: deleteLoading, error: deleteError, deleteAttribute, } = useDeleteAttributes();
  const { loading: deleteValueLoading, error: deleteValueError, deleteValue, } = useDeleteValue();

  const [attributes, setAttributes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [activeCategory,    setActiveCategory]    = useState(null);
  const [search,            setSearch]            = useState("");
  const [showCreateAttr,    setShowCreateAttr]    = useState(false);
  const [createValueFor,    setCreateValueFor]    = useState(null);
  const [deleteAttrTarget,  setDeleteAttrTarget]  = useState(null);
  const [deleteValTarget,   setDeleteValTarget]   = useState(null);
  const [deleteModalError,  setDeleteModalError]  = useState("");
  const [deleteValueModalError, setDeleteValueModalError] = useState("");

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

  // Filtered attributes 
  const filtered = useMemo(() => {
    return attributes.filter((a) => {
      const matchCat    = activeCategory === null || a.category_id === activeCategory;
      const q           = search.toLowerCase();
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.values.some((v) => v.value.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [attributes, activeCategory, search]);

  const handleCreateAttribute = (newAttribute) => {
    setAttributes((prev) => [
      ...prev,
      { ...newAttribute, values: newAttribute.values ?? [] },
    ]);
    setShowCreateAttr(false);
  };
  
  const handleDeleteAttribute = async (attr) => {
    try {
      setDeleteModalError("");
      const { id } = await deleteAttribute(attr.attribute_id);
      setAttributes((prev) => prev.filter((a) => a.attribute_id !== id));
      setDeleteAttrTarget(null);
    } catch (err) {
      setDeleteModalError(err?.message || "Failed to delete attribute.");
    }
  };

  const handleCreateValue = (savedValue) => {
    // savedValue should include attribute_id and attribute_value_id from server
    const attributeId = savedValue?.attribute_id ?? savedValue?.attributeId ?? null;
    const valueObj = {
      attribute_value_id: savedValue.attribute_value_id ?? savedValue.id ?? Date.now(),
      value: savedValue.value ?? "",
      slug: savedValue.slug ?? null,
    };

    if (!attributeId) {
      // fallback: close overlay and refresh full catalog
      setCreateValueFor(null);
      refresh();
      return;
    }

    setAttributes((prev) =>
      prev.map((a) =>
        a.attribute_id === attributeId
          ? { ...a, values: [...a.values, valueObj] }
          : a
      )
    );

    setCreateValueFor(null);
  };

  const handleDeleteValue = async (attribute, val) => {
    try {
      setDeleteValueModalError("");
      await deleteValue(attribute.attribute_id, val.attribute_value_id);
      setAttributes((prev) =>
        prev.map((a) =>
          a.attribute_id === attribute.attribute_id
            ? { ...a, values: a.values.filter((v) => v.attribute_value_id !== val.attribute_value_id) }
            : a
        )
      );
      setDeleteValTarget(null);
    } catch (err) {
      setDeleteValueModalError(err?.message || "Failed to delete attribute value.");
    }
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
        <AttributeCreateOverlay
          categories={categories}
          defaultCategoryId={activeCategory}
          onCreated={handleCreateAttribute}
          onClose={() => setShowCreateAttr(false)}
        />
      )}
      {createValueFor && (
        <CreateAttributeValueOverlay
          attribute={createValueFor}
          onSave={(payload) => {
            handleCreateValue(payload);
            setCreateValueFor(null);
          }}
          onClose={() => setCreateValueFor(null)}
        />
      )}
      {deleteAttrTarget && (
        <DeleteModal
          message={<>Delete <strong>"{deleteAttrTarget.name}"</strong>? All values and product links will be permanently removed.</>}
          onConfirm={() => handleDeleteAttribute(deleteAttrTarget)}
          onCancel={() => { setDeleteModalError(""); setDeleteAttrTarget(null); }}
          isDeleting={deleteLoading}
          errorMessage={deleteModalError || (deleteError ? String(deleteError) : "")}
        />
      )}
      {deleteValTarget && (
        <DeleteModal
          message={<>Remove value <strong>"{deleteValTarget.value.value}"</strong> from <strong>{deleteValTarget.attribute.name}</strong>? Products using this value may be affected.</>}
          onConfirm={() => handleDeleteValue(deleteValTarget.attribute, deleteValTarget.value)}
          onCancel={() => { setDeleteValueModalError(""); setDeleteValTarget(null); }}
          isDeleting={deleteValueLoading}
          errorMessage={deleteValueModalError || (deleteValueError ? String(deleteValueError) : "")}
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
            <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0" style={{ backgroundColor: bg, color }}>
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