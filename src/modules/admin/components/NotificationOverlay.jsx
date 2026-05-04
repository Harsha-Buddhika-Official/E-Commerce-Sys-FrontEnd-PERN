import { useState, useRef, useEffect, useMemo } from "react";
import NotificationsOutlinedIcon  from "@mui/icons-material/NotificationsOutlined";
import CircleIcon                 from "@mui/icons-material/Circle";
import DoneAllOutlinedIcon        from "@mui/icons-material/DoneAllOutlined";
import DeleteOutlineOutlinedIcon  from "@mui/icons-material/DeleteOutlineOutlined";
import ShoppingCartOutlinedIcon   from "@mui/icons-material/ShoppingCartOutlined";
import WarningAmberOutlinedIcon   from "@mui/icons-material/WarningAmberOutlined";
import PersonAddAltOutlinedIcon   from "@mui/icons-material/PersonAddAltOutlined";
import LocalShippingOutlinedIcon  from "@mui/icons-material/LocalShippingOutlined";
import InfoOutlinedIcon           from "@mui/icons-material/InfoOutlined";

// ─── Font constants — leaf elements only ──────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Notification type config ─────────────────────────────────────────────────
const TYPE_CONFIG = {
  order:    { icon: <ShoppingCartOutlinedIcon  style={{ fontSize: 16 }} />, bg: "#dbeafe", color: "#1d4ed8" },
  stock:    { icon: <WarningAmberOutlinedIcon  style={{ fontSize: 16 }} />, bg: "#fee2e2", color: "#dc2626" },
  customer: { icon: <PersonAddAltOutlinedIcon  style={{ fontSize: 16 }} />, bg: "#dcfce7", color: "#16a34a" },
  shipping: { icon: <LocalShippingOutlinedIcon style={{ fontSize: 16 }} />, bg: "#fef9c3", color: "#ca8a04" },
  info:     { icon: <InfoOutlinedIcon          style={{ fontSize: 16 }} />, bg: "#f3e8ff", color: "#7c3aed" },
};

// ─── Single notification row ──────────────────────────────────────────────────
function NotifRow({ notif, onRead, onDelete }) {
  const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 transition-colors duration-150 cursor-pointer group
        ${notif.read ? "bg-white hover:bg-[#fafafa]" : "bg-blue-50/60 hover:bg-blue-50"}`}
      onClick={() => onRead(notif.id)}
    >
      {/* Type icon circle */}
      <div
        className="flex items-center justify-center rounded-full shrink-0 mt-0.5"
        style={{ width: 32, height: 32, backgroundColor: cfg.bg, color: cfg.color }}
      >
        {cfg.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className="text-[#111] leading-tight"
            style={{ ...INTER, fontSize: 12, fontWeight: notif.read ? 500 : 700 }}
          >
            {notif.title}
          </p>
          {/* Unread dot */}
          {!notif.read && (
            <CircleIcon style={{ fontSize: 8, color: "#1a73e8", flexShrink: 0, marginTop: 3 }} />
          )}
        </div>
        <p
          className="text-gray-500 leading-snug mt-0.5 line-clamp-2"
          style={{ ...INTER, fontSize: 11, fontWeight: 400 }}
        >
          {notif.body}
        </p>
        <p
          className="text-gray-400 mt-1"
          style={{ ...INTER, fontSize: 10, fontWeight: 400 }}
        >
          {notif.time}
        </p>
      </div>

      {/* Delete button — visible on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(notif.id); }}
        className="opacity-0 group-hover:opacity-100 shrink-0 flex items-center justify-center w-6 h-6 rounded-md hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all duration-150 bg-transparent border-none cursor-pointer mt-0.5"
      >
        <DeleteOutlineOutlinedIcon style={{ fontSize: 14 }} />
      </button>
    </div>
  );
}

// ─── NotificationOverlay ──────────────────────────────────────────────────────
// Props:
//   notifications  — array of notification objects
//   onMarkAllRead  — () => void
//   onClearAll     — () => void

const NotificationOverlay = ({
  notifications: initNotifs = [],
  onMarkAllRead  = () => {},
  onClearAll     = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("all"); // "all" | "unread"
  const [readIds, setReadIds] = useState(() => new Set());
  const [deletedIds, setDeletedIds] = useState(() => new Set());
  const [isCleared, setIsCleared] = useState(false);
  const ref = useRef(null);

  const notifs = useMemo(() => {
    if (isCleared) return [];

    return initNotifs
      .filter((n) => !deletedIds.has(n.id))
      .map((n) => (readIds.has(n.id) ? { ...n, read: true } : n));
  }, [initNotifs, isCleared, deletedIds, readIds]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleRead = (id) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleDelete = (id) => {
    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleMarkAllRead = () => {
    setReadIds((prev) => {
      const next = new Set(prev);
      notifs.forEach((n) => next.add(n.id));
      return next;
    });
    onMarkAllRead();
  };

  const handleClearAll = () => {
    setIsCleared(true);
    onClearAll();
  };

  const displayed = tab === "unread"
    ? notifs.filter((n) => !n.read)
    : notifs;

  return (
    <div ref={ref} className="relative shrink-0">

      {/* ── Bell trigger button ── */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative flex items-center justify-center rounded-lg text-white transition-colors bg-transparent border-none cursor-pointer"
        aria-label="Notifications"
        style={{
          width: 34,
          height: 34,
          border: `1px solid ${open ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)"}`,
          backgroundColor: open ? "#2a2a2a" : "#222222",
        }}
      >
        <NotificationsOutlinedIcon style={{ fontSize: 18 }} />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            className="absolute flex items-center justify-center bg-red-500 text-white rounded-full leading-none"
            style={{
              top: -5, right: -5,
              minWidth: 16, height: 16,
              fontSize: 9, fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              padding: "0 3px",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          className="absolute right-0 z-50 bg-white rounded-2xl overflow-hidden flex flex-col"
          style={{
            top: "calc(100% + 10px)",
            width: 340,
            maxHeight: 520,
            boxShadow: "0 8px 40px rgba(0,0,0,0.16)",
            border: "1px solid #f0f0f0",
          }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0] shrink-0">
            <p className="text-[#111]" style={{ ...SORA, fontSize: 14, fontWeight: 800 }}>
              Notifications
              {unreadCount > 0 && (
                <span
                  className="ml-2 inline-flex items-center justify-center bg-[#1a73e8] text-white rounded-full"
                  style={{ width: 18, height: 18, fontSize: 10, fontWeight: 700, fontFamily: "'Inter',sans-serif" }}
                >
                  {unreadCount}
                </span>
              )}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-[#1a73e8] hover:text-blue-800 transition-colors p-0"
                  style={{ ...INTER, fontSize: 11, fontWeight: 600 }}
                >
                  <DoneAllOutlinedIcon style={{ fontSize: 14 }} />
                  Mark all read
                </button>
              )}
              {notifs.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-gray-400 hover:text-red-500 transition-colors p-0"
                  style={{ ...INTER, fontSize: 11, fontWeight: 600 }}
                >
                  <DeleteOutlineOutlinedIcon style={{ fontSize: 14 }} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#f0f0f0] shrink-0">
            {[
              { key: "all",    label: "All",    count: notifs.length   },
              { key: "unread", label: "Unread", count: unreadCount     },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-none cursor-pointer transition-all duration-150
                  ${tab === key
                    ? "border-b-2 border-[#1a73e8] text-[#1a73e8] bg-white"
                    : "text-gray-400 bg-white hover:text-gray-600"
                  }`}
                style={{ ...INTER, fontSize: 12, fontWeight: 600 }}
              >
                {label}
                <span
                  className={`inline-flex items-center justify-center rounded-full
                    ${tab === key ? "bg-[#1a73e8] text-white" : "bg-gray-100 text-gray-500"}`}
                  style={{ width: 18, height: 18, fontSize: 10, fontWeight: 700, fontFamily: "'Inter',sans-serif" }}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Notification list */}
          <div className="overflow-y-auto flex-1 divide-y divide-[#f5f5f5]">
            {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <NotificationsOutlinedIcon style={{ fontSize: 36, color: "#ddd" }} />
                <p className="text-gray-400" style={{ ...INTER, fontSize: 13, fontWeight: 500 }}>
                  {tab === "unread" ? "No unread notifications" : "No notifications"}
                </p>
              </div>
            ) : (
              displayed.map((notif) => (
                <NotifRow
                  key={notif.id}
                  notif={notif}
                  onRead={handleRead}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationOverlay;
