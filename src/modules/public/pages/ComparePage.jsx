// src/modules/public/pages/ComparePage.jsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CompareArrows, SmartToy, Close, Refresh } from "@mui/icons-material";
import { useComparison } from "../features/comparison/hooks/useComparison.js";

export default function ComparePage() {
  const navigate = useNavigate();
  const {
    list,
    count,
    remove,
    clear,
    result,
    loading,
    error,
    pollAttempt,
    compare,
  } = useComparison();

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    if (list.length >= 2) {
      compare(list.map((item) => item.productId)); // convert to IDs before calling
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => compare(list);

  const handleAskAI = () => {
    navigate("/chat", { state: { comparisonResult: result } });
  };

  // --- Empty state: no products selected ---
  if (count === 0) {
    return (
      <div
        className="min-h-screen bg-zinc-100 py-6 px-4 md:px-8"
        style={{ fontFamily: "'Sora', 'Segoe UI', sans-serif" }}
      >
        <div className="mx-auto flex max-w-180 flex-col items-center gap-4 rounded-xl bg-white p-10 text-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
            <CompareArrows className="text-zinc-400" fontSize="large" />
          </div>
          <h1 className="m-0 text-lg font-bold text-zinc-800">No products to compare</h1>
          <p className="max-w-90 text-[13px] text-zinc-500">
            Browse products and tap the compare icon to add up to 4 items here.
          </p>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // --- Only 1 product selected ---
  if (count === 1) {
    return (
      <div
        className="min-h-screen bg-zinc-100 py-6 px-4 md:px-8"
        style={{ fontFamily: "'Sora', 'Segoe UI', sans-serif" }}
      >
        <div className="mx-auto flex max-w-180 flex-col items-center gap-4 rounded-xl bg-white p-10 text-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <p className="text-[13px] text-zinc-500">
            Add at least one more product to start comparing.
          </p>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="rounded-md bg-zinc-800 px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Add Another Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-zinc-100 py-6 px-4 md:px-8"
      style={{ fontFamily: "'Sora', 'Segoe UI', sans-serif" }}
    >
      <div className="mx-auto max-w-300">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div>
            <h1 className="m-0 text-lg font-bold text-zinc-800">Product Comparison</h1>
            <p className="mt-0.5 text-xs text-zinc-500">
              Comparing {count} product{count > 1 ? "s" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              clear();
              navigate("/products");
            }}
            className="rounded-md border-2 border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 transition-colors hover:border-red-600 hover:text-red-600"
          >
            Clear All
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-12 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-red-600" />
            <p className="text-[13px] text-zinc-500">
              Comparing products with AI{pollAttempt > 0 ? ` (still working, ${pollAttempt * 2}s)` : "..."}
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-10 text-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="flex items-center gap-2 rounded-md bg-zinc-800 px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <Refresh fontSize="small" />
              Try Again
            </button>
          </div>
        )}

        {/* Result */}
        {!loading && !error && result && (
          <div className="flex flex-col gap-4">
            {/* Comparison table */}
            <div className="overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <div className="bg-zinc-800 px-6 py-3">
                <h2 className="m-0 text-sm font-bold uppercase tracking-wide text-white">
                  Side-by-Side Comparison
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-zinc-50">
                      <th className="min-w-37.5 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                        Spec
                      </th>
                      {result.products?.map((p) => (
                        <th key={p.name} className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-zinc-800">{p.name}</span>
                            <span className="text-xs font-semibold text-red-600">{p.price}</span>
                            <span
                              className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                p.stockStatus === "In Stock"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {p.stockStatus}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.products?.[0]?.specs?.map((spec, i) => (
                      <tr key={spec.label} className={i % 2 === 0 ? "bg-white" : "bg-zinc-50"}>
                        <td className="border-t border-zinc-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                          {spec.label}
                        </td>
                        {result.products.map((p) => (
                          <td
                            key={p.name}
                            className="border-t border-zinc-200 px-4 py-3 text-[13px] text-zinc-800"
                          >
                            {p.specs.find((s) => s.label === spec.label)?.value || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key differences */}
            {result.keyDifferences?.length > 0 && (
              <div className="rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                <h3 className="m-0 mb-3 text-sm font-bold uppercase tracking-wide text-zinc-800">
                  Key Differences
                </h3>
                <div className="flex flex-col gap-2">
                  {result.keyDifferences.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-[13px] text-zinc-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                      <span>
                        <span className="font-semibold text-zinc-800">{d.product}:</span> {d.point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            {result.recommendation && (
              <div className="rounded-xl border-2 border-red-100 bg-red-50 p-5">
                <div className="flex items-center gap-2">
                  <SmartToy className="text-red-600" fontSize="small" />
                  <h3 className="m-0 text-sm font-bold uppercase tracking-wide text-red-700">
                    AI Recommendation
                  </h3>
                </div>
                <p className="mt-2 text-sm font-bold text-zinc-800">
                  {result.recommendation.bestChoice}
                </p>
                <p className="mt-1 text-[13px] leading-6 text-zinc-600">
                  {result.recommendation.reason}
                </p>
              </div>
            )}

            {/* Selected products with remove option */}
            <div className="rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <h3 className="m-0 mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Selected Products
              </h3>
              <div className="flex flex-wrap gap-2">
                {list.map((item) => (
                  <span
                    key={item.productId}
                    className="flex items-center gap-1.5 rounded-full bg-zinc-100 py-1.5 pl-3 pr-1.5 text-xs font-medium text-zinc-700"
                  >
                    {item.name}
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      className="flex h-4 w-4 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700"
                    >
                      <Close style={{ fontSize: 12 }} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Ask AI button */}
            <button
              type="button"
              onClick={handleAskAI}
              className="flex items-center justify-center gap-2 rounded-md bg-zinc-800 px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <SmartToy fontSize="small" />
              Ask AI a Follow-up Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}