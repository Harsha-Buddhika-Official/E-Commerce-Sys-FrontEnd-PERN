import { useState } from "react";
import MenuIcon              from "@mui/icons-material/Menu";
import SearchIcon            from "@mui/icons-material/Search";
import CloseIcon             from "@mui/icons-material/Close";
import NotificationOverlay   from "./NotificationOverlay";

// ─── Font constant — leaf elements only ───────────────────────────────────────
const SORA = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };

// ─── AdminNavbar ──────────────────────────────────────────────────────────────
// Props:
//   title         — page title shown next to the hamburger (default "Dashboard")
//   onMenuClick   — callback when hamburger is clicked (toggle sidebar)
//   notifications — array of notification objects passed to NotificationOverlay
const Navbar = ({
  title         = "Dashboard",
  onMenuClick   = () => {},
  notifications = [],
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    // Full-width black bar — no fontFamily on wrapper
    <nav
      className="w-full bg-[#111111] flex items-center px-4 sm:px-6"
      style={{ height: 52 }}
    >

      {/* ── LEFT: hamburger + title ── */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center text-white hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer p-1 -ml-1"
          aria-label="Toggle sidebar"
        >
          <MenuIcon style={{ fontSize: 22 }} />
        </button>

        <span
          className="text-white font-semibold whitespace-nowrap"
          style={{ ...SORA, fontSize: 15, letterSpacing: "0.01em" }}
        >
          {title}
        </span>
      </div>

      {/* ── CENTRE: search bar ── */}
      <div className="flex-1 flex justify-center px-4 sm:px-10">
        <div
          className="flex items-center gap-2 px-3 rounded-lg transition-all duration-150 w-full"
          style={{
            maxWidth: 380,
            backgroundColor: searchFocused ? "#2a2a2a" : "#222222",
            border: `1px solid ${searchFocused ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}`,
            height: 34,
          }}
        >
          <SearchIcon style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search…"
            className="flex-1 bg-transparent text-white placeholder-white/25 outline-none border-none text-[13px] min-w-0"
            style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
          />
          {/* Clear button — only when there's text */}
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="flex items-center bg-transparent border-none cursor-pointer p-0 text-white/30 hover:text-white/60 transition-colors shrink-0"
            >
              <CloseIcon style={{ fontSize: 14 }} />
            </button>
          )}
        </div>
      </div>

      {/* ── RIGHT: notification overlay ── */}
      <NotificationOverlay notifications={notifications} />

    </nav>
  );
};

export default Navbar;