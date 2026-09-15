import { SORA, INTER } from "../../../../styles/fonts";

const Pulse = ({ className = "", style }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} style={style} />
);

function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-6 ${className}`}
      style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {children}
    </div>
  );
}

export default function OfferDetailSkeleton() {
  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white">
            <Pulse className="w-4 h-4 rounded" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Pulse className="h-2.5 w-20 rounded" />
            <Pulse className="h-4 w-28 rounded" />
          </div>
        </div>
      </div>

      {/* 3-col grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">

        {/* LEFT + CENTRE */}
        <div className="xl:col-span-2 flex flex-col gap-4 sm:gap-5">

          {/* Offer overview */}
          <SectionCard>
            <div className="flex flex-col gap-4">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Pulse className="h-6 w-20 rounded-full" />
                <Pulse className="h-6 w-24 rounded-full" />
                <Pulse className="h-6 w-28 rounded-full" />
              </div>

              {/* Title + description */}
              <div className="flex flex-col gap-2">
                <Pulse className="h-6 w-2/3 rounded" />
                <Pulse className="h-3 w-full rounded" />
                <Pulse className="h-3 w-5/6 rounded" />
                <Pulse className="h-3 w-1/2 rounded" />
              </div>

              {/* Date range */}
              <div className="flex items-center gap-3 flex-wrap">
                <Pulse className="h-14 flex-1 min-w-[140px] sm:min-w-[180px] rounded-xl" />
                <Pulse className="h-14 flex-1 min-w-[140px] sm:min-w-[180px] rounded-xl" />
              </div>

              {/* Banner */}
              <Pulse className="w-full rounded-2xl aspect-[16/9] sm:aspect-[10/3]" />
            </div>
          </SectionCard>

          {/* Linked product */}
          <SectionCard>
            <div className="flex items-center gap-2.5 mb-5 pb-3" style={{ borderBottom: "1px solid #f0f0f0" }}>
              <Pulse className="w-8 h-8 rounded-lg" />
              <Pulse className="h-3.5 w-20 rounded" />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Image gallery */}
              <div className="flex flex-col gap-3 shrink-0 items-center md:items-start w-full md:w-auto">
                <Pulse className="rounded-2xl" style={{ width: "100%", maxWidth: 260, height: 220 }} />
                <div className="flex gap-2">
                  <Pulse className="w-13 h-13 rounded-xl" />
                  <Pulse className="w-13 h-13 rounded-xl" />
                  <Pulse className="w-13 h-13 rounded-xl" />
                </div>
              </div>

              {/* Product info */}
              <div className="flex flex-col gap-3 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <Pulse className="h-5 w-1/2 rounded" />
                  <Pulse className="h-9 w-32 rounded-xl" />
                </div>
                <div className="flex items-center gap-2">
                  <Pulse className="h-5 w-16 rounded-full" />
                  <Pulse className="h-5 w-24 rounded-full" />
                </div>
                <Pulse className="h-3 w-full rounded" />
                <Pulse className="h-3 w-4/5 rounded" />
                <Pulse className="h-16 w-full rounded-xl" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                  <Pulse className="h-12 rounded-xl" />
                  <Pulse className="h-12 rounded-xl" />
                  <Pulse className="h-12 rounded-xl" />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-4 sm:gap-5">
          <SectionCard>
            <div className="flex items-center gap-2.5 mb-5 pb-3" style={{ borderBottom: "1px solid #f0f0f0" }}>
              <Pulse className="w-8 h-8 rounded-lg" />
              <Pulse className="h-3.5 w-28 rounded" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid #f8f8f8" }}>
                <Pulse className="h-3 w-24 rounded" />
                <Pulse className="h-3 w-20 rounded" />
              </div>
            ))}
            <Pulse className="mt-4 h-10 w-full rounded-xl" />
          </SectionCard>

          <SectionCard>
            <div className="flex items-center gap-2.5 mb-5 pb-3" style={{ borderBottom: "1px solid #f0f0f0" }}>
              <Pulse className="w-8 h-8 rounded-lg" />
              <Pulse className="h-3.5 w-32 rounded" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Pulse key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}