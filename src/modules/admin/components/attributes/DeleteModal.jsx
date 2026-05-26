import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

export default function DeleteModal({ message, onConfirm, onCancel, isDeleting, errorMessage }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-7 flex flex-col gap-4 w-full" style={{ maxWidth: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 shrink-0">
            <WarningAmberOutlinedIcon style={{ fontSize: 20, color: "#e53935" }} />
          </div>
          <h3 style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Confirm Delete</h3>
        </div>
        <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>{message}</p>
        <div className="flex gap-3">
          {errorMessage && (
            <p style={{ ...INTER, fontSize: 12, color: "#e53935", lineHeight: 1.5 }}>
              {errorMessage}
            </p>
          )}
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#555", background: "#fff" }} disabled={isDeleting}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed" style={{ ...INTER, fontSize: 13, fontWeight: 700, background: "#e53935", border: "none" }}
            disabled={isDeleting}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#c62828"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e53935"}
          >{isDeleting ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>
  );
}
