import { useState, useEffect }           from "react";
import DeleteOutlineOutlinedIcon         from "@mui/icons-material/DeleteOutlineOutlined";
import WarningAmberOutlinedIcon          from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlinedIcon           from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon          from "@mui/icons-material/ErrorOutlineOutlined";
import CloseIcon                         from "@mui/icons-material/Close";
import { SORA, INTER }                   from "../../../styles/fonts.js";


const AUTO_CLOSE_DELAY = 1800;

export default function DeleteConfirmModal({ item, onConfirm, onCancel, onDeleted }) {
  const [status,   setStatus]   = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  // Reset state whenever the targeted item changes
  useEffect(() => {
    if (item) {
      setStatus("idle");
      setErrorMsg("");
    }
  }, [item?.id]);

  // Auto-close after success
  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(() => onDeleted?.(), AUTO_CLOSE_DELAY);
    return () => clearTimeout(t);
  }, [status]);

  const handleConfirm = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      await onConfirm();
      setStatus("success");
    } catch (err) {
      setErrorMsg(err?.message ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (!item) return null;

  const isLocked  = status === "loading" || status === "success";
  const isSuccess = status === "success";
  const isError   = status === "error";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !isLocked) onCancel(); }}
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
          className="flex items-center justify-between px-4 sm:px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid #f0f0f0" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
              style={{
                backgroundColor: isSuccess ? "#f0fdf4" : "#fff5f5",
                transition: "background-color 0.3s ease",
              }}
            >
              {isSuccess
                ? <CheckCircleOutlinedIcon style={{ fontSize: 18, color: "#16a34a" }} />
                : <WarningAmberOutlinedIcon style={{ fontSize: 18, color: "#e53935" }} />
              }
            </div>
            <div className="min-w-0">
              <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
                {item.context} / Delete
              </p>
              <h2 style={{ ...SORA, fontSize: 16, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
                {isSuccess ? `${item.type} Deleted` : `Delete ${item.type}`}
              </h2>
            </div>
          </div>

          <button
            onClick={onCancel}
            disabled={isLocked}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-transparent
                       text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all cursor-pointer
                       disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <CloseIcon style={{ fontSize: 18 }} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-4 sm:px-6 py-5 flex flex-col gap-4">

          {/* Optional image preview */}
          {item.image_url && (
            <div
              className="w-full rounded-xl overflow-hidden"
              style={{ height: 110, border: "1px solid #f0f0f0" }}
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
                style={{
                  filter: isSuccess ? "grayscale(0.4) opacity(0.65)" : "none",
                  transition: "filter 0.4s ease",
                }}
              />
            </div>
          )}

          {/* Status message */}
          {isSuccess ? (
            <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
              <span style={{ fontWeight: 700, color: "#15803d" }}>"{item.name}"</span>{" "}
              has been permanently deleted.
            </p>
          ) : (
            <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
              Are you sure you want to delete{" "}
              <span style={{ fontWeight: 700, color: "#111" }}>"{item.name}"</span>?{" "}
              This action cannot be undone.
            </p>
          )}

          {/* Inline error */}
          {isError && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
            >
              <ErrorOutlineOutlinedIcon style={{ fontSize: 16, color: "#e53935", marginTop: 1, flexShrink: 0 }} />
              <p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#dc2626", lineHeight: 1.6 }}>
                {errorMsg}
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="shrink-0 px-4 sm:px-6 py-4 flex items-center gap-3"
          style={{ borderTop: "1px solid #f0f0f0", backgroundColor: "#fff" }}
        >
          <button
            onClick={onCancel}
            disabled={isLocked}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500
                       hover:bg-gray-50 transition-all cursor-pointer
                       disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ ...INTER, fontSize: 13, fontWeight: 600, background: "#fff" }}
          >
            {isSuccess ? "Close" : "Cancel"}
          </button>

          <button
            onClick={handleConfirm}
            disabled={isLocked}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white
                       cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              ...SORA,
              fontSize: 13,
              fontWeight: 700,
              backgroundColor: isSuccess ? "#16a34a" : "#e53935",
              border: "none",
              transition: "background-color 0.3s ease",
            }}
          >
            {status === "loading" ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                <span className="truncate">Deleting…</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircleOutlinedIcon style={{ fontSize: 16, flexShrink: 0 }} />
                <span className="truncate">Deleted!</span>
              </>
            ) : (
              <>
                <DeleteOutlineOutlinedIcon style={{ fontSize: 16, flexShrink: 0 }} />
                <span className="truncate">Delete {item.type}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}