import OfferCard from "../components/Offer/OfferCard";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState } from "react";
import { useOffers } from "../features/offers/hooks/useOffers";
import { addProductToServer } from "../features/cart/service/cart.service.js";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const OfferSkeleton = () => (
  <div className="bg-white border border-[#e6e6e6] rounded-2xl overflow-hidden flex flex-col animate-pulse">
    <div className="w-full bg-gray-200" style={{ paddingTop: "62%" }} />
    <div className="flex flex-col gap-3 px-4 pt-3 pb-4">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
      <div className="h-3 bg-gray-100 rounded w-4/6" />
      <div className="h-3 bg-gray-100 rounded w-3/6" />
      <div className="h-10 bg-gray-200 rounded-xl mt-2" />
      <div className="h-10 bg-gray-100 rounded-xl" />
      <div className="h-10 bg-gray-100 rounded-xl" />
    </div>
  </div>
);

const OffersPage = () => {
  const [activeTab, setActiveTab] = useState("active");
  const { offers, loading, error } = useOffers(activeTab);

  const tabs = [
    { key: "active",   label: "Active Offers" },
    { key: "upcoming", label: "Upcoming Offers" },
  ];

  const handleAddToCart = async (offer) => {
    if (offer?.productId) {
      try {
        await addProductToServer(offer.productId);
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
    <div className="w-full min-h-screen bg-[#f5f5f5]">
      <style>{`
        .offers-padded { padding-left: 350px; padding-right: 350px; }
        @media (max-width: 1600px) { .offers-padded { padding-left: 160px; padding-right: 160px; } }
        @media (max-width: 1280px) { .offers-padded { padding-left: 60px;  padding-right: 60px;  } }
        @media (max-width: 1024px) { .offers-padded { padding-left: 32px;  padding-right: 32px;  } }
        @media (max-width: 640px)  { .offers-padded { padding-left: 12px;  padding-right: 12px;  } }

        .offers-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1200px) { .offers-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 860px)  { .offers-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
        @media (max-width: 500px)  { .offers-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }

        @media (max-width: 640px) {
          .offers-title    { font-size: 28px !important; letter-spacing: -0.5px !important; }
          .offers-subtitle { font-size: 12px !important; }
        }
        @media (max-width: 380px) {
          .offers-title { font-size: 24px !important; }
        }
        @media (max-width: 420px) {
          .offers-tab-btn { padding-left: 12px !important; padding-right: 12px !important; font-size: 12px !important; }
        }
      `}</style>

      <div className="offers-padded pt-6 sm:pt-10 pb-10 sm:pb-16">

        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <h1
            className="offers-title text-[#111] leading-none mb-2"
            style={{ ...SORA, fontSize: 48, fontWeight: 900, letterSpacing: "-1.5px" }}
          >
            Offers & Deals
          </h1>
          <p
            className="offers-subtitle text-gray-400 px-4"
            style={{ ...INTER, fontSize: 15, fontWeight: 400 }}
          >
            Exclusive discounts on top PC components — updated weekly.
          </p>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 mb-6 sm:mb-7 flex-wrap">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`offers-tab-btn flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border-[1.5px] transition-all duration-150
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

        {/* ── Loading — inline skeletons ── */}
        {loading && (
          <div className="offers-grid grid gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <OfferSkeleton key={i} />
            ))}
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
              <div className="col-span-full text-center py-12 sm:py-16 px-4">
                <p
                  className="text-gray-400 mb-2 text-[18px] sm:text-[24px]"
                  style={{ ...SORA, fontWeight: 700 }}
                >
                  {activeTab === "upcoming"
                    ? "No upcoming offers right now 😴"
                    : "No active offers right now 😴"}
                </p>
                <p
                  className="text-gray-400 text-[12px] sm:text-[13px]"
                  style={{ ...INTER, fontWeight: 400 }}
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
          <div className="flex items-start sm:items-center gap-2 mt-8 sm:mt-10 px-3 sm:px-5 py-3 sm:py-3.5 bg-white border border-[#e6e6e6] rounded-xl text-gray-400">
            <InfoOutlinedIcon style={{ fontSize: 16, color: "#ccc", flexShrink: 0, marginTop: 1 }} />
            <span style={{ ...INTER, fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>
              Prices are subject to change without prior notice. All offers are valid while stocks last.
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

export default OffersPage;