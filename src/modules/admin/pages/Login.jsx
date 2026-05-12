// features/auth/pages/AdminLogin.jsx
// Layer: UI — renders form state only. No API calls, no token logic.

import { useState } from "react";
import EmailOutlinedIcon          from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon           from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon  from "@mui/icons-material/VisibilityOffOutlined";
import OzoneLogo                  from "../../../assets/Ozone_Logo.png";
import { useAdminLogin }          from "../features/auth/hooks/useAdminLogin";
// ↑ import path assumes: features/auth/hooks/useAdminLogin.js

// ─── Font — leaf elements only ────────────────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── SVG network mesh background ─────────────────────────────────────────────
const NetworkBg = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.18 }}
  >
    {[
      [1220,260],[1310,340],[1380,440],[1270,480],[1180,390],
      [1420,300],[1340,210],[1460,400],[1160,510],[1290,560],
      [1400,520],[1460,200],[1230,170],[1100,430],[1480,470],
      [640,680],[720,730],[800,680],[760,760],[700,800],
      [860,720],[900,660],[840,790],[650,750],[780,820],
      [500,820],[560,780],[620,840],[480,770],
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="4" fill="#aaa" />
    ))}
    {[
      [[1220,260],[1310,340]],[[1310,340],[1380,440]],[[1380,440],[1270,480]],
      [[1270,480],[1180,390]],[[1180,390],[1220,260]],[[1310,340],[1420,300]],
      [[1420,300],[1340,210]],[[1340,210],[1220,260]],[[1380,440],[1460,400]],
      [[1460,400],[1290,560]],[[1290,560],[1270,480]],[[1270,480],[1160,510]],
      [[1160,510],[1180,390]],[[1420,300],[1460,200]],[[1460,200],[1340,210]],
      [[1400,520],[1460,400]],[[1400,520],[1290,560]],[[1480,470],[1460,400]],
      [[1100,430],[1180,390]],[[1100,430],[1160,510]],
      [[640,680],[720,730]],[[720,730],[800,680]],[[800,680],[760,760]],
      [[760,760],[700,800]],[[700,800],[640,680]],[[720,730],[860,720]],
      [[860,720],[900,660]],[[900,660],[800,680]],[[760,760],[840,790]],
      [[840,790],[900,660]],[[640,680],[650,750]],[[650,750],[700,800]],
      [[780,820],[760,760]],[[780,820],[840,790]],
      [[500,820],[560,780]],[[560,780],[620,840]],[[620,840],[500,820]],
      [[560,780],[640,680]],[[480,770],[500,820]],[[480,770],[560,780]],
    ].map(([[x1,y1],[x2,y2]], i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#aaa" strokeWidth="0.8" />
    ))}
  </svg>
);

// ─── AdminLogin ───────────────────────────────────────────────────────────────
const AdminLogin = () => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);

  // All async state (loading, error) and the login call come from the hook.
  // The hook handles token storage and navigation to /admin/dashboard on success.
  const { loading, error, login } = useAdminLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return; // HTML5 `required` handles empty fields
    login({ email, password });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#111111] flex flex-col items-center justify-center overflow-hidden px-4">
      <NetworkBg />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">

        <img src={OzoneLogo} alt="Ozone Logo" className="w-20 h-20 mb-6" />

        <h1
          className="text-white mb-6 text-center leading-none"
          style={{ ...SORA, fontSize: 26, fontWeight: 600, letterSpacing: "0.02em" }}
        >
          Admin Login
        </h1>

        <div
          className="w-full rounded-2xl border border-white/10 px-8 py-8"
          style={{ backgroundColor: "#2a2a2a" }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Email */}
            <div className="flex items-center gap-3 border-b border-white/20 pb-2 focus-within:border-white/60 transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none border-none text-[14px]"
                style={INTER}
              />
              <EmailOutlinedIcon style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }} />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 border-b border-white/20 pb-2 focus-within:border-white/60 transition-colors">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none border-none text-[14px]"
                style={INTER}
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                className="flex items-center bg-transparent border-none cursor-pointer p-0 text-white/50 hover:text-white/80 transition-colors"
              >
                {showPw
                  ? <VisibilityOffOutlinedIcon style={{ fontSize: 20 }} />
                  : <LockOutlinedIcon style={{ fontSize: 20 }} />
                }
              </button>
            </div>

            {/* Error — only shown when the API returns an error */}
            {error && (
              <p
                className="text-red-400 text-center -mt-2"
                style={{ ...INTER, fontSize: 12, fontWeight: 500 }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ ...SORA, fontSize: 15, fontWeight: 700, letterSpacing: "0.04em", backgroundColor: "#e53935" }}
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : "Sign In"
              }
            </button>

          </form>
        </div>

        <p
          className="mt-5 text-white/20 text-center"
          style={{ ...INTER, fontSize: 11, fontWeight: 400 }}
        >
          Ozone Computers — Admin Panel
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;