import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon        from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon             from "@mui/icons-material/SaveOutlined";
import PersonOutlinedIcon           from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon            from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon             from "@mui/icons-material/LockOutlined";
import ShieldOutlinedIcon           from "@mui/icons-material/ShieldOutlined";
import VisibilityOutlinedIcon       from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon    from "@mui/icons-material/VisibilityOffOutlined";
import CheckCircleOutlinedIcon      from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon     from "@mui/icons-material/WarningAmberOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SupervisorAccountOutlinedIcon  from "@mui/icons-material/SupervisorAccountOutlined";
import ManageAccountsOutlinedIcon     from "@mui/icons-material/ManageAccountsOutlined";
import InfoOutlinedIcon               from "@mui/icons-material/InfoOutlined";
import { useCreateAdmin } from "../features/admin/hooks/useCreateAdmin";

// ─── Font constants ───────────────────────────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Role options ─────────────────────────────────────────────────────────────
const ROLES = [
  {
    value: "super_admin",
    label: "Super Admin",
    description: "Full system access including admin management",
    icon: <AdminPanelSettingsOutlinedIcon style={{ fontSize: 20 }} />,
    bg: "#fef9c3", color: "#a16207", border: "#fde047", activeBg: "#fefce8",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage products, orders, and customers",
    icon: <SupervisorAccountOutlinedIcon style={{ fontSize: 20 }} />,
    bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd", activeBg: "#eff6ff",
  },
  {
    value: "manager",
    label: "Manager",
    description: "Manage selected areas with limited elevated privileges",
    icon: <ManageAccountsOutlinedIcon style={{ fontSize: 20 }} />,
    bg: "#f3e8ff", color: "#7e22ce", border: "#d8b4fe", activeBg: "#faf5ff",
  },
];

// ─── Password strength ────────────────────────────────────────────────────────
const getStrength = (pw) => {
  if (!pw) return { level: 0, label: "", color: "#e0e0e0" };
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { level: 0, label: "",         color: "#e0e0e0" },
    { level: 1, label: "Weak",     color: "#e53935" },
    { level: 2, label: "Fair",     color: "#f97316" },
    { level: 3, label: "Good",     color: "#eab308" },
    { level: 4, label: "Strong",   color: "#16a34a" },
  ];
  return map[score];
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 ${className}`}
      style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#f0f0f0]">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: "#f5f5f5", color: "#111" }}>
        {icon}
      </div>
      <span style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111", letterSpacing: "0.02em" }}>
        {children}
      </span>
    </div>
  );
}

function FieldLabel({ children, required = false }) {
  return (
    <label style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
      {children}{required && <span style={{ color: "#e53935" }}> *</span>}
    </label>
  );
}

function TextInput({ label, value, onChange, placeholder, required, type = "text", icon, error, suffix }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 flex items-center justify-center pointer-events-none" style={{ color: focused ? "#111" : "#bbb" }}>
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full outline-none transition-all"
          style={{
            ...INTER,
            fontSize: 13,
            fontWeight: 600,
            color: "#111",
            backgroundColor: focused ? "#fff" : "#f9f9f9",
            border: `1.5px solid ${error ? "#e53935" : focused ? "#111" : "#ebebeb"}`,
            borderRadius: 12,
            padding: `10px 14px 10px ${icon ? "38px" : "14px"}`,
            paddingRight: suffix ? "44px" : "14px",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {suffix && (
          <div className="absolute right-3">{suffix}</div>
        )}
      </div>
      {error && <p style={{ ...INTER, fontSize: 11, color: "#e53935", marginTop: 4 }}>{error}</p>}
    </div>
  );
}

// ─── Avatar preview ───────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#111","#1d4ed8","#15803d","#7e22ce","#c2410c","#0f766e"];
const getAvatarColor = (name = "") => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
};
const getInitials = (name = "") =>
  name.trim().split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";


export default function AdminCreatePage({ onBack, onSuccess = () => {} }) {
  const navigate = useNavigate();
  const { createAdmin, loading: apiLoading, error: apiError } = useCreateAdmin();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm_password: "", role: "admin", is_active: true,
  });
  const [showPw,     setShowPw]     = useState(false);
  const [showCPw,    setShowCPw]    = useState(false);
  const [errors,     setErrors]     = useState({});
  const [saved,      setSaved]      = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/admin/admin-management");
    }
  };

  const setField = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setSaved(false);
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const pwStrength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                       e.name             = "Full name is required";
    if (!form.email.trim())                      e.email            = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))  e.email            = "Enter a valid email";
    if (!form.password)                          e.password         = "Password is required";
    else if (form.password.length < 8)           e.password         = "Minimum 8 characters";
    if (!form.confirm_password)                  e.confirm_password = "Please confirm your password";
    else if (form.password !== form.confirm_password) e.confirm_password = "Passwords do not match";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    
    try {
      const payload = {
        fullName: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };
      await createAdmin(payload);
      setSaved(true);
      if (onSuccess) {
        onSuccess({ ...form, fullName: form.name });
        handleBack();
      }
    } catch (err) {
      setErrors({ api: err.message || "Failed to create admin" });
    }
  };

  const avatarBg = getAvatarColor(form.name);
  const initials  = getInitials(form.name);

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer"
          >
            <ArrowBackOutlinedIcon style={{ fontSize: 18 }} />
          </button>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Admins / Create</p>
            <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Create Admin</h1>
          </div>
        </div>

      </div>

      {/* Validation errors */}
      {(Object.keys(errors).length > 0 || apiError) && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
          <WarningAmberOutlinedIcon style={{ fontSize: 16, color: "#e53935", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#e53935", marginBottom: 4 }}>Please fix the following errors:</p>
            {apiError && <p style={{ ...INTER, fontSize: 12, color: "#e53935" }}>• {apiError}</p>}
            {Object.values(errors).map((err, i) => (
              <p key={i} style={{ ...INTER, fontSize: 12, color: "#e53935" }}>• {err}</p>
            ))}
          </div>
        </div>
      )}

      {/* ── 3-col grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ══ LEFT + CENTRE (col-span-2) ══ */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* Personal info */}
          <SectionCard>
            <SectionTitle icon={<PersonOutlinedIcon style={{ fontSize: 16 }} />}>
              Personal Information
            </SectionTitle>
            <div className="flex flex-col gap-4">
              <TextInput
                label="Full Name" required
                value={form.name}
                onChange={(v) => setField("name", v)}
                placeholder="e.g. Kasun Perera"
                icon={<PersonOutlinedIcon style={{ fontSize: 16 }} />}
                error={errors.name}
              />
              <TextInput
                label="Email Address" required
                type="email"
                value={form.email}
                onChange={(v) => setField("email", v)}
                placeholder="e.g. kasun@example.com"
                icon={<EmailOutlinedIcon style={{ fontSize: 16 }} />}
                error={errors.email}
              />
            </div>
          </SectionCard>

          {/* Password */}
          <SectionCard>
            <SectionTitle icon={<LockOutlinedIcon style={{ fontSize: 16 }} />}>
              Set Password
            </SectionTitle>
            <div className="flex flex-col gap-4">
              <TextInput
                label="Password" required
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(v) => setField("password", v)}
                placeholder="Min. 8 characters"
                icon={<LockOutlinedIcon style={{ fontSize: 16 }} />}
                error={errors.password}
                suffix={
                  <button
                    onClick={() => setShowPw((p) => !p)}
                    className="cursor-pointer border-none bg-transparent flex items-center"
                    style={{ color: "#bbb" }}
                  >
                    {showPw
                      ? <VisibilityOffOutlinedIcon style={{ fontSize: 17 }} />
                      : <VisibilityOutlinedIcon style={{ fontSize: 17 }} />
                    }
                  </button>
                }
              />

              {/* Strength bar */}
              {form.password && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Password strength</span>
                    <span style={{ ...INTER, fontSize: 11, fontWeight: 700, color: pwStrength.color }}>{pwStrength.label}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full transition-all duration-300"
                        style={{ height: 5, backgroundColor: i <= pwStrength.level ? pwStrength.color : "#f0f0f0" }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex flex-col gap-1">
                    {[
                      { rule: form.password.length >= 8,          label: "At least 8 characters" },
                      { rule: /[A-Z]/.test(form.password),        label: "One uppercase letter" },
                      { rule: /[0-9]/.test(form.password),        label: "One number" },
                      { rule: /[^A-Za-z0-9]/.test(form.password), label: "One special character" },
                    ].map(({ rule, label }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: rule ? "#16a34a" : "#e0e0e0" }} />
                        <span style={{ ...INTER, fontSize: 11, color: rule ? "#16a34a" : "#bbb", fontWeight: 500 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <TextInput
                label="Confirm Password" required
                type={showCPw ? "text" : "password"}
                value={form.confirm_password}
                onChange={(v) => setField("confirm_password", v)}
                placeholder="Re-enter password"
                icon={<LockOutlinedIcon style={{ fontSize: 16 }} />}
                error={errors.confirm_password}
                suffix={
                  <button
                    onClick={() => setShowCPw((p) => !p)}
                    className="cursor-pointer border-none bg-transparent flex items-center"
                    style={{ color: "#bbb" }}
                  >
                    {showCPw
                      ? <VisibilityOffOutlinedIcon style={{ fontSize: 17 }} />
                      : <VisibilityOutlinedIcon style={{ fontSize: 17 }} />
                    }
                  </button>
                }
              />
            </div>
          </SectionCard>

        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="flex flex-col gap-5">

          {/* Preview card */}
          <SectionCard>
            <SectionTitle icon={<PersonOutlinedIcon style={{ fontSize: 16 }} />}>
              Preview
            </SectionTitle>
            <div className="flex flex-col items-center gap-3 py-4">
              {/* Avatar */}
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{ width: 72, height: 72, backgroundColor: avatarBg }}
              >
                <span style={{ ...SORA, fontSize: 24, fontWeight: 900, color: "#fff" }}>{initials}</span>
              </div>
              <div className="text-center">
                <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>
                  {form.name || "Full Name"}
                </p>
                <p style={{ ...INTER, fontSize: 11, color: "#bbb", marginTop: 3 }}>
                  {form.email || "email@example.com"}
                </p>
              </div>
              {/* Role badge */}
              {(() => {
                const r = ROLES.find((x) => x.value === form.role);
                return r ? (
                  <span
                    className="flex items-center gap-1 px-3 py-1 rounded-full"
                    style={{ ...INTER, fontSize: 11, fontWeight: 700, backgroundColor: r.bg, color: r.color, border: `1px solid ${r.border}` }}
                  >
                    {r.icon} {r.label}
                  </span>
                ) : null;
              })()}
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: form.is_active ? "#16a34a" : "#e53935" }} />
                <span style={{ ...INTER, fontSize: 11, fontWeight: 700, color: form.is_active ? "#15803d" : "#dc2626" }}>
                  {form.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </SectionCard>

          {/* Role picker */}
          <SectionCard>
            <SectionTitle icon={<ShieldOutlinedIcon style={{ fontSize: 16 }} />}>
              Assign Role
            </SectionTitle>
            <div className="flex flex-col gap-2.5">
              {ROLES.map((role) => {
                const active = form.role === role.value;
                return (
                  <button
                    key={role.value}
                    onClick={() => setField("role", role.value)}
                    className="flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 text-left cursor-pointer transition-all w-full"
                    style={{
                      backgroundColor: active ? role.activeBg : "#f9f9f9",
                      borderColor: active ? role.border : "#f0f0f0",
                    }}
                  >
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
                      style={{ backgroundColor: active ? role.bg : "#f0f0f0", color: active ? role.color : "#aaa" }}
                    >
                      {role.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span style={{ ...SORA, fontSize: 12, fontWeight: 800, color: active ? role.color : "#111" }}>
                        {role.label}
                      </span>
                      <span style={{ ...INTER, fontSize: 11, color: "#888", lineHeight: 1.5 }}>
                        {role.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {/* Active status */}
          <SectionCard>
            <SectionTitle icon={<InfoOutlinedIcon style={{ fontSize: 16 }} />}>
              Account Status
            </SectionTitle>
            <div
              className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0" }}
            >
              <div>
                <p style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#111" }}>Active Account</p>
                <p style={{ ...INTER, fontSize: 11, color: "#aaa", marginTop: 2 }}>Admin can log in immediately</p>
              </div>
              <button
                onClick={() => setField("is_active", !form.is_active)}
                className="relative flex-shrink-0 transition-all cursor-pointer"
                style={{
                  width: 44, height: 24, borderRadius: 999,
                  backgroundColor: form.is_active ? "#111" : "#e0e0e0",
                  border: "none", padding: 0,
                }}
              >
                <div
                  className="absolute top-1 transition-all duration-200"
                  style={{
                    width: 16, height: 16, borderRadius: "50%",
                    backgroundColor: "#fff",
                    left: form.is_active ? 24 : 4,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                  }}
                />
              </button>
            </div>
          </SectionCard>

          <button
            onClick={handleSave}
            disabled={apiLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white transition-all cursor-pointer disabled:opacity-60"
            style={{ ...SORA, fontSize: 14, fontWeight: 800, backgroundColor: saved ? "#16a34a" : "#111", border: "none" }}
          >
            {apiLoading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Admin…</>
            ) : saved ? (
              <><CheckCircleOutlinedIcon style={{ fontSize: 18 }} /> Admin Created!</>
            ) : (
              <><SaveOutlinedIcon style={{ fontSize: 18 }} /> Create Admin</>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
