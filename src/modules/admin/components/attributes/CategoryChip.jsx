const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

export default function CategoryChip({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border shrink-0 cursor-pointer transition-all"
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
      className="flex items-center justify-center min-w-5 h-5 rounded-full px-1"
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
