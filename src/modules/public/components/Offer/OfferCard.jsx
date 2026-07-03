import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalOfferOutlinedIcon   from "@mui/icons-material/LocalOfferOutlined";
import BoltOutlinedIcon         from "@mui/icons-material/BoltOutlined";
import Inventory2OutlinedIcon   from "@mui/icons-material/Inventory2Outlined";
import AccessTimeOutlinedIcon   from "@mui/icons-material/AccessTimeOutlined";
import VisibilityOutlinedIcon   from "@mui/icons-material/VisibilityOutlined";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const TAG_ICON = {
  "Flash Deal":  <BoltOutlinedIcon style={{ fontSize: 11 }} />,
  "Bundle Deal": <Inventory2OutlinedIcon style={{ fontSize: 11 }} />,
  "Clearance":   <LocalOfferOutlinedIcon style={{ fontSize: 11 }} />,
};

function calcTime(targetDate) {
  const diff = new Date(targetDate) - new Date();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

const OfferCard = ({ offer, onAddToCart = () => {} }) => {
  const navigate = useNavigate();
  const countdownTarget = offer.countdownTarget || offer.validUntil;
  const countdownLabel  = offer.countdownLabel  || (offer.offerState === "upcoming" ? "Starts In" : "Ends In");
  const isUpcoming = offer.offerState === "upcoming";
  const [timeLeft, setTimeLeft] = useState(() => calcTime(countdownTarget));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calcTime(countdownTarget));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdownTarget]);

  const savings = offer.originalPrice - offer.discountedPrice;
  const isRed   = offer.tagColor === "red";

  return (
    <div className="relative bg-white border border-[#e6e6e6] rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]">

      {/* ── Tag ribbon (top-left) ── */}
      <div
        className={`absolute top-2.5 left-0 z-10 flex items-center gap-1 pl-2 pr-2.5 py-0.5 rounded-r-md text-white uppercase
          ${isRed ? "bg-red-500" : "bg-[#111]"}`}
        style={{ ...SORA, fontSize: 9, fontWeight: 700, letterSpacing: "0.05em" }}
      >
        {TAG_ICON[offer.tag]}
        {offer.tag}
      </div>

      {/* ── Discount badge (top-right) ── */}
      <div
        className="absolute top-2.5 right-2.5 z-10 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 rounded-lg leading-none"
        style={{ ...SORA, fontSize: 11, fontWeight: 900 }}
      >
        −{offer.discountPercent}%
      </div>

      {/* ── Image area ── */}
      <div className="relative w-full bg-[#fafafa] border-b border-[#f0f0f0]" style={{ paddingTop: "62%" }}>
        <img
          src={offer.displayImage}
          alt={offer.title}
          className="absolute inset-0 w-full h-full object-contain p-3 sm:p-4 transition-transform duration-300 hover:scale-105"
        />

        {/* Stock pill */}
        <div
          className={`absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 flex items-center gap-1 sm:gap-1.5 bg-white border border-[#ccc] rounded-full px-2 sm:px-3 py-0.5
            ${isUpcoming ? "text-blue-700" : offer.inStock ? "text-green-700" : "text-red-500"}`}
          style={{ ...INTER, fontSize: 9, fontWeight: 600 }}
        >
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isUpcoming ? "bg-blue-600" : offer.inStock ? "bg-green-600" : "bg-red-500"}`} />
          {isUpcoming ? "Coming Soon" : offer.inStock ? "In Stock" : "Out of Stock"}
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 px-2.5 sm:px-4 pt-2.5 sm:pt-3 pb-3 sm:pb-4 gap-2 sm:gap-2.5">

        {/* Category + optional badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest"
            style={INTER}
          >
            {offer.category}
          </span>
          {offer.badge && (
            <span
              className="px-1.5 sm:px-2 py-0.5 rounded-full border border-[#111] text-[#111] uppercase tracking-wider"
              style={{ ...INTER, fontSize: 8, fontWeight: 700 }}
            >
              {offer.badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-bold text-[#111] uppercase leading-snug line-clamp-2 text-[11px] sm:text-[13px]"
          style={{ ...INTER, letterSpacing: "0.01em" }}
        >
          {offer.title}
        </h3>

        {/* Specs — 3 on mobile, all on desktop */}
        <ul className="flex flex-col gap-0.5 sm:gap-1 flex-1">
          {offer.specs.slice(0, 3).map((s, i) => (
            <li
              key={`m-${i}`}
              className="flex items-center gap-1.5 text-gray-500 sm:hidden"
              style={{ ...INTER, fontSize: 10, fontWeight: 500 }}
            >
              <span className="w-1 h-1 rounded-full shrink-0 bg-gray-300" />
              {s}
            </li>
          ))}
          {offer.specs.map((s, i) => (
            <li
              key={`d-${i}`}
              className="hidden sm:flex items-center gap-1.5 text-gray-500"
              style={{ ...INTER, fontSize: 11, fontWeight: 500 }}
            >
              <span className="w-1 h-1 rounded-full shrink-0 bg-gray-300" />
              {s}
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div className="flex items-end justify-between pt-2 sm:pt-2.5 border-t border-[#f0f0f0]">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span
              className="text-gray-400 line-through text-[10px] sm:text-[11px]"
              style={{ ...INTER, fontWeight: 500 }}
            >
              Rs {offer.originalPrice.toLocaleString()}
            </span>
            <span
              className="text-[#111] leading-none text-[14px] sm:text-[18px]"
              style={{ ...SORA, fontWeight: 900, letterSpacing: "-0.5px" }}
            >
              Rs {offer.discountedPrice.toLocaleString()}
            </span>
          </div>
          <div
            className="text-red-500 bg-red-50 px-1.5 sm:px-2 py-1 rounded-lg whitespace-nowrap shrink-0 ml-2 text-[9px] sm:text-[10px]"
            style={{ ...INTER, fontWeight: 700 }}
          >
            Save Rs {savings.toLocaleString()}
          </div>
        </div>

        {/* ── Countdown — grid layout, never overflows ── */}
        <div className="flex flex-col gap-1 bg-[#f9f9f9] border border-[#ebebeb] rounded-xl px-2.5 py-2">
          {/* Label row */}
          <div className="flex items-center gap-1.5">
            <AccessTimeOutlinedIcon style={{ fontSize: 12, color: "#bbb", flexShrink: 0 }} />
            <span
              className="text-gray-400 uppercase tracking-wider"
              style={{ ...INTER, fontSize: 9, fontWeight: 700 }}
            >
              {countdownLabel}
            </span>
          </div>

          {/* Timer row — 4-column grid, always fits */}
          <div className="grid grid-cols-4 w-full gap-1">
            {[
              { value: timeLeft.d, label: "Days" },
              { value: timeLeft.h, label: "Hrs"  },
              { value: timeLeft.m, label: "Min"  },
              { value: timeLeft.s, label: "Sec"  },
            ].map(({ value, label }, i, arr) => (
              <div
                key={label}
                className="relative flex flex-col items-center justify-center py-1.5 bg-white border border-[#ebebeb] rounded-lg"
              >
                <span
                  className="text-[12px] sm:text-[13px] font-black text-[#111] leading-none tabular-nums"
                  style={SORA}
                >
                  {String(value).padStart(2, "0")}
                </span>
                <span
                  className="text-[8px] font-medium text-gray-400 uppercase tracking-wider mt-0.5"
                  style={INTER}
                >
                  {label}
                </span>
                {/* Colon separator between cells */}
                {i < arr.length - 1 && (
                  <span
                    className="absolute -right-2 top-1/2 -translate-y-[60%] font-black text-gray-300 text-[10px] z-10"
                    style={SORA}
                  >
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <button
            disabled={!offer.inStock || isUpcoming}
            onClick={() => onAddToCart(offer)}
            className={`w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl transition-all duration-150
              ${offer.inStock && !isUpcoming
                ? "bg-[#111] text-white hover:bg-[#333] cursor-pointer active:translate-y-0.5"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            style={{ ...SORA, fontSize: 12, fontWeight: 700, letterSpacing: "0.02em" }}
          >
            <ShoppingCartOutlinedIcon style={{ fontSize: 15 }} />
            {isUpcoming ? "Coming Soon" : offer.inStock ? "Add to Cart" : "Out of Stock"}
          </button>

          <button
            onClick={() => navigate(`/offers/${offer.id}`)}
            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl border border-[#e5e5e5] bg-white text-[#111] hover:border-[#111] hover:bg-[#f9f9f9] cursor-pointer transition-all duration-150"
            style={{ ...SORA, fontSize: 12, fontWeight: 700, letterSpacing: "0.02em" }}
          >
            <VisibilityOutlinedIcon style={{ fontSize: 15 }} /> View More
          </button>
        </div>

      </div>
    </div>
  );
};

export default OfferCard;