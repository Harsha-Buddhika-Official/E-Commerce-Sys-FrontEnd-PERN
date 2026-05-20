import { useState } from "react";
import AddOutlinedIcon           from "@mui/icons-material/AddOutlined";
import SearchOutlinedIcon        from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon    from "@mui/icons-material/FilterListOutlined";
import LocalOfferOutlinedIcon    from "@mui/icons-material/LocalOfferOutlined";
import WarningAmberOutlinedIcon  from "@mui/icons-material/WarningAmberOutlined";
import CloseIcon                 from "@mui/icons-material/Close";
import PromotionCard             from "../components/promotion/PromotionCard";
import PromotionFormModal        from "../components/promotion/PromotionFormModel";
import PromotionDetailPage       from "./PromotinDetailPage";
import { useOffers }             from "../features/offers/hooks/useOffers";
import { useCreateOffer }        from "../features/offers/hooks/useCreateOffer";
import { useOfferProducts }      from "../features/offers/hooks/useOfferProducts";
import { useUpdateOffer }        from "../features/offers/hooks/useUpdateOffer";
import { useDeleteOffer }        from "../features/offers/hooks/useDeleteOffer";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const STATUS_FILTERS = ["All", "Active", "Scheduled", "Expired", "Inactive"];

const getStatus = (start, end, isActive) => {
  if (!isActive) return "Inactive";
  const now = new Date(), s = new Date(start), e = new Date(end);
  if (now < s) return "Scheduled";
  if (now > e) return "Expired";
  return "Active";
};

// ─── Delete confirm modal ─────────────────────────────────────────────────────
function DeleteModal({ offer, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-7 flex flex-col gap-4 w-full" style={{ maxWidth: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 flex-shrink-0">
            <WarningAmberOutlinedIcon style={{ fontSize: 20, color: "#e53935" }} />
          </div>
          <h3 style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Delete Promotion</h3>
        </div>
        <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
          Delete <strong>"{offer?.title}"</strong>? All linked products will be removed from this offer. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555", background: "#fff" }}>Cancel</button>
          <button onClick={() => onConfirm(offer)} className="flex-1 py-2.5 rounded-xl text-white hover:bg-red-600 cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 700, background: "#e53935", border: "none" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatChip({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 flex flex-col gap-1" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <span style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      <span style={{ ...SORA, fontSize: 26, fontWeight: 900, color: color || "#111", letterSpacing: "-0.5px" }}>{value}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROMOTIONS PAGE
// ══════════════════════════════════════════════════════════════════════════════
const PromotionsPage = () => {
  // Hooks
  const { offers, loading, error: offersError, refresh } = useOffers();
  const { creating, error: createError, createOffer } = useCreateOffer();
  const { attaching, error: attachError, attachProduct } = useOfferProducts();
  const { updating, error: updateError, updateOffer } = useUpdateOffer();
  const { deleting, error: deleteError, deleteOffer } = useDeleteOffer();

  // Filters
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals / navigation
  const [showForm,     setShowForm]     = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);   // offer being edited
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget,   setViewTarget]   = useState(null);   // offer being viewed (detail page)

  // ── Filter logic ──────────────────────────────────────────────────────────
  const filtered = offers.filter((o) => {
    const q          = search.toLowerCase();
    const matchSearch = !q || o.title.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q);
    const status      = getStatus(o.start_date, o.end_date, o.is_active);
    const matchStatus = statusFilter === "All" || status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = {
    total:     offers.length,
    active:    offers.filter(o => getStatus(o.start_date, o.end_date, o.is_active) === "Active").length,
    scheduled: offers.filter(o => getStatus(o.start_date, o.end_date, o.is_active) === "Scheduled").length,
    expired:   offers.filter(o => getStatus(o.start_date, o.end_date, o.is_active) === "Expired").length,
  };

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleCreate = async (payload) => {
    try {
      const created = await createOffer(payload);

      // If the form selected a single product, attach it to the created offer
      if (payload?.product_id && created?.id) {
        try {
          await attachProduct(created.id, payload.product_id);
        } catch (err) {
          // Attachment failed — log and continue so the offer still appears
          console.error("Failed to attach product to offer:", err);
          window.alert(err?.message || "Offer created but failed to attach product.");
        }
      }

      setShowForm(false);
      refresh();
    } catch (err) {
      window.alert(err?.message || "Failed to create offer");
    }
  };

  const handleEdit = async (payload) => {
    try {
      await updateOffer(payload.id, payload);
      setEditTarget(null);
      refresh();
    } catch (err) {
      window.alert(err?.message || "Failed to update offer");
    }
  };

  const handleDelete = async (offer) => {
    try {
      await deleteOffer(offer.id);
      setDeleteTarget(null);
      if (viewTarget?.id === offer.id) setViewTarget(null);
      refresh();
    } catch (err) {
      window.alert(err?.message || "Failed to delete offer");
    }
  };

  const handleToggle = async (offer, newIsActive) => {
    try {
      await updateOffer(offer.id, { is_active: newIsActive });
      refresh();
    } catch (err) {
      window.alert(err?.message || "Failed to toggle offer status");
    }
  };

  // ── Detail page view ──────────────────────────────────────────────────────
  if (viewTarget) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#f5f5f5]">
        <div className="flex flex-1 overflow-hidden">
          <PromotionDetailPage
            offer={offers.find((o) => o.id === viewTarget.id) || viewTarget}
            onBack={() => setViewTarget(null)}
            onEdit={(o) => { setEditTarget(o); setViewTarget(null); }}
            onDelete={(o) => { setDeleteTarget(o); setViewTarget(null); }}
            onToggle={handleToggle}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f5f5f5]">

      {/* Modals */}
      {showForm && (
        <PromotionFormModal mode="create" onSave={handleCreate} onClose={() => setShowForm(false)} />
      )}
      {editTarget && (
        <PromotionFormModal mode="edit" offer={editTarget} onSave={handleEdit} onClose={() => setEditTarget(null)} />
      )}
      {deleteTarget && (
        <DeleteModal offer={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-5 lg:p-6 min-w-0">

          {/* ── Page header ── */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 style={{ ...SORA, fontSize: 22, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Promotions</h1>
              <p style={{ ...INTER, fontSize: 12, color: "#aaa" }}>Manage all your offers and discount campaigns</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 cursor-pointer"
              style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#1a73e8", border: "none" }}
            >
              <AddOutlinedIcon style={{ fontSize: 18 }} />
              New Promotion
            </button>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatChip label="Total"     value={stats.total}     color="#111"     />
            <StatChip label="Active"    value={stats.active}    color="#16a34a"  />
            <StatChip label="Scheduled" value={stats.scheduled} color="#1d4ed8"  />
            <StatChip label="Expired"   value={stats.expired}   color="#dc2626"  />
          </div>

          {/* ── Toolbar ── */}
          <div className="flex items-center gap-3 flex-wrap mb-5">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 rounded-xl border border-gray-200 bg-white transition-all focus-within:border-[#1a73e8]" style={{ height: 40, minWidth: 220, maxWidth: 300 }}>
              <SearchOutlinedIcon style={{ fontSize: 17, color: "#bbb", flexShrink: 0 }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search promotions…"
                className="flex-1 bg-transparent outline-none border-none text-[#111] placeholder-gray-300 min-w-0"
                style={{ ...INTER, fontSize: 13 }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="bg-transparent border-none cursor-pointer text-gray-300 hover:text-gray-600 transition-colors">
                  <CloseIcon style={{ fontSize: 15 }} />
                </button>
              )}
            </div>

            {/* Status filter pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <FilterListOutlinedIcon style={{ fontSize: 17, color: "#bbb" }} />
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className="px-3 py-1.5 rounded-full border text-[12px] font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer"
                  style={{ ...INTER, backgroundColor: statusFilter === f ? "#111" : "#fff", borderColor: statusFilter === f ? "#111" : "#e5e7eb", color: statusFilter === f ? "#fff" : "#555" }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="mb-4" style={{ ...INTER, fontSize: 12, color: "#aaa" }}>
            {filtered.length} promotion{filtered.length !== 1 ? "s" : ""}
            {statusFilter !== "All" ? ` · ${statusFilter}` : ""}
          </p>

          {/* ── Promotions grid ── */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <LocalOfferOutlinedIcon style={{ fontSize: 52, color: "#ddd" }} />
              <p style={{ ...INTER, fontSize: 14, color: "#bbb" }}>No promotions found.</p>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 700, backgroundColor: "#1a73e8", border: "none" }}>
                <AddOutlinedIcon style={{ fontSize: 16 }} /> Create your first promotion
              </button>
            </div>
          ) : (
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {filtered.map((offer) => (
                <PromotionCard
                  key={offer.id}
                  offer={offer}
                  onView={(o)   => setViewTarget(o)}
                  onEdit={(o)   => setEditTarget(o)}
                  onDelete={(o) => setDeleteTarget(o)}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PromotionsPage;