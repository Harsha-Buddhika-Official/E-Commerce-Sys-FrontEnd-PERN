import OfferCard from "../components/Offer/OfferCard";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState } from "react";
import { useOffers } from "../features/offers/hooks/useOffers";
import { addProductToServer } from "../features/cart/service/cart.service.js";

// ─── Font constants (page-level text only) ────────────────────────────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── OffersPage ───────────────────────────────────────────────────────────────
const OffersPage = () => {
  const [activeTab, setActiveTab] = useState("active");
  const { offers, loading, error } = useOffers(activeTab);

  const tabs = [
    { key: "active", label: "Active Offers" },
    { key: "upcoming", label: "Upcoming Offers" },
  ];

  const handleAddToCart = async (offer) => {
    // Use productId from the embedded product, not offer.id
    if (offer?.productId) {
      try {

        const result = await addProductToServer(offer.productId);

        // Dispatch event to show success notification
        window.dispatchEvent(
          new CustomEvent("cart:item-added", {
            detail: { message: `${offer.title} added to cart` },
          })
        );
      } catch (error) {
        console.error(`[Offers] Add to cart failed:`, error);
      }
    } else {
      console.warn(`[Offers] No product ID found for offer:`, offer);
    }
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
        <div className="flex items-center justify-center gap-2.5 mb-7 flex-wrap">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border-[1.5px] transition-all duration-150
                  ${isActive
                    ? "bg-[#111] border-[#111] text-white"
                    : "bg-white border-gray-300 text-gray-600 hover:border-[#111] hover:text-[#111]"
                  }`}
                style={{ ...SORA, fontSize: 13, fontWeight: 600 }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">Loading offers...</p>
          </div>
        )}

        {/* ── Error state ── */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-sm">Failed to load offers: {error}</p>
          </div>
        )}

        {/* ── Offers grid ── */}
        {!loading && !error && (
          <div className="offers-grid grid gap-5">
            {offers.length > 0 ? (
              offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p
                  className="text-gray-400 mb-2"
                  style={{ ...SORA, fontSize: 24, fontWeight: 700 }}
                >
                  {activeTab === "upcoming" ? "No upcoming offers right now 😴" : "No active offers right now 😴"}
                </p>
                <p
                  className="text-gray-400"
                  style={{ ...INTER, fontSize: 13, fontWeight: 400 }}
                >
                  {activeTab === "upcoming"
                    ? "Check back soon for scheduled deals on your favorite PC components!"
                    : "Check back soon for amazing deals on your favorite PC components!"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Footer disclaimer ── */}
        {!loading && !error && offers.length > 0 && (
          <div className="flex items-center gap-2 mt-10 px-5 py-3.5 bg-white border border-[#e6e6e6] rounded-xl text-gray-400">
            <InfoOutlinedIcon style={{ fontSize: 16, color: "#ccc", flexShrink: 0 }} />
            <span style={{ ...INTER, fontSize: 12, fontWeight: 500 }}>
              Prices are subject to change without prior notice. All offers are valid while stocks last.
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

export default OffersPage;
