import OfferCard from "../components/Offer/OfferCard";
import { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// ─── Font constants (page-level text only) ────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Offers data ──────────────────────────────────────────────────────────────
// Replace with an API call / service import when ready.
const OFFERS = [
  {
    id: 1, tag: "Flash Deal", tagColor: "red",
    title: "Intel Core i9-14900K", category: "Processors",
    originalPrice: 189900, discountedPrice: 159900, discountPercent: 16,
    badge: "Best Seller",
    image: "https://placehold.co/280x200/f5f5f5/252525?text=i9-14900K",
    specs: ["24 Cores / 32 Threads", "Up to 6.0 GHz Boost", "36MB Cache", "LGA1700 Socket"],
    validUntil: "2026-09-30", inStock: true,
  },
  {
    id: 2, tag: "Bundle Deal", tagColor: "black",
    title: "RTX 4070 Super 12GB", category: "Graphics Cards",
    originalPrice: 299900, discountedPrice: 269900, discountPercent: 10,
    badge: "Hot",
    image: "https://placehold.co/280x200/f5f5f5/252525?text=RTX+4070S",
    specs: ["12GB GDDR6X", "DLSS 3.5", "4K Ready", "2560 CUDA Cores"],
    validUntil: "2026-10-15", inStock: true,
  },
  {
    id: 3, tag: "Clearance", tagColor: "red",
    title: "Samsung 990 Pro 2TB NVMe", category: "Storage",
    originalPrice: 79900, discountedPrice: 62900, discountPercent: 21,
    badge: "Limited Stock",
    image: "https://placehold.co/280x200/f5f5f5/252525?text=990+Pro",
    specs: ["2TB Capacity", "7,450 MB/s Read", "PCIe 4.0 x4", "M.2 2280"],
    validUntil: "2026-09-20", inStock: true,
  },
  {
    id: 4, tag: "Flash Deal", tagColor: "red",
    title: "G.Skill Trident Z5 RGB 32GB", category: "Memory",
    originalPrice: 49900, discountedPrice: 38900, discountPercent: 22,
    badge: null,
    image: "https://placehold.co/280x200/f5f5f5/252525?text=Trident+Z5",
    specs: ["32GB (2x16GB)", "DDR5-6000", "CL30 Latency", "Intel XMP 3.0"],
    validUntil: "2026-09-25", inStock: true,
  },
  {
    id: 5, tag: "Bundle Deal", tagColor: "black",
    title: "ASUS ROG Strix B650-E", category: "Motherboards",
    originalPrice: 119900, discountedPrice: 99900, discountPercent: 17,
    badge: "New",
    image: "https://placehold.co/280x200/f5f5f5/252525?text=B650-E",
    specs: ["AM5 Socket", "DDR5 Support", "PCIe 5.0", "WiFi 6E"],
    validUntil: "2026-10-01", inStock: false,
  },
  {
    id: 6, tag: "Clearance", tagColor: "red",
    title: "Corsair RM1000x 1000W", category: "Power Supply",
    originalPrice: 69900, discountedPrice: 54900, discountPercent: 21,
    badge: null,
    image: "https://placehold.co/280x200/f5f5f5/252525?text=RM1000x",
    specs: ["1000W Output", "80+ Gold", "Fully Modular", "135mm Fan"],
    validUntil: "2026-09-28", inStock: true,
  },
  {
    id: 7, tag: "Flash Deal", tagColor: "red",
    title: 'LG 27GP850-B 27" QHD', category: "Monitors",
    originalPrice: 139900, discountedPrice: 114900, discountPercent: 18,
    badge: "Best Seller",
    image: "https://placehold.co/280x200/f5f5f5/252525?text=LG+27GP850",
    specs: ['27" QHD 2560×1440', "165Hz Refresh", "1ms Response", "Nano IPS"],
    validUntil: "2026-10-10", inStock: true,
  },
  {
    id: 8, tag: "Bundle Deal", tagColor: "black",
    title: "Noctua NH-D15 CPU Cooler", category: "Cooling",
    originalPrice: 34900, discountedPrice: 28900, discountPercent: 17,
    badge: null,
    image: "https://placehold.co/280x200/f5f5f5/252525?text=NH-D15",
    specs: ["Dual Tower Design", "NF-A15 Fans", "280W TDP", "LGA1700 Ready"],
    validUntil: "2026-10-05", inStock: true,
  },
];

const FILTERS = ["All", "Flash Deal", "Bundle Deal", "Clearance"];

// ─── OffersPage ───────────────────────────────────────────────────────────────
const OffersPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? OFFERS
      : OFFERS.filter((o) => o.tag === activeFilter);

  const handleAddToCart = (offer) => {
    console.log("Added to cart:", offer.id, offer.title);
  };

  return (
    // No fontFamily on root div — cascades into Navbar/Footer/etc.
    <div className="w-full min-h-screen bg-[#f5f5f5]">

      {/* Scoped responsive styles — class names are unique to this page */}
      <style>{`
        .offers-padded { padding-left: 350px; padding-right: 350px; }
        @media (max-width: 1600px) { .offers-padded { padding-left: 160px; padding-right: 160px; } }
        @media (max-width: 1280px) { .offers-padded { padding-left: 60px;  padding-right: 60px;  } }
        @media (max-width: 1024px) { .offers-padded { padding-left: 32px;  padding-right: 32px;  } }
        @media (max-width: 640px)  { .offers-padded { padding-left: 16px;  padding-right: 16px;  } }

        .offers-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1200px) { .offers-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 860px)  { .offers-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px)  { .offers-grid { grid-template-columns: repeat(1, 1fr); } }
      `}</style>

      <div className="offers-padded pt-10 pb-16">

        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center mb-8">
          <h1
            className="text-[#111] leading-none mb-2"
            style={{ ...SORA, fontSize: 48, fontWeight: 900, letterSpacing: "-1.5px" }}
          >
            Offers & Deals
          </h1>
          <p
            className="text-gray-400"
            style={{ ...INTER, fontSize: 15, fontWeight: 400 }}
          >
            Exclusive discounts on top PC components — updated weekly.
          </p>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex items-center gap-2.5 mb-7 flex-wrap">
          {FILTERS.map((f) => {
            const count    = f === "All" ? OFFERS.length : OFFERS.filter((o) => o.tag === f).length;
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border-[1.5px] transition-all duration-150
                  ${isActive
                    ? "bg-[#111] border-[#111] text-white"
                    : "bg-white border-gray-300 text-gray-600 hover:border-[#111] hover:text-[#111]"
                  }`}
                style={{ ...SORA, fontSize: 13, fontWeight: 600 }}
              >
                {f}
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full
                    ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}
                  style={{ ...SORA, fontSize: 10, fontWeight: 700 }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Offers grid ── */}
        <div className="offers-grid grid gap-5">
          {filtered.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* ── Footer disclaimer ── */}
        <div className="flex items-center gap-2 mt-10 px-5 py-3.5 bg-white border border-[#e6e6e6] rounded-xl text-gray-400">
          <InfoOutlinedIcon style={{ fontSize: 16, color: "#ccc", flexShrink: 0 }} />
          <span style={{ ...INTER, fontSize: 12, fontWeight: 500 }}>
            Prices are subject to change without prior notice. All offers are valid while stocks last.
          </span>
        </div>

      </div>
    </div>
  );
};

export default OffersPage;
