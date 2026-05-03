import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalOfferOutlinedIcon   from "@mui/icons-material/LocalOfferOutlined";
import BoltOutlinedIcon         from "@mui/icons-material/BoltOutlined";
import Inventory2OutlinedIcon   from "@mui/icons-material/Inventory2Outlined";
import AccessTimeOutlinedIcon   from "@mui/icons-material/AccessTimeOutlined";

// ─── Font constants ───────────────────────────────────────────────────────────
// Applied ONLY on leaf elements via style prop — never on wrapper divs,
// which would cascade into Navbar / Footer / other global components.
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Tag icon map ─────────────────────────────────────────────────────────────
const TAG_ICON = {
  "Flash Deal":  <BoltOutlinedIcon style={{ fontSize: 11 }} />,
  "Bundle Deal": <Inventory2OutlinedIcon style={{ fontSize: 11 }} />,
  "Clearance":   <LocalOfferOutlinedIcon style={{ fontSize: 11 }} />,
};

// ─── Countdown helper ─────────────────────────────────────────────────────────
function calcTime(targetDate) {
  const diff = new Date(targetDate) - new Date();
  if (diff <= 0) return { d: 0, h: 0, m: 0 };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
  };
}

// ─── TimeUnit sub-component ───────────────────────────────────────────────────
function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[15px] font-black text-[#111] leading-none" style={SORA}>
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] font-medium text-gray-400 uppercase tracking-wider" style={INTER}>
        {label}
      </span>
    </div>
  );
}

// ─── OfferCard ────────────────────────────────────────────────────────────────
// Props:
//   offer: {
//     id, tag, tagColor, title, category,
//     originalPrice, discountedPrice, discountPercent,
//     badge, image, specs, validUntil, inStock
//   }
//   onAddToCart: (offer) => void   — optional callback

const OfferCard = ({ offer, onAddToCart = () => {} }) => {
  const { d, h, m } = calcTime(offer.validUntil);
  const savings = offer.originalPrice - offer.discountedPrice;
  const isRed   = offer.tagColor === "red";

  return (
    <div className="relative bg-white border border-[#e6e6e6] rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]">

      {/* ── Tag ribbon (top-left) ── */}
      <div
        className={`absolute top-3 left-0 z-10 flex items-center gap-1 pl-2.5 pr-3 py-[3px] rounded-r-md text-white uppercase
          ${isRed ? "bg-red-500" : "bg-[#111]"}`}
        style={{ ...SORA, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}
      >
        {TAG_ICON[offer.tag]}
        {offer.tag}
      </div>

      {/* ── Discount badge (top-right) ── */}
      <div
        className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-0.5 rounded-lg leading-none"
        style={{ ...SORA, fontSize: 12, fontWeight: 900 }}
      >
        −{offer.discountPercent}%
      </div>

      {/* ── Image area ── */}
      <div className="relative w-full bg-[#fafafa] border-b border-[#f0f0f0]" style={{ paddingTop: "62%" }}>
        <img
          src={offer.image}
          alt={offer.title}
          className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
        />

        {/* Stock pill */}
        <div
          className={`absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-white border border-[#ccc] rounded-full px-3 py-[3px]
            ${offer.inStock ? "text-green-700" : "text-red-500"}`}
          style={{ ...INTER, fontSize: 10, fontWeight: 600 }}
        >
          <span className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${offer.inStock ? "bg-green-600" : "bg-red-500"}`} />
          {offer.inStock ? "In Stock" : "Out of Stock"}
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-2.5">

        {/* Category + optional badge */}
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"
            style={INTER}
          >
            {offer.category}
          </span>
          {offer.badge && (
            <span
              className="px-2 py-[2px] rounded-full border border-[#111] text-[#111] uppercase tracking-wider"
              style={{ ...INTER, fontSize: 9, fontWeight: 700 }}
            >
              {offer.badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-bold text-[#111] uppercase leading-snug line-clamp-2"
          style={{ ...INTER, fontSize: 13, letterSpacing: "0.01em" }}
        >
          {offer.title}
        </h3>

        {/* Specs */}
        <ul className="flex flex-col gap-1 flex-1">
          {offer.specs.map((s, i) => (
            <li
              key={i}
              className="flex items-center gap-1.5 text-gray-500"
              style={{ ...INTER, fontSize: 11, fontWeight: 500 }}
            >
              <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div className="flex items-end justify-between pt-2.5 border-t border-[#f0f0f0]">
          <div className="flex flex-col gap-0.5">
            <span
              className="text-gray-400 line-through"
              style={{ ...INTER, fontSize: 11, fontWeight: 500 }}
            >
              Rs {offer.originalPrice.toLocaleString()}
            </span>
            <span
              className="text-[#111] leading-none"
              style={{ ...SORA, fontSize: 18, fontWeight: 900, letterSpacing: "-0.5px" }}
            >
              Rs {offer.discountedPrice.toLocaleString()}
            </span>
          </div>
          <div
            className="text-red-500 bg-red-50 px-2 py-1 rounded-lg whitespace-nowrap"
            style={{ ...INTER, fontSize: 10, fontWeight: 700 }}
          >
            Save Rs {savings.toLocaleString()}
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2.5 bg-[#f9f9f9] border border-[#ebebeb] rounded-xl px-3 py-2">
          <AccessTimeOutlinedIcon style={{ fontSize: 14, color: "#bbb" }} />
          <span
            className="text-gray-400 uppercase tracking-wider flex-shrink-0"
            style={{ ...INTER, fontSize: 10, fontWeight: 700 }}
          >
            Ends in
          </span>
          <div className="flex items-center gap-1.5">
            <TimeUnit value={d} label="Days" />
            <span className="font-black text-gray-300 mb-3" style={{ ...SORA, fontSize: 13 }}>:</span>
            <TimeUnit value={h} label="Hrs" />
            <span className="font-black text-gray-300 mb-3" style={{ ...SORA, fontSize: 13 }}>:</span>
            <TimeUnit value={m} label="Min" />
          </div>
        </div>

        {/* CTA */}
        <button
          disabled={!offer.inStock}
          onClick={() => onAddToCart(offer)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-150
            ${offer.inStock
              ? "bg-[#111] text-white hover:bg-[#333] cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          style={{ ...SORA, fontSize: 13, fontWeight: 700, letterSpacing: "0.02em" }}
        >
          <ShoppingCartOutlinedIcon style={{ fontSize: 17 }} />
          {offer.inStock ? "Add to Cart" : "Out of Stock"}
        </button>

      </div>
    </div>
  );
};

export default OfferCard;
