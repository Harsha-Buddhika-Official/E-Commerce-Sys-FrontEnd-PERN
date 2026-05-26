import { useMemo, useState } from "react";
import EmailOutlinedIcon          from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon           from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon  from "@mui/icons-material/VisibilityOffOutlined";
import OzoneLogo                  from "../../../../assets/Ozone_Logo.png";
import { useAdminLogin }          from "../../features/auth/hooks/useAdminLogin";

// ─── Font — leaf elements only ────────────────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── SVG network mesh background ─────────────────────────────────────────────
const NetworkBg = () => {
	const { points, lines } = useMemo(() => {
		const width = 1600;
		const height = 900;
		const pointCount = 34;
		const randomValues = new Uint32Array(pointCount * 3 + pointCount * pointCount);
		crypto.getRandomValues(randomValues);

		const points = Array.from({ length: pointCount }, (_, index) => ({
			x: randomValues[index * 3] % width,
			y: randomValues[index * 3 + 1] % height,
			r: 2 + (randomValues[index * 3 + 2] % 3),
		}));

		const lines = [];
		let randomIndex = pointCount * 3;
		for (let i = 0; i < points.length; i += 1) {
			for (let j = i + 1; j < points.length; j += 1) {
				const dx = points[i].x - points[j].x;
				const dy = points[i].y - points[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < 190 && (randomValues[randomIndex++] % 100) > 45) {
					lines.push({ x1: points[i].x, y1: points[i].y, x2: points[j].x, y2: points[j].y });
				}
			}
		}

		return { points, lines };
	}, []);

	return (
		<svg
			className="absolute inset-0 w-full h-full pointer-events-none select-none"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1600 900"
			width="100%"
			height="100%"
			preserveAspectRatio="none"
			style={{ opacity: 0.18 }}
		>
			{points.map((point, i) => (
				<circle key={i} cx={point.x} cy={point.y} r={point.r} fill="#c9c9c9" />
			))}
			{lines.map((line, i) => (
				<line
					key={i}
					x1={line.x1}
					y1={line.y1}
					x2={line.x2}
					y2={line.y2}
					stroke="#c9c9c9"
					strokeWidth="0.8"
				/>
			))}
		</svg>
	);
};

// ─── AdminLogin ───────────────────────────────────────────────────────────────
const AdminLogin = () => {
	const [email,    setEmail]    = useState("");
	const [password, setPassword] = useState("");
	const [showPw,   setShowPw]   = useState(false);

	const { loading, error, login } = useAdminLogin();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!email || !password) return;
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

						{error && (
							<p className="text-red-400 text-center -mt-2" style={{ ...INTER, fontSize: 12, fontWeight: 500 }}>
								{error}
							</p>
						)}

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

				<p className="mt-5 text-white/20 text-center" style={{ ...INTER, fontSize: 11, fontWeight: 400 }}>
					Ozone Computers — Admin Panel
				</p>
			</div>
		</div>
	);
};

export default AdminLogin;
