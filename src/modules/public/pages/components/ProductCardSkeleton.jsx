// src/modules/public/pages/components/ProductCardSkeleton.jsx

export default function ProductCardSkeleton() {
  return (
    <div className="relative bg-white border border-[#E6E6E6] rounded-[10px] overflow-hidden flex flex-col w-full animate-pulse min-h-[380px] sm:min-h-[420px] md:min-h-[450px]">
      {/* Image area */}
      <div className="relative w-full" style={{ paddingTop: "85%" }}>
        <div className="absolute inset-3 bg-gray-200 rounded-[10px]" />
      </div>
      {/* Text area */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-2 gap-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
        <div className="mt-auto flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-6 bg-gray-200 rounded-full w-1/4" />
        </div>
      </div>
    </div>
  );
}