import { useState, useEffect }          from "react";
import DeleteOutlineOutlinedIcon        from "@mui/icons-material/DeleteOutlineOutlined";
// import CloseOutlinedIcon                from "@mui/icons-material/CloseOutlined";
import WarningAmberOutlinedIcon         from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlinedIcon          from "@mui/icons-material/CheckCircleOutlined";
import CloseIcon                        from "@mui/icons-material/Close";
import { SORA, INTER }                  from "../../../../styles/fonts";

export default function DeleteBannerModal({ banner, onConfirm, onCancel, loading }) {
  const [deleted, setDeleted] = useState(false);

  // Reset success state whenever a new banner is targeted
  useEffect(() => {
    if (banner) setDeleted(false);
  }, [banner?.banner_id]);

  const handleConfirm = async () => {
    await onConfirm();
    setDeleted(true);
  };

  if (!banner) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onCancel(); }}
    >
      <div
        className="relative flex flex-col bg-white rounded-2xl overflow-hidden w-full"
        style={{
          maxWidth: 440,
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          animation: "popIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <style>{`
          @keyframes popIn {
            from { transform: scale(0.92); opacity: 0; }
            to   { transform: scale(1);    opacity: 1; }
          }
        `}</style>

        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid #f0f0f0" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
              style={{
                backgroundColor: deleted ? "#f0fdf4" : "#fff5f5",
                transition: "background-color 0.3s ease",
              }}
            >
              {deleted
                ? <CheckCircleOutlinedIcon style={{ fontSize: 18, color: "#16a34a" }} />
                : <WarningAmberOutlinedIcon style={{ fontSize: 18, color: "#e53935" }} />
              }
            </div>
            <div>
              <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Banners / Delete</p>
              <h2 style={{ ...SORA, fontSize: 16, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
                {deleted ? "Banner Deleted" : "Delete Banner"}
              </h2>
            </div>
          </div>

          <button
            onClick={onCancel}
            disabled={loading}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-transparent text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all cursor-pointer disabled:opacity-40"
          >
            <CloseIcon style={{ fontSize: 18 }} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Banner image preview */}
          {banner.image_url && (
            <div
              className="w-full rounded-xl overflow-hidden"
              style={{ height: 110, border: "1px solid #f0f0f0" }}
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover"
                style={{
                  filter: deleted ? "grayscale(0.4) opacity(0.65)" : "none",
                  transition: "filter 0.4s ease",
                }}
              />
            </div>
          )}

          {/* Message */}
          {deleted ? (
            <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
              <span style={{ fontWeight: 700, color: "#15803d" }}>"{banner.title}"</span>{" "}
              has been permanently deleted.
            </p>
          ) : (
            <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
              Are you sure you want to delete{" "}
              <span style={{ fontWeight: 700, color: "#111" }}>"{banner.title}"</span>?{" "}
              This action cannot be undone.
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="shrink-0 px-6 py-4 flex items-center gap-3"
          style={{ borderTop: "1px solid #f0f0f0", backgroundColor: "#fff" }}
        >
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
            style={{ ...INTER, fontSize: 13, fontWeight: 600, background: "#fff" }}
          >
            {deleted ? "Close" : "Cancel"}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || deleted}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white cursor-pointer disabled:opacity-60"
            style={{
              ...SORA,
              fontSize: 13,
              fontWeight: 700,
              backgroundColor: deleted ? "#16a34a" : "#e53935",
              border: "none",
              transition: "background-color 0.3s ease",
            }}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting…
              </>
            ) : deleted ? (
              <>
                <CheckCircleOutlinedIcon style={{ fontSize: 16 }} />
                Deleted!
              </>
            ) : (
              <>
                <DeleteOutlineOutlinedIcon style={{ fontSize: 16 }} />
                Delete Banner
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}