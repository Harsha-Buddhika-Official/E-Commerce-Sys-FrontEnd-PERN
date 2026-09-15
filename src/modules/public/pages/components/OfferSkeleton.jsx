export default function OfferSkeleton() {
  return (
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
}