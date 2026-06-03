import { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useUpdatePassword } from "../../features/admin/hooks/useUpdatePassword.js";

const SORA = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Password strength ────────────────────────────────────────────────────────
const getStrength = (pw) => {
  if (!pw) return { level: 0, label: "", color: "#e0e0e0" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return [
    { level: 0, label: "", color: "#e0e0e0" },
    { level: 1, label: "Weak", color: "#e53935" },
    { level: 2, label: "Fair", color: "#f97316" },
    { level: 3, label: "Good", color: "#eab308" },
    { level: 4, label: "Strong", color: "#16a34a" },
  ][score];
};

const RULES = [
  { test: (pw) => pw.length >= 8, label: "At least 8 characters" },
  { test: (pw) => /[A-Z]/.test(pw), label: "One uppercase letter" },
  { test: (pw) => /[0-9]/.test(pw), label: "One number" },
  { test: (pw) => /[^A-Za-z0-9]/.test(pw), label: "One special character" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionCard({ children }) {
  return (
    <div
      className="bg-white rounded-2xl p-6"
      style={{
        border: "1px solid #ebebeb",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <div
      className="flex items-center gap-2.5 mb-5 pb-3"
      style={{ borderBottom: "1px solid #f0f0f0" }}
    >
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
        style={{ backgroundColor: "#f5f5f5", color: "#111" }}
      >
        {icon}
      </div>
      <span
        style={{
          ...SORA,
          fontSize: 14,
          fontWeight: 800,
          color: "#111",
          letterSpacing: "0.02em",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  show,
  onToggle,
  error,
  required,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <p
        style={{
          ...INTER,
          fontSize: 11,
          fontWeight: 700,
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom: 6,
        }}
      >
        {label}
        {required && <span style={{ color: "#e53935" }}> *</span>}
      </p>
      <div className="relative flex items-center">
        <div
          className="absolute left-3 pointer-events-none flex items-center"
          style={{ color: focused ? "#111" : "#bbb" }}
        >
          <LockOutlinedIcon style={{ fontSize: 16 }} />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full outline-none transition-all"
          style={{
            ...INTER,
            fontSize: 13,
            fontWeight: 600,
            color: "#111",
            padding: "10px 44px 10px 38px",
            borderRadius: 12,
            border: `1.5px solid ${error ? "#e53935" : focused ? "#111" : "#ebebeb"}`,
            backgroundColor: focused ? "#fff" : "#f9f9f9",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 flex items-center justify-center cursor-pointer border-none bg-transparent"
          style={{ color: "#bbb" }}
        >
          {show ? (
            <VisibilityOffOutlinedIcon style={{ fontSize: 17 }} />
          ) : (
            <VisibilityOutlinedIcon style={{ fontSize: 17 }} />
          )}
        </button>
      </div>
      {error && (
        <p
          className="flex items-center gap-1 mt-1.5"
          style={{ ...INTER, fontSize: 11, color: "#e53935" }}
        >
          <WarningAmberOutlinedIcon style={{ fontSize: 12 }} /> {error}
        </p>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function SettingsPage() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});

  // Use hook for password update logic
  const {
    saving,
    saved,
    error: apiError,
    updatePassword,
    reset,
  } = useUpdatePassword();

  const strength = getStrength(newPw);

  const validate = () => {
    const e = {};
    if (!currentPw.trim()) e.currentPw = "Current password is required.";
    if (!newPw) e.newPw = "New password is required.";
    else if (newPw.length < 8)
      e.newPw = "Password must be at least 8 characters.";
    else if (newPw === currentPw)
      e.newPw = "New password must differ from current password.";
    if (!confirmPw) e.confirmPw = "Please confirm your new password.";
    else if (newPw !== confirmPw) e.confirmPw = "Passwords do not match.";
    setValidationErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const success = await updatePassword({
      oldPassword: currentPw,
      newPassword: newPw,
      confirmPassword: confirmPw,
    });

    if (success) {
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setValidationErrors({});
    }
  };

  const handleChange = (setter, key) => (val) => {
    setter(val);
    reset();
    if (validationErrors[key]) {
      setValidationErrors((e) => {
        const n = { ...e };
        delete n[key];
        return n;
      });
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
            System / Settings
          </p>
          <h1
            style={{
              ...SORA,
              fontSize: 20,
              fontWeight: 900,
              color: "#111",
              letterSpacing: "-0.3px",
            }}
          >
            Settings
          </h1>
        </div>
      </div>

      {/* ── Layout: sidebar + content ── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* ── Left nav ── */}
        <div className="xl:col-span-1">
          <SectionCard>
            <p
              style={{
                ...INTER,
                fontSize: 10,
                fontWeight: 700,
                color: "#bbb",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 12,
              }}
            >
              Settings
            </p>
            <div className="flex flex-col gap-1">
              {/* Active item */}
              <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: "#111" }}
              >
                <SecurityOutlinedIcon style={{ fontSize: 16, color: "#fff" }} />
                <span
                  style={{
                    ...INTER,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  Password
                </span>
              </div>

              {/* Placeholder future items (inactive) */}
              {[
                {
                  icon: <SettingsOutlinedIcon style={{ fontSize: 16 }} />,
                  label: "General",
                  soon: true,
                },
                {
                  icon: <ShieldOutlinedIcon style={{ fontSize: 16 }} />,
                  label: "Permissions",
                  soon: true,
                },
              ].map(({ icon, label, soon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl"
                  style={{ opacity: 0.4 }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ color: "#888" }}>{icon}</span>
                    <span
                      style={{
                        ...INTER,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#555",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  {soon && (
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        ...INTER,
                        fontSize: 9,
                        fontWeight: 700,
                        backgroundColor: "#f0f0f0",
                        color: "#aaa",
                      }}
                    >
                      Soon
                    </span>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ── Right content ── */}
        <div className="xl:col-span-3 flex flex-col gap-5">
          {/* Success banner */}
          {saved && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
              }}
            >
              <CheckCircleOutlinedIcon
                style={{ fontSize: 18, color: "#16a34a", flexShrink: 0 }}
              />
              <p
                style={{
                  ...INTER,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#15803d",
                }}
              >
                Password updated successfully.
              </p>
            </div>
          )}

          {/* Error summary */}
          {Object.keys(validationErrors).length > 0 && (
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
              }}
            >
              <WarningAmberOutlinedIcon
                style={{
                  fontSize: 16,
                  color: "#e53935",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              />
              <div>
                <p
                  style={{
                    ...INTER,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#e53935",
                    marginBottom: 4,
                  }}
                >
                  Please fix the following:
                </p>
                {Object.values(validationErrors).map((err, i) => (
                  <p
                    key={i}
                    style={{ ...INTER, fontSize: 12, color: "#e53935" }}
                  >
                    • {err}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* API Error banner */}
          {apiError && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca",}}>
              <WarningAmberOutlinedIcon style={{ fontSize: 16, color: "#e53935", flexShrink: 0, marginTop: 1, }} />
              <p style={{...INTER,fontSize: 13,fontWeight: 600,color: "#e53935",}} >
                {apiError}
              </p>
            </div>
          )}

          {/* Change password card */}
          <SectionCard>
            <SectionTitle icon={<LockOutlinedIcon style={{ fontSize: 16 }} />}>
              Change Password
            </SectionTitle>

            <div className="flex flex-col gap-5">
              {/* Current password */}
              <PasswordField
                label="Current Password"
                required
                value={currentPw}
                onChange={handleChange(setCurrentPw, "currentPw")}
                placeholder="Enter your current password"
                show={showCurrent}
                onToggle={() => setShowCurrent((p) => !p)}
                error={validationErrors.currentPw}
              />

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: "#f5f5f5" }} />

              {/* New password */}
              <PasswordField
                label="New Password"
                required
                value={newPw}
                onChange={handleChange(setNewPw, "newPw")}
                placeholder="Min. 8 characters"
                show={showNew}
                onToggle={() => setShowNew((p) => !p)}
                error={validationErrors.newPw}
              />

              {/* Strength meter */}
              {newPw && (
                <div className="-mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        ...INTER,
                        fontSize: 11,
                        color: "#aaa",
                        fontWeight: 500,
                      }}
                    >
                      Password strength
                    </span>
                    <span
                      style={{
                        ...INTER,
                        fontSize: 11,
                        fontWeight: 700,
                        color: strength.color,
                      }}
                    >
                      {strength.label}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full transition-all duration-300"
                        style={{
                          height: 5,
                          backgroundColor:
                            i <= strength.level ? strength.color : "#f0f0f0",
                        }}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {RULES.map(({ test, label }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors"
                          style={{
                            backgroundColor: test(newPw)
                              ? "#16a34a"
                              : "#e0e0e0",
                          }}
                        />
                        <span
                          style={{
                            ...INTER,
                            fontSize: 11,
                            color: test(newPw) ? "#16a34a" : "#bbb",
                            fontWeight: 500,
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm password */}
              <PasswordField
                label="Confirm New Password"
                required
                value={confirmPw}
                onChange={handleChange(setConfirmPw, "confirmPw")}
                placeholder="Re-enter new password"
                show={showConfirm}
                onToggle={() => setShowConfirm((p) => !p)}
                error={validationErrors.confirmPw}
              />

              {/* Match indicator */}
              {confirmPw && newPw && (
                <div className="flex items-center gap-2 -mt-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        newPw === confirmPw ? "#16a34a" : "#e53935",
                    }}
                  />
                  <span
                    style={{
                      ...INTER,
                      fontSize: 11,
                      fontWeight: 600,
                      color: newPw === confirmPw ? "#16a34a" : "#e53935",
                    }}
                  >
                    {newPw === confirmPw
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </span>
                </div>
              )}

              {/* Save */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white transition-all cursor-pointer disabled:opacity-60"
                  style={{
                    ...SORA,
                    fontSize: 13,
                    fontWeight: 700,
                    backgroundColor: saved ? "#16a34a" : "#111",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!saving && !saved)
                      e.currentTarget.style.backgroundColor = "#222";
                  }}
                  onMouseLeave={(e) => {
                    if (!saving && !saved)
                      e.currentTarget.style.backgroundColor = "#111";
                  }}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                      Updating…
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircleOutlinedIcon style={{ fontSize: 16 }} />{" "}
                      Updated!
                    </>
                  ) : (
                    <>
                      <SaveOutlinedIcon style={{ fontSize: 16 }} /> Update
                      Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </SectionCard>

          {/* Security tips */}
          <SectionCard>
            <SectionTitle
              icon={<ShieldOutlinedIcon style={{ fontSize: 16 }} />}
            >
              Security Tips
            </SectionTitle>
            <div className="flex flex-col gap-3">
              {[
                {
                  tip: "Use a unique password not used on any other site or service.",
                },
                {
                  tip: "Include uppercase letters, numbers, and special characters.",
                },
                {
                  tip: "Avoid using your name, username, or easily guessable words.",
                },
                {
                  tip: "Change your password regularly, at least every 90 days.",
                },
              ].map(({ tip }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "#f5f5f5" }}
                  >
                    <span
                      style={{
                        ...SORA,
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#888",
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <p
                    style={{
                      ...INTER,
                      fontSize: 13,
                      color: "#666",
                      lineHeight: 1.6,
                    }}
                  >
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
