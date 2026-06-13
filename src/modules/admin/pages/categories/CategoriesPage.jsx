import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../features/categories/hooks/useCategories.js";
import { useDeleteCategory } from "../../features/categories/hooks/useDeleteCategory.js";
import DeleteConfirmModal     from "../../components/DeleteConfirmModal.jsx";
import CategoryCreateOverlay  from "../../components/categories/CategoryCreateOverlay.jsx";

import { SORA, INTER }        from "../../../../styles/fonts.js";
import AddOutlinedIcon        from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon     from "@mui/icons-material/DeleteOutlined";
import CategoryOutlinedIcon   from "@mui/icons-material/CategoryOutlined";
import InventoryOutlinedIcon  from "@mui/icons-material/InventoryOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";

const TYPE_CONFIG = {
  product:   { bg: "#dbeafe", color: "#1d4ed8", label: "Product" },
  accessory: { bg: "#fef3c7", color: "#d97706", label: "Accessory" },
};

function TypeBadge({ type }) {
  const cfg = TYPE_CONFIG[type] || { bg: "#f0f0f0", color: "#888", label: type || "—" };
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full"
      style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { categories, loading, error, refresh } = useCategories();
  const { deleteCategory, loading: deleting } = useDeleteCategory();

  const [showCreate,    setShowCreate]    = useState(false);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteError,   setDeleteError]   = useState("");

  const handleCreated = () => {
    setShowCreate(false);
    refresh();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteError("");
    try {
      await deleteCategory(deleteTarget.category_id);
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      setDeleteError(err?.message || "Failed to delete category.");
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ backgroundColor: "#fff", border: "1px solid #ebebeb" }}
          >
            <CategoryOutlinedIcon style={{ fontSize: 18, color: "#555" }} />
          </div>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Catalog / Categories</p>
            <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
              Categories
            </h1>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white transition-all cursor-pointer"
          style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}
        >
          <AddOutlinedIcon style={{ fontSize: 17 }} />
          Add Category
        </button>
      </div>

      {/* ── Error banner ── */}
      {(error || deleteError) && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5"
          style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
        >
          <p style={{ ...INTER, fontSize: 12, color: "#e53935", fontWeight: 600 }}>
            {deleteError || error}
          </p>
        </div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <p style={{ ...INTER, fontSize: 13, color: "#aaa", fontWeight: 600 }}>Loading categories…</p>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && categories.length === 0 && (
        <div
          className="flex flex-col items-center justify-center gap-3 py-20 rounded-2xl"
          style={{ backgroundColor: "#fff", border: "1px solid #ebebeb" }}
        >
          <CategoryOutlinedIcon style={{ fontSize: 40, color: "#ddd" }} />
          <p style={{ ...INTER, fontSize: 13, color: "#aaa", fontWeight: 600 }}>No categories yet</p>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all cursor-pointer"
            style={{ ...SORA, fontSize: 12, fontWeight: 700, backgroundColor: "#111", border: "none" }}
          >
            <AddOutlinedIcon style={{ fontSize: 15 }} />
            Add your first category
          </button>
        </div>
      )}

      {/* ── Category grid ── */}
      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.category_id}
              className="bg-white rounded-2xl overflow-hidden flex flex-col"
              style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              {/* Image */}
              <div
                className="flex items-center justify-center w-full"
                style={{ height: 120, backgroundColor: "#f5f5f5", borderBottom: "1px solid #f0f0f0" }}
              >
                {category.img_url ? (
                  <img
                    src={category.img_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageNotSupportedOutlinedIcon style={{ fontSize: 28, color: "#ccc" }} />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2 px-4 py-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="line-clamp-2"
                    style={{ ...SORA, fontSize: 13, fontWeight: 800, color: "#111", lineHeight: 1.3 }}
                  >
                    {category.name}
                  </h3>
                  <TypeBadge type={category.category_type} />
                </div>

                <div className="flex items-center gap-1.5 mt-auto">
                  <LocalOfferOutlinedIcon style={{ fontSize: 13, color: "#bbb" }} />
                  <span style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
                    {category.slug}
                  </span>
                </div>
              </div>

              {/* Footer actions */}
              <div
                className="flex items-center justify-end px-4 py-2.5"
                style={{ borderTop: "1px solid #f0f0f0" }}
              >
                <button
                  onClick={() => setDeleteTarget(category)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all cursor-pointer"
                  style={{ backgroundColor: "#fff", borderColor: "#ebebeb", color: "#bbb" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e53935"; e.currentTarget.style.color = "#e53935"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ebebeb"; e.currentTarget.style.color = "#bbb"; }}
                >
                  <DeleteOutlinedIcon style={{ fontSize: 16 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create overlay ── */}
      <CategoryCreateOverlay
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />

      {/* ── Delete confirm modal ── */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}