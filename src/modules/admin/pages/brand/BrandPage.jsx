import { useState, useCallback }      from "react";
import { SORA, INTER }                from "../../../../styles/fonts";

import AddOutlinedIcon                from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon            from "@mui/icons-material/RefreshOutlined";
import StorefrontOutlinedIcon         from "@mui/icons-material/StorefrontOutlined";

import { useBrands }                  from "../../features/brands/hooks/useBrands.js";
import { useDeleteBrand }             from "../../features/brands/hooks/useDeleteBrand.js";

import BrandCard                      from "../../components/brand/BrandCard.jsx";
import BrandCreateOverlay             from "../../overlay/BrandCreateOverlay.jsx";
import DeleteConfirmModal             from "../../components/DeleteConfirmModal.jsx";


// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type = "success" }) {
  if (!message) return null;
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl"
      style={{
        ...INTER, fontSize: 13, fontWeight: 700,
        backgroundColor: type === "success" ? "#f0fdf4" : "#fef2f2",
        color:           type === "success" ? "#15803d" : "#dc2626",
        border:         `1px solid ${type === "success" ? "#bbf7d0" : "#fecaca"}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        animation: "slideUp 0.25s ease",
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: type === "success" ? "#16a34a" : "#e53935" }}
      />
      {message}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #ebebeb" }}>
      <div className="w-full animate-pulse" style={{ height: 100, backgroundColor: "#f0f0f0" }} />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 rounded-lg animate-pulse" style={{ width: "60%", backgroundColor: "#f0f0f0" }} />
        <div className="h-3 rounded-lg animate-pulse" style={{ width: "35%", backgroundColor: "#f5f5f5" }} />
        <div className="flex gap-2 mt-2">
          <div className="h-8 flex-1 rounded-xl animate-pulse" style={{ backgroundColor: "#f5f5f5" }} />
          <div className="h-8 w-8  rounded-xl animate-pulse" style={{ backgroundColor: "#f0f0f0" }} />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BRAND PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function BrandPage() {
  const { brands, loading, error, refresh } = useBrands();
  const { deleteBrand }                     = useDeleteBrand();

  // ── Overlay / modal state ─────────────────────────────────────────────────
  const [showCreate,   setShowCreate]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Toast state ───────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  // ── Derived counts ────────────────────────────────────────────────────────
  const activeCount   = brands.filter(b => b.is_active).length;
  const inactiveCount = brands.length - activeCount;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteBrand(deleteTarget.id); // throws on failure → modal catches it
    await refresh();
    showToast(`"${deleteTarget.name}" deleted successfully.`);
  };

  const handleCreated = useCallback(async () => {
    setShowCreate(false);
    await refresh();
    showToast("Brand created successfully.");
  }, [refresh]);

  const openDeleteModal = useCallback((brand) => {
    setDeleteTarget({
      id:        brand.brand_id,
      name:      brand.name,
      type:      "Brand",
      context:   "Brands",
      image_url: brand.logo_url ?? null,
    });
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ backgroundColor: "#fff", border: "1px solid #ebebeb" }}
          >
            <StorefrontOutlinedIcon style={{ fontSize: 18, color: "#555" }} />
          </div>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Products / Brands</p>
            <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
              Brand Management
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Refresh */}
          {/* <button
            onClick={refresh}
            className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer transition-all"
            style={{ backgroundColor: "#fff", border: "1px solid #e8e8e8", color: "#888" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.color = "#111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#888"; }}
          >
            <RefreshOutlinedIcon style={{ fontSize: 17 }} />
          </button> */}

          {/* Add Brand */}
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", color: "#fff", border: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}
          >
            <AddOutlinedIcon style={{ fontSize: 16 }} />
            Add Brand
          </button>
        </div>
      </div>

      {/* ── Error state ── */}
      {error && !loading && (
        <div
          className="bg-white rounded-2xl p-6 mb-5"
          style={{ border: "1px solid #fecaca", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <p style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#dc2626" }}>Failed to load brands</p>
          <p style={{ ...INTER, fontSize: 13, color: "#777", marginTop: 4 }}>{error}</p>
          <button
            onClick={refresh}
            className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all"
            style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: "#f5f5f5", color: "#555", border: "1px solid #e8e8e8" }}
          >
            <RefreshOutlinedIcon style={{ fontSize: 14 }} />
            Retry
          </button>
        </div>
      )}

      {/* ── Stats row ── */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Brands", value: brands.length,  bg: "#f5f5f5", color: "#111",    icon: <StorefrontOutlinedIcon style={{ fontSize: 20 }} /> },
            { label: "Active",       value: activeCount,    bg: "#f0fdf4", color: "#15803d", icon: <span className="w-3 h-3 rounded-full bg-green-500 block" /> },
            { label: "Inactive",     value: inactiveCount,  bg: "#fef2f2", color: "#dc2626", icon: <span className="w-3 h-3 rounded-full bg-red-500 block" /> },
          ].map(({ label, value, bg, color, icon }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-5 flex items-center gap-4"
              style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                style={{ backgroundColor: bg, color }}
              >
                {icon}
              </div>
              <div>
                <p style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {label}
                </p>
                <p style={{ ...SORA, fontSize: 22, fontWeight: 900, color: "#111" }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Card grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : brands.map((brand) => (
              <BrandCard
                key={brand.brand_id}
                brand={brand}
                onDelete={() => openDeleteModal(brand)}
              />
            ))
        }
      </div>

      {/* ── Empty state ── */}
      {!loading && !error && brands.length === 0 && (
        <div
          className="bg-white rounded-2xl flex flex-col items-center justify-center py-20 gap-4"
          style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl" style={{ backgroundColor: "#f5f5f5" }}>
            <StorefrontOutlinedIcon style={{ fontSize: 32, color: "#ccc" }} />
          </div>
          <div className="text-center">
            <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>No brands yet</p>
            <p style={{ ...INTER, fontSize: 13, color: "#bbb", marginTop: 4 }}>Add your first brand to get started.</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white cursor-pointer transition-all"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}
          >
            <AddOutlinedIcon style={{ fontSize: 18 }} />
            Add Brand
          </button>
        </div>
      )}

      {/* ── Delete modal ── */}
      <DeleteConfirmModal
        item={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        onDeleted={() => {
          setDeleteTarget(null);
          showToast(`"${deleteTarget?.name}" deleted successfully.`);
        }}
      />

      {/* ── Create overlay — unmounted when not in use ── */}
      {showCreate && (
        <BrandCreateOverlay
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {/* ── Toast ── */}
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}