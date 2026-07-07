import { useEffect, useRef, useState } from "react";
import EmailOutlinedIcon          from "@mui/icons-material/EmailOutlined";
import VisibilityOutlinedIcon     from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon  from "@mui/icons-material/VisibilityOffOutlined";
import OzoneLogo from "../../../../assets/Ozone_Logo.png";
import { useAdminLogin } from "../../features/auth/hooks/useAdminLogin";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const CREDENTIAL_ERROR = "Invalid email or password. Please try again.";

// ─── Animated SVG Network Background ─────────────────────────────────────────
const NetworkBg = () => {
  const WIDTH = 1600;
  const HEIGHT = 900;
  const POINT_COUNT = 34;
  const CONNECTION_DISTANCE = 200;
  const animationRef = useRef(null);

  const createPoints = () => {
    const randomValues = new Uint32Array(POINT_COUNT * 5);
    crypto.getRandomValues(randomValues);
    return Array.from({ length: POINT_COUNT }, (_, i) => ({
      x:  randomValues[i * 5]     % WIDTH,
      y:  randomValues[i * 5 + 1] % HEIGHT,
      r:  2 + (randomValues[i * 5 + 2] % 3),
      vx: ((randomValues[i * 5 + 3] / 0xffffffff) - 0.5) * 0.35,
      vy: ((randomValues[i * 5 + 4] / 0xffffffff) - 0.5) * 0.35,
    }));
  };

  const [points, setPoints] = useState(createPoints);

  useEffect(() => {
    const animate = () => {
      setPoints((prev) =>
        prev.map((p) => {
          let { x, y, vx, vy } = p;
          x += vx; y += vy;
          if (x <= 0 || x >= WIDTH)  vx *= -1;
          if (y <= 0 || y >= HEIGHT) vy *= -1;
          x = Math.max(0, Math.min(WIDTH,  x));
          y = Math.max(0, Math.min(HEIGHT, y));
          return { ...p, x, y, vx, vy };
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, []);

  const lines = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECTION_DISTANCE) {
        lines.push({
          x1: points[i].x, y1: points[i].y,
          x2: points[j].x, y2: points[j].y,
          opacity: (1 - dist / CONNECTION_DISTANCE) * 1.5,
        });
      }
    }
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width="100%" height="100%"
      preserveAspectRatio="none"
      style={{ opacity: 0.2 }}
    >
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="#c9c9c9" strokeWidth="0.8" opacity={l.opacity} />
      ))}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#c9c9c9" />
      ))}
    </svg>
  );
};

// ─── Admin Login ──────────────────────────────────────────────────────────────
const AdminLogin = () => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [localErr, setLocalErr] = useState("");

  const { loading, login } = useAdminLogin();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   if (!email.trim() || !password) return;

  //   setLocalErr("");

  //   try {
  //     await login({ email: email.trim(), password });
  //   } catch {
  //     setLocalErr(CREDENTIAL_ERROR);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email.trim() || !password) return;

    setLocalErr("");

    try {
      await login({ email: email.trim(), password });
    } catch (error) {
      // console.log("Login error:", error);
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;

      if (status === 429 && serverMessage) {
        setLocalErr(serverMessage);
      } else {
        setLocalErr(CREDENTIAL_ERROR);
      }
    }
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

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-white/10 px-8 py-8 backdrop-blur-sm"
          style={{ backgroundColor: "#2a2a2add" }}
        >
          <div className="flex flex-col gap-6">

            {/* Email */}
            <div className="flex items-center gap-3 border-b border-white/20 pb-2 focus-within:border-white/60 transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setLocalErr(""); }}
                placeholder="Email"
                required
                autoComplete="email"
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
                onChange={(e) => { setPassword(e.target.value); setLocalErr(""); }}
                placeholder="Password"
                required
                autoComplete="current-password"
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
                  : <VisibilityOutlinedIcon   style={{ fontSize: 20 }} />
                }
              </button>
            </div>

            {/* Error */}
            {localErr && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg -mt-2"
                style={{ backgroundColor: "rgba(229,57,53,0.12)", border: "1px solid rgba(229,57,53,0.3)" }}
              >
                <span style={{ ...INTER, fontSize: 12, fontWeight: 500, color: "#ff6b6b", lineHeight: 1.5 }}>
                  {localErr}
                </span>
              </div>
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

          </div>
        </form>

        <p className="mt-5 text-white/20 text-center" style={{ ...INTER, fontSize: 11, fontWeight: 400 }}>
          Ozone Computers — Admin Panel
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;