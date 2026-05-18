import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import { useSearch } from "../../features/search/hooks/useSearch";

export default function SearchOverlay({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { results, loading, error } = useSearch(query);

  const visibleResults = useMemo(() => results.slice(0, 5), [results]);
  const showPanel = query.trim().length > 0;

  if (!isOpen) return null

  return (
    <>
      {/* Dark Overlay */}
      <div
        style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
        className="fixed inset-0 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Bar Container */}
      <div className="fixed top-[95px] left-0 right-0 z-50 flex justify-center">
        <div style={{ width: "910px" }} className="relative">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search for Products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-14 px-5 pr-12 rounded-lg bg-white text-black text-base focus:outline-none focus:ring-2 focus:ring-blue-500 border-2"
            style={{ borderColor: "#fe1801" }}
            autoFocus
          />

          {/* Search Icon Inside Input */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            aria-label="Search"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -right-12 top-1/2 -translate-y-1/2 text-white hover:text-zinc-300 transition-colors hidden md:block"
            aria-label="Close search"
          >
            <CloseIcon className="w-6 h-6" />
          </button>

          {/* Results dropdown */}
          {showPanel && (
            <div className="absolute mt-2 w-full rounded-lg bg-[#0f1115] shadow-lg border border-[#1f2430] overflow-hidden">
              <div className="px-4 py-2 text-xs text-zinc-300 bg-[#12151c] border-b border-[#1f2430]">
                Showing top 5 results. Press enter to see all results
              </div>

              {loading && (
                <div className="px-4 py-3 text-sm text-zinc-300">Searching...</div>
              )}

              {!loading && error && (
                <div className="px-4 py-3 text-sm text-red-400">{error}</div>
              )}

              {!loading && !error && visibleResults.length === 0 && (
                <div className="px-4 py-3 text-sm text-zinc-300">No results found.</div>
              )}

              {!loading && !error && visibleResults.length > 0 && (
                <ul className="divide-y divide-[#1f2430]">
                  {visibleResults.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/product/${item.id}`);
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#151a24]"
                      >
                        <span className="text-zinc-400">&#x2794;</span>
                        <div className="min-w-0">
                          <p className="text-sm text-zinc-100 truncate">{item.name}</p>
                          {item.category && (
                            <p className="text-xs text-zinc-400 truncate">{item.category}</p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
