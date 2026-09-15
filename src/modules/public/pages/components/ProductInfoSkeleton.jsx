const Pulse = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-zinc-200 ${className}`} />
);

export default function ProductInfoSkeleton() {
  return (
    <div
      className="min-h-screen bg-zinc-100 py-6 px-4 md:px-8"
      style={{ fontFamily: "'Sora', 'Segoe UI', sans-serif" }}
    >
      {/* Top card: gallery + info */}
      <div className="mx-auto max-w-300 overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:flex">
        {/* Gallery side */}
        <div className="relative flex w-full flex-col items-center justify-center gap-4 border-zinc-200 bg-zinc-50 p-6 md:w-1/2 md:border-r">
          <Pulse className="aspect-4/3 w-full max-w-115 rounded-md" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Pulse key={i} className="h-14 w-14 rounded" />
            ))}
          </div>
        </div>

        {/* Info side */}
        <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Pulse className="h-5 w-16 rounded-full" />
            <Pulse className="h-5 w-20 rounded-full" />
            <Pulse className="h-5 w-14 rounded-full" />
          </div>

          {/* Title */}
          <Pulse className="h-6 w-3/4 rounded" />
          <Pulse className="h-6 w-1/2 rounded" />

          {/* Meta line */}
          <div className="flex flex-wrap items-center gap-2">
            <Pulse className="h-3 w-20 rounded" />
            <Pulse className="h-3 w-24 rounded" />
            <Pulse className="h-3 w-28 rounded" />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Pulse className="h-3 w-full rounded" />
            <Pulse className="h-3 w-full rounded" />
            <Pulse className="h-3 w-2/3 rounded" />
          </div>

          <div className="h-px w-full bg-zinc-200" />

          {/* Price */}
          <div className="flex items-center gap-3">
            <Pulse className="h-4 w-20 rounded" />
            <Pulse className="h-8 w-32 rounded" />
            <Pulse className="h-5 w-14 rounded-full" />
          </div>

          {/* Buttons */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Pulse className="h-10 min-w-37.5 flex-1 rounded-md" />
            <Pulse className="h-10 w-10 rounded-md" />
            <Pulse className="h-10 w-10 rounded-md" />
            <Pulse className="h-10 w-10 rounded-md" />
          </div>

          {/* Shipping banner */}
          <Pulse className="mt-2 h-12 w-full rounded-md" />
        </div>
      </div>

      {/* Specifications card */}
      <div className="mx-auto mt-6 max-w-300 overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <div className="bg-zinc-800 px-6 py-3">
          <Pulse className="h-4 w-40 rounded bg-zinc-600" />
          <Pulse className="mt-2 h-3 w-28 rounded bg-zinc-600" />
        </div>

        <div className="grid grid-cols-1 p-3 sm:grid-cols-2 md:p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 border-b border-zinc-200 px-2 py-3 ${
                i % 2 === 0 ? "bg-zinc-50" : "bg-white"
              }`}
            >
              <Pulse className="h-3 w-24 rounded" />
              <Pulse className="h-3 w-32 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}