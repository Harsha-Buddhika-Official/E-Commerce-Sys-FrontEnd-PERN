import { useState }              from "react";
import { useNavigate }           from "react-router-dom";
import { SORA, INTER }           from "../../../../styles/fonts.js";

import CheckCircleOutlinedIcon   from "@mui/icons-material/CheckCircleOutlined";
import TagOutlinedIcon            from "@mui/icons-material/TagOutlined";
import HomeOutlinedIcon           from "@mui/icons-material/HomeOutlined";
import ContentCopyOutlinedIcon    from "@mui/icons-material/ContentCopyOutlined";
import DoneAllOutlinedIcon        from "@mui/icons-material/DoneAllOutlined";

export default function OrderSuccessScreen({ orderResult, rows }) {
  const navigate          = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!orderResult.tracking_code) return;
    navigator.clipboard.writeText(orderResult.tracking_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // ── Full-screen fixed overlay ──────────────────────────────────────────
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">

      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
      />

      {/* ── Centred modal card ── */}
      <div
        className="relative flex flex-col bg-white rounded-2xl overflow-hidden w-full"
        style={{
          maxWidth: 500,
          maxHeight: "90vh",
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

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center gap-5">

          {/* Success icon */}
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl"
            style={{ backgroundColor: "#f0fdf4" }}
          >
            <CheckCircleOutlinedIcon style={{ fontSize: 36, color: "#16a34a" }} />
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>
              Order Placed!
            </h2>
            <p style={{ ...INTER, fontSize: 13, color: "#777", marginTop: 6, lineHeight: 1.7 }}>
              Your order has been submitted successfully. We'll confirm via email shortly.
            </p>
          </div>

          {/* Tracking code — clickable to copy */}
          {orderResult.tracking_code && (
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all cursor-pointer"
              style={{
                backgroundColor: copied ? "#f0fdf4" : "#f0fdf4",
                border: `1px solid ${copied ? "#16a34a" : "#bbf7d0"}`,
              }}
              title="Click to copy tracking code"
            >
              <div className="flex items-center gap-2">
                <TagOutlinedIcon style={{ fontSize: 16, color: "#16a34a" }} />
                <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#15803d" }}>
                  Tracking Code
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ ...SORA, fontSize: 14, fontWeight: 900, color: "#111", letterSpacing: "0.05em" }}>
                  {orderResult.tracking_code}
                </span>
                {copied
                  ? <DoneAllOutlinedIcon style={{ fontSize: 15, color: "#16a34a" }} />
                  : <ContentCopyOutlinedIcon style={{ fontSize: 15, color: "#aaa" }} />
                }
              </div>
            </button>
          )}

          {/* Order details table */}
          <div
            className="w-full px-5 py-4 rounded-xl"
            style={{ backgroundColor: "#f9f9f9", border: "1px solid #ebebeb" }}
          >
            <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
              Order Details
            </p>
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between items-start py-1.5"
                style={{ borderBottom: "1px solid #f0f0f0" }}
              >
                <span style={{ ...INTER, fontSize: 12, color: "#aaa", fontWeight: 600 }}>{label}</span>
                <span style={{
                  ...INTER, fontSize: 12, color: "#111", fontWeight: 700,
                  textAlign: "right", maxWidth: "60%",
                  textTransform: label === "Status" ? "capitalize" : "none",
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sticky footer ── */}
        <div
          className="shrink-0 px-6 py-4"
          style={{ borderTop: "1px solid #f0f0f0", backgroundColor: "#fff" }}
        >
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white transition-all cursor-pointer"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}
          >
            <HomeOutlinedIcon style={{ fontSize: 17 }} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}