// import { useCallback, useState }          from "react";
// import { useNavigate }                    from "react-router-dom";
// import { SORA, INTER }                    from "../../../../styles/fonts";

// import AddOutlinedIcon                    from "@mui/icons-material/AddOutlined";
// import RefreshOutlinedIcon                from "@mui/icons-material/RefreshOutlined";
// import ViewModuleOutlinedIcon             from "@mui/icons-material/ViewModuleOutlined";

// import { useBanners }                     from "../../features/banners/hooks/useBanners.js";
// import { useDeleteBanner }                from "../../features/banners/hooks/useDeleteBanner.js";

// import BannerCreateOverlay                from "../../overlay/BannerCreateOverlay.jsx";
// // import BannerEditOverlay                  from "../../overlay/BannerEditOverlay.jsx";
// import BannerCard                         from "../../components/banners/BannerCard.jsx";
// // import DeleteBannerModal                  from "../../components/banners/DeleteBannerModal.jsx";
// import DeleteConfirmModal             from "../../components/DeleteConfirmModal.jsx";


// // ─── Toast ────────────────────────────────────────────────────────────────────
// function Toast({ message, type = "success" }) {
//   if (!message) return null;
//   return (
//     <div
//       className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl"
//       style={{
//         ...INTER, fontSize: 13, fontWeight: 700,
//         backgroundColor: type === "success" ? "#f0fdf4" : "#fef2f2",
//         color:           type === "success" ? "#15803d" : "#dc2626",
//         border:         `1px solid ${type === "success" ? "#bbf7d0" : "#fecaca"}`,
//         boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//         animation: "slideUp 0.25s ease",
//       }}
//     >
//       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: type === "success" ? "#16a34a" : "#e53935" }} />
//       {message}
//       <style>{`@keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
//     </div>
//   );
// }

// // ── Skeleton card ─────────────────────────────────────────────────────────────
// function SkeletonCard() {
//   return (
//     <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #ebebeb" }}>
//       <div className="w-full animate-pulse" style={{ height: 180, backgroundColor: "#f0f0f0" }} />
//       <div className="p-5 flex flex-col gap-3">
//         <div className="h-4 rounded-lg animate-pulse" style={{ width: "70%", backgroundColor: "#f0f0f0" }} />
//         <div className="h-3 rounded-lg animate-pulse" style={{ width: "40%", backgroundColor: "#f5f5f5" }} />
//         <div className="flex gap-2 mt-2">
//           <div className="h-9 flex-1 rounded-xl animate-pulse" style={{ backgroundColor: "#f5f5f5" }} />
//           <div className="h-9 flex-1 rounded-xl animate-pulse" style={{ backgroundColor: "#f0f0f0" }} />
//           <div className="h-9 w-9 rounded-xl animate-pulse"   style={{ backgroundColor: "#f5f5f5" }} />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // BANNER LIST PAGE
// // ══════════════════════════════════════════════════════════════════════════════
// export default function BannerListPage() {
//   const navigate = useNavigate();
//   const { banners, loading, error, refresh } = useBanners();
//   const { deleteBanner, loading: deleting }  = useDeleteBanner();

//   // ── Overlay state ─────────────────────────────────────────────────────────
//   const [showCreate,   setShowCreate]   = useState(false);
//   // const [editTargetId, setEditTargetId] = useState(null);   // null = closed

//   // ── Delete modal state ────────────────────────────────────────────────────
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   // ── Toast state ───────────────────────────────────────────────────────────
//   const [toast, setToast] = useState({ message: "", type: "success" });

//   const showToast = (message, type = "success") => {
//     setToast({ message, type });
//     setTimeout(() => setToast({ message: "", type: "success" }), 3000);
//   };

//   // ── Handlers ──────────────────────────────────────────────────────────────
//   const handleDelete = async () => {
//       if (!deleteTarget) return;
//       try {
//         await deleteBanner(deleteTarget.banner_id);
//         await refresh();
//         showToast(`"${deleteTarget.title}" deleted successfully.`);
//         // ✅ DON'T close here — modal will auto-close after showing success
//       } catch {
//         showToast("Failed to delete banner. Please try again.", "error");
//         // ✅ DON'T close here either — modal stays open showing error
//       }
//   };

//   const onView = useCallback((id) => {
//     navigate(`/admin/banners/view/${id}`);
//   }, [navigate]);

//   // Open overlays
//   // const onEdit   = useCallback((id) => setEditTargetId(id), []);
//   const onCreate = useCallback(()    => setShowCreate(true), []);

//   const handleCreated = useCallback(async () => {
//     setShowCreate(false);
//     await refresh();
//     showToast("Banner created successfully.");
//   }, [refresh]);

//   // const handleUpdated = useCallback(async () => {
//   //   setEditTargetId(null);
//   //   await refresh();
//   //   showToast("Banner updated successfully.");
//   // }, [refresh]);

//   return (
//     <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

//       {/* ── Top bar ── */}
//       <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
//         <div className="flex items-center gap-3">
//           <div
//             className="flex items-center justify-center w-9 h-9 rounded-xl"
//             style={{ backgroundColor: "#fff", border: "1px solid #ebebeb" }}
//           >
//             <ViewModuleOutlinedIcon style={{ fontSize: 18, color: "#555" }} />
//           </div>
//           <div>
//             <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Admin / Banners</p>
//             <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
//               Banner Management
//             </h1>
//           </div>
//         </div>

//         <div className="flex items-center gap-2.5">
//           {/* Refresh */}
//           <button
//             onClick={refresh}
//             className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer transition-all"
//             style={{ backgroundColor: "#fff", border: "1px solid #e8e8e8", color: "#888" }}
//             onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.color = "#111"; }}
//             onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#888"; }}
//           >
//             <RefreshOutlinedIcon style={{ fontSize: 17 }} />
//           </button>

//           {/* Add Banner — opens create overlay */}
//           <button
//             onClick={onCreate}
//             className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
//             style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", color: "#fff", border: "none" }}
//             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333"; }}
//             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}
//           >
//             <AddOutlinedIcon style={{ fontSize: 16 }} />
//             Add Banner
//           </button>
//         </div>
//       </div>

//       {/* ── Error state ── */}
//       {error && !loading && (
//         <div
//           className="bg-white rounded-2xl p-6 mb-5"
//           style={{ border: "1px solid #fecaca", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
//         >
//           <p style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#dc2626" }}>Failed to load banners</p>
//           <p style={{ ...INTER, fontSize: 13, color: "#777", marginTop: 4 }}>{error}</p>
//           <button
//             onClick={refresh}
//             className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all"
//             style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: "#f5f5f5", color: "#555", border: "1px solid #e8e8e8" }}
//           >
//             <RefreshOutlinedIcon style={{ fontSize: 14 }} />
//             Retry
//           </button>
//         </div>
//       )}

//       {/* ── Card grid ── */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//         {loading
//           ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
//           : banners?.map((banner) => (
//               <BannerCard
//                 key={banner.banner_id}
//                 banner={banner}
//                 onView={() => onView(banner.banner_id)}
//                 // onEdit={() => onEdit(banner.banner_id)}
//                 onDelete={(b) => setDeleteTarget(b)}
//               />
//             ))
//         }
//       </div>

//       {/* ── Empty state ── */}
//       {!loading && !error && (!banners || banners.length === 0) && (
//         <div className="flex flex-col items-center justify-center py-20 gap-4">
//           <div className="flex items-center justify-center w-16 h-16 rounded-2xl" style={{ backgroundColor: "#f0f0f0" }}>
//             <ViewModuleOutlinedIcon style={{ fontSize: 32, color: "#ccc" }} />
//           </div>
//           <div className="text-center">
//             <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>No banners yet</p>
//             <p style={{ ...INTER, fontSize: 13, color: "#aaa", marginTop: 4 }}>Create your first banner to get started.</p>
//           </div>
//           <button
//             onClick={onCreate}
//             className="flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer transition-all"
//             style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", color: "#fff", border: "none" }}
//             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333"; }}
//             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}
//           >
//             <AddOutlinedIcon style={{ fontSize: 16 }} />
//             Add Banner
//           </button>
//         </div>
//       )}

//       {/* ── Delete confirmation modal ── */}
//       <DeleteConfirmModal
//         item={deleteTarget}
//         onConfirm={handleDelete}
//         onCancel={() => setDeleteTarget(null)}
//         onDeleted={() => setDeleteTarget(null)} 
//       />

//       {/* ── Create overlay — renders on top of this page ── */}
//       <BannerCreateOverlay
//         isOpen={showCreate}
//         onClose={() => setShowCreate(false)}
//         onCreated={handleCreated}
//       />

//       {/* ── Edit overlay — renders on top of this page ── */}
//       {/* <BannerEditOverlay
//         isOpen={editTargetId !== null}
//         bannerId={editTargetId}
//         onClose={() => setEditTargetId(null)}
//         onUpdated={handleUpdated}
//       /> */}

//       {/* ── Toast ── */}
//       <Toast message={toast.message} type={toast.type} />
//     </div>
//   );
// }

// import { useCallback, useState }          from "react";
// import { useNavigate }                    from "react-router-dom";
// import { SORA, INTER }                    from "../../../../styles/fonts";

// import AddOutlinedIcon                    from "@mui/icons-material/AddOutlined";
// import RefreshOutlinedIcon                from "@mui/icons-material/RefreshOutlined";
// import ViewModuleOutlinedIcon             from "@mui/icons-material/ViewModuleOutlined";

// import { useBanners }                     from "../../features/banners/hooks/useBanners.js";
// import { useDeleteBanner }                from "../../features/banners/hooks/useDeleteBanner.js";

// import BannerCreateOverlay                from "../../overlay/BannerCreateOverlay.jsx";
// import BannerCard                         from "../../components/banners/BannerCard.jsx";
// import DeleteConfirmModal                 from "../../components/DeleteConfirmModal.jsx";


// // ─── Toast ────────────────────────────────────────────────────────────────────
// function Toast({ message, type = "success" }) {
//   if (!message) return null;
//   return (
//     <div
//       className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl"
//       style={{
//         ...INTER, fontSize: 13, fontWeight: 700,
//         backgroundColor: type === "success" ? "#f0fdf4" : "#fef2f2",
//         color:           type === "success" ? "#15803d" : "#dc2626",
//         border:         `1px solid ${type === "success" ? "#bbf7d0" : "#fecaca"}`,
//         boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//         animation: "slideUp 0.25s ease",
//       }}
//     >
//       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: type === "success" ? "#16a34a" : "#e53935" }} />
//       {message}
//       <style>{`@keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
//     </div>
//   );
// }

// // ── Skeleton card ─────────────────────────────────────────────────────────────
// function SkeletonCard() {
//   return (
//     <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #ebebeb" }}>
//       <div className="w-full animate-pulse" style={{ height: 180, backgroundColor: "#f0f0f0" }} />
//       <div className="p-5 flex flex-col gap-3">
//         <div className="h-4 rounded-lg animate-pulse" style={{ width: "70%", backgroundColor: "#f0f0f0" }} />
//         <div className="h-3 rounded-lg animate-pulse" style={{ width: "40%", backgroundColor: "#f5f5f5" }} />
//         <div className="flex gap-2 mt-2">
//           <div className="h-9 flex-1 rounded-xl animate-pulse" style={{ backgroundColor: "#f5f5f5" }} />
//           <div className="h-9 flex-1 rounded-xl animate-pulse" style={{ backgroundColor: "#f0f0f0" }} />
//           <div className="h-9 w-9 rounded-xl animate-pulse"   style={{ backgroundColor: "#f5f5f5" }} />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // BANNER LIST PAGE
// // ══════════════════════════════════════════════════════════════════════════════
// export default function BannerListPage() {
//   const navigate = useNavigate();
//   const { banners, loading, error, refresh } = useBanners();
//   const { deleteBanner }                     = useDeleteBanner();

//   // ── Overlay state ─────────────────────────────────────────────────────────
//   const [showCreate,   setShowCreate]   = useState(false);

//   // ── Delete modal state ────────────────────────────────────────────────────
//   const [deleteTarget, setDeleteTarget] = useState(null); // normalized item shape

//   // ── Toast state ───────────────────────────────────────────────────────────
//   const [toast, setToast] = useState({ message: "", type: "success" });

//   const showToast = (message, type = "success") => {
//     setToast({ message, type });
//     setTimeout(() => setToast({ message: "", type: "success" }), 3000);
//   };

//   // ── Handlers ──────────────────────────────────────────────────────────────

//   // Normalize raw banner → item shape the modal expects
//   const openDeleteModal = useCallback((banner) => {
//     setDeleteTarget({
//       id:        banner.banner_id,
//       name:      banner.title,
//       type:      "Banner",
//       context:   "Banners",
//       image_url: banner.image_url ?? null,
//     });
//   }, []);

//   // No try/catch — throws naturally so the modal catches and shows inline error
//   const handleDelete = async () => {
//     if (!deleteTarget) return;
//     await deleteBanner(deleteTarget.id);
//     await refresh();
//   };

//   // Called by modal after its success auto-close delay
//   const handleDeleted = useCallback(() => {
//     showToast(`"${deleteTarget?.name}" deleted successfully.`);
//     setDeleteTarget(null);
//   }, [deleteTarget]);

//   const onView = useCallback((id) => {
//     navigate(`/admin/banners/view/${id}`);
//   }, [navigate]);

//   const onCreate = useCallback(() => setShowCreate(true), []);

//   const handleCreated = useCallback(async () => {
//     setShowCreate(false);
//     await refresh();
//     showToast("Banner created successfully.");
//   }, [refresh]);

//   return (
//     <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

//       {/* ── Top bar ── */}
//       <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
//         <div className="flex items-center gap-3">
//           <div
//             className="flex items-center justify-center w-9 h-9 rounded-xl"
//             style={{ backgroundColor: "#fff", border: "1px solid #ebebeb" }}
//           >
//             <ViewModuleOutlinedIcon style={{ fontSize: 18, color: "#555" }} />
//           </div>
//           <div>
//             <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Admin / Banners</p>
//             <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
//               Banner Management
//             </h1>
//           </div>
//         </div>

//         <div className="flex items-center gap-2.5">
//           {/* Refresh */}
//           <button
//             onClick={refresh}
//             className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer transition-all"
//             style={{ backgroundColor: "#fff", border: "1px solid #e8e8e8", color: "#888" }}
//             onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.color = "#111"; }}
//             onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#888"; }}
//           >
//             <RefreshOutlinedIcon style={{ fontSize: 17 }} />
//           </button>

//           {/* Add Banner */}
//           <button
//             onClick={onCreate}
//             className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
//             style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", color: "#fff", border: "none" }}
//             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333"; }}
//             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}
//           >
//             <AddOutlinedIcon style={{ fontSize: 16 }} />
//             Add Banner
//           </button>
//         </div>
//       </div>

//       {/* ── Error state ── */}
//       {error && !loading && (
//         <div
//           className="bg-white rounded-2xl p-6 mb-5"
//           style={{ border: "1px solid #fecaca", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
//         >
//           <p style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#dc2626" }}>Failed to load banners</p>
//           <p style={{ ...INTER, fontSize: 13, color: "#777", marginTop: 4 }}>{error}</p>
//           <button
//             onClick={refresh}
//             className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all"
//             style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: "#f5f5f5", color: "#555", border: "1px solid #e8e8e8" }}
//           >
//             <RefreshOutlinedIcon style={{ fontSize: 14 }} />
//             Retry
//           </button>
//         </div>
//       )}

//       {/* ── Card grid ── */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//         {loading
//           ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
//           : banners?.map((banner) => (
//               <BannerCard
//                 key={banner.banner_id}
//                 banner={banner}
//                 onView={() => onView(banner.banner_id)}
//                 onDelete={() => openDeleteModal(banner)}
//               />
//             ))
//         }
//       </div>

//       {/* ── Empty state ── */}
//       {!loading && !error && (!banners || banners.length === 0) && (
//         <div className="flex flex-col items-center justify-center py-20 gap-4">
//           <div className="flex items-center justify-center w-16 h-16 rounded-2xl" style={{ backgroundColor: "#f0f0f0" }}>
//             <ViewModuleOutlinedIcon style={{ fontSize: 32, color: "#ccc" }} />
//           </div>
//           <div className="text-center">
//             <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>No banners yet</p>
//             <p style={{ ...INTER, fontSize: 13, color: "#aaa", marginTop: 4 }}>Create your first banner to get started.</p>
//           </div>
//           <button
//             onClick={onCreate}
//             className="flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer transition-all"
//             style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", color: "#fff", border: "none" }}
//             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333"; }}
//             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}
//           >
//             <AddOutlinedIcon style={{ fontSize: 18 }} />
//             Add Banner
//           </button>
//         </div>
//       )}

//       {/* ── Delete modal ── */}
//       <DeleteConfirmModal
//         item={deleteTarget}
//         onConfirm={handleDelete}
//         onCancel={() => setDeleteTarget(null)}
//         onDeleted={handleDeleted}
//       />

//       {/* ── Create overlay — unmounted when not in use ── */}
//       {showCreate && (
//         <BannerCreateOverlay
//           onClose={() => setShowCreate(false)}
//           onCreated={handleCreated}
//         />
//       )}

//       {/* ── Toast ── */}
//       <Toast message={toast.message} type={toast.type} />
//     </div>
//   );
// }


import { useCallback, useState }          from "react";
import { useNavigate }                    from "react-router-dom";
import { SORA, INTER }                    from "../../../../styles/fonts";

import AddOutlinedIcon                    from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon                from "@mui/icons-material/RefreshOutlined";
import ViewModuleOutlinedIcon             from "@mui/icons-material/ViewModuleOutlined";

import { useBanners }                     from "../../features/banners/hooks/useBanners.js";
import { useDeleteBanner }                from "../../features/banners/hooks/useDeleteBanner.js";

import BannerCreateOverlay                from "../../overlay/BannerCreateOverlay.jsx";
// import BannerEditOverlay                  from "../../overlay/BannerEditOverlay.jsx";
import BannerCard                         from "../../components/banners/BannerCard.jsx";
// import DeleteBannerModal                  from "../../components/banners/DeleteBannerModal.jsx";
import DeleteConfirmModal                 from "../../components/DeleteConfirmModal.jsx";


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
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: type === "success" ? "#16a34a" : "#e53935" }} />
      {message}
      <style>{`@keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #ebebeb" }}>
      <div className="w-full animate-pulse" style={{ height: 180, backgroundColor: "#f0f0f0" }} />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 rounded-lg animate-pulse" style={{ width: "70%", backgroundColor: "#f0f0f0" }} />
        <div className="h-3 rounded-lg animate-pulse" style={{ width: "40%", backgroundColor: "#f5f5f5" }} />
        <div className="flex gap-2 mt-2">
          <div className="h-9 flex-1 rounded-xl animate-pulse" style={{ backgroundColor: "#f5f5f5" }} />
          <div className="h-9 flex-1 rounded-xl animate-pulse" style={{ backgroundColor: "#f0f0f0" }} />
          <div className="h-9 w-9 rounded-xl animate-pulse"   style={{ backgroundColor: "#f5f5f5" }} />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BANNER LIST PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function BannerListPage() {
  const navigate = useNavigate();
  const { banners, loading, error, refresh } = useBanners();
  const { deleteBanner, loading: deleting }  = useDeleteBanner();

  // ── Overlay state ─────────────────────────────────────────────────────────
  const [showCreate,   setShowCreate]   = useState(false);
  // const [editTargetId, setEditTargetId] = useState(null);

  // ── Delete modal state ────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null); // normalized item shape

  // ── Toast state ───────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  // Normalize raw banner → item shape the modal expects
  const openDeleteModal = useCallback((banner) => {
    setDeleteTarget({
      id:        banner.banner_id,
      name:      banner.title,
      type:      "Banner",
      context:   "Banners",
      image_url: banner.image_url ?? null,
    });
  }, []);

  // No try/catch — throws naturally so the modal catches and shows inline error
  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteBanner(deleteTarget.id);
    await refresh();
  };

  // Called by modal after its success auto-close delay
  const handleDeleted = useCallback(() => {
    showToast(`"${deleteTarget?.name}" deleted successfully.`);
    setDeleteTarget(null);
  }, [deleteTarget]);

  const onView = useCallback((id) => {
    navigate(`/admin/banners/view/${id}`);
  }, [navigate]);

  // Open overlays
  // const onEdit   = useCallback((id) => setEditTargetId(id), []);
  const onCreate = useCallback(()    => setShowCreate(true), []);

  const handleCreated = useCallback(async () => {
    setShowCreate(false);
    await refresh();
    showToast("Banner created successfully.");
  }, [refresh]);

  // const handleUpdated = useCallback(async () => {
  //   setEditTargetId(null);
  //   await refresh();
  //   showToast("Banner updated successfully.");
  // }, [refresh]);

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ backgroundColor: "#fff", border: "1px solid #ebebeb" }}
          >
            <ViewModuleOutlinedIcon style={{ fontSize: 18, color: "#555" }} />
          </div>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Admin / Banners</p>
            <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
              Banner Management
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Refresh */}
          <button
            onClick={refresh}
            className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer transition-all"
            style={{ backgroundColor: "#fff", border: "1px solid #e8e8e8", color: "#888" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.color = "#111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#888"; }}
          >
            <RefreshOutlinedIcon style={{ fontSize: 17 }} />
          </button>

          {/* Add Banner — opens create overlay */}
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", color: "#fff", border: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}
          >
            <AddOutlinedIcon style={{ fontSize: 16 }} />
            Add Banner
          </button>
        </div>
      </div>

      {/* ── Error state ── */}
      {error && !loading && (
        <div
          className="bg-white rounded-2xl p-6 mb-5"
          style={{ border: "1px solid #fecaca", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <p style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#dc2626" }}>Failed to load banners</p>
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

      {/* ── Card grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : banners?.map((banner) => (
              <BannerCard
                key={banner.banner_id}
                banner={banner}
                onView={() => onView(banner.banner_id)}
                // onEdit={() => onEdit(banner.banner_id)}
                onDelete={() => openDeleteModal(banner)}
              />
            ))
        }
      </div>

      {/* ── Empty state ── */}
      {!loading && !error && (!banners || banners.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl" style={{ backgroundColor: "#f0f0f0" }}>
            <ViewModuleOutlinedIcon style={{ fontSize: 32, color: "#ccc" }} />
          </div>
          <div className="text-center">
            <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>No banners yet</p>
            <p style={{ ...INTER, fontSize: 13, color: "#aaa", marginTop: 4 }}>Create your first banner to get started.</p>
          </div>
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer transition-all"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", color: "#fff", border: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}
          >
            <AddOutlinedIcon style={{ fontSize: 18 }} />
            Add Banner
          </button>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      <DeleteConfirmModal
        item={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />

      {/* ── Create overlay — renders on top of this page ── */}
      <BannerCreateOverlay
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />

      {/* ── Edit overlay — renders on top of this page ── */}
      {/* <BannerEditOverlay
        isOpen={editTargetId !== null}
        bannerId={editTargetId}
        onClose={() => setEditTargetId(null)}
        onUpdated={handleUpdated}
      /> */}

      {/* ── Toast ── */}
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}