import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { fetchCategoryFilters } from "../services/filterMockData";

// ── helpers ──────────────────────────────────────────────────────────────────

function SectionDivider({ label }) {
  return (
    <div className="mt-6 mb-3">
      <h2 className="text-[17px] font-bold text-black tracking-tight">
        {label}
      </h2>
      <div className="h-px bg-black mt-1" />
    </div>
  );
}

function FilterChip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[13px] font-medium transition-all duration-150
        ${
          selected
            ? "border-black bg-black text-white"
            : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
        }`}
    >
      {/* Radio circle */}
      <span
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
          ${selected ? "border-white" : "border-gray-400"}`}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-white block" />}
      </span>
      {label}
    </button>
  );
}

function FilterCheckChip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[13px] font-medium transition-all duration-150
        ${
          selected
            ? "border-red-500 bg-red-50 text-red-600"
            : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
        }`}
    >
      <span
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
          ${selected ? "border-red-500 bg-red-500" : "border-gray-400"}`}
      >
        {selected && (
          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
            <path
              d="M2 5l2.5 2.5L8 3"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

function MoreButton({ expanded, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-1 border border-gray-300 rounded-lg py-2 text-[13px] font-semibold text-gray-600 hover:border-black hover:text-black transition-all mt-2"
    >
      More
      <KeyboardArrowDownIcon
        fontSize="small"
        className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
      />
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
// Props: category (string), onFilterChange (function)
export default function FilterSidebar({ category = "processors", onFilterChange = () => {} }) {
  // Common filters (same across all categories)
  const commonFilters = [
    {
      id: "price",
      label: "Price Range",
      type: "range",
      min: 0,
      max: 500000,
      step: 1000,
      defaultMin: 40000,
      defaultMax: 300000,
      currency: "Rs",
      minLabel: "Min Price",
      maxLabel: "Max Price",
    },
    {
      id: "availability",
      label: "Availability",
      type: "checkbox",
      maxShowInitial: 2,
      options: ["In Stock", "Pre Order"],
    },
  ];

  // Dynamic state based on category filters
  const [filterState, setFilterState] = useState({});
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [allFilters, setAllFilters] = useState([]);
  const [priceRange, setPriceRange] = useState([40000, 300000]);
  const [expandedSections, setExpandedSections] = useState({});

  // Fetch filters from backend based on category
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Using mock data for now - replace with actual API call later
        // const response = await fetch(`/api/filters/${category}`);
        // const data = await response.json();
        const data = await fetchCategoryFilters(category);
        
        // Combine common filters with category-specific filters
        const combined = [...commonFilters, ...(data.filters || [])];
        setAllFilters(combined);
        setCategoryFilters(data.filters || []);

        // Initialize filter state
        const initialState = {};
        combined.forEach((filter) => {
          if (filter.type === "radio") {
            initialState[filter.id] = null;
          } else if (filter.type === "checkbox") {
            initialState[filter.id] = [];
          } else if (filter.type === "range") {
            initialState[filter.id] = [filter.defaultMin, filter.defaultMax];
            setPriceRange([filter.defaultMin, filter.defaultMax]);
          }
        });
        setFilterState(initialState);
        setExpandedSections({});
      } catch (error) {
        console.error("Failed to fetch category filters:", error);
      }
    };

    fetchFilters();
  }, [category]);

  // Toggle filter selection (for both radio and checkbox)
  const toggleFilter = (filterId, value) => {
    setFilterState((prev) => {
      const currentFilter = categoryFilters.find((f) => f.id === filterId);
      let newValue;

      if (currentFilter?.type === "radio") {
        // Radio: only one can be selected
        newValue = prev[filterId] === value ? null : value;
      } else {
        // Checkbox: multiple can be selected
        newValue = prev[filterId]?.includes(value)
          ? prev[filterId].filter((v) => v !== value)
          : [...(prev[filterId] || []), value];
      }

      const updatedState = { ...prev, [filterId]: newValue };
      onFilterChange(updatedState); // Send to parent/backend
      return updatedState;
    });
  };

  // Handle price range change
  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    setFilterState((prev) => {
      const updatedState = { ...prev, price: newRange };
      onFilterChange(updatedState);
      return updatedState;
    });
  };

  // Toggle "Show More" section
  const toggleShowMore = (filterId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }));
  };


  return (
    <div
      className="relative bg-white"
      style={{
        fontFamily: "'Sora', 'Segoe UI', sans-serif",
        width: "330px",
        height: "1100px",
        borderRadius: "0px 10px 10px 0px",
        overflow: "hidden",
      }}
    >
      <div className="overflow-y-auto px-4 pb-10" style={{ height: "100%" }}>
        {/* ── Dynamically render filters from backend ── */}
        {allFilters.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            Loading filters...
          </div>
        ) : (
          allFilters.map((filter) => {
            // PRICE RANGE FILTER
            if (filter.type === "range") {
              return (
                <div key={filter.id} className="mt-2">
                  <SectionDivider label={filter.label} />
                  <div className="flex justify-between text-[12px] text-gray-500 font-medium mb-1">
                    <span>{filter.minLabel || "Min"}</span>
                    <span>{filter.maxLabel || "Max"}</span>
                  </div>
                  <div className="flex justify-between mb-3 gap-2">
                    <div className="border border-gray-300 rounded px-2 py-1 text-[12px] text-gray-700 w-1/2">
                      {filter.currency || "Rs"}: {priceRange[0].toLocaleString()}
                    </div>
                    <div className="border border-gray-300 rounded px-2 py-1 text-[12px] text-gray-700 w-1/2 text-right">
                      {filter.currency || "Rs"}: {priceRange[1].toLocaleString()}
                    </div>
                  </div>
                  <Slider
                    value={priceRange}
                    onChange={(_, val) => handlePriceChange(val)}
                    min={filter.min}
                    max={filter.max}
                    step={filter.step || 1000}
                    disableSwap
                    sx={{
                      color: "#111",
                      height: 3,
                      "& .MuiSlider-thumb": {
                        width: 18,
                        height: 18,
                        backgroundColor: "#fff",
                        border: "2px solid #111",
                        "&:hover": { boxShadow: "0 0 0 6px rgba(0,0,0,0.1)" },
                      },
                      "& .MuiSlider-track": {
                        backgroundColor: "#111",
                        border: "none",
                      },
                      "& .MuiSlider-rail": { backgroundColor: "#d1d5db" },
                    }}
                  />
                </div>
              );
            }

            // CHECKBOX OR RADIO FILTERS
            const isCheckbox = filter.type === "checkbox";
            const isMultiColumn = filter.columnLayout === 2;
            const visibleOptions = expandedSections[filter.id]
              ? filter.options
              : filter.options.slice(0, filter.maxShowInitial || 6);
            const showMoreButton =
              filter.options.length > (filter.maxShowInitial || 6);

            return (
              <div key={filter.id}>
                <SectionDivider label={filter.label} />
                <div
                  className={`flex flex-col gap-2 ${
                    isMultiColumn ? "grid grid-cols-2" : ""
                  }`}
                >
                  {visibleOptions.map((option) => {
                    const isSelected = isCheckbox
                      ? filterState[filter.id]?.includes(option)
                      : filterState[filter.id] === option;

                    const ChipComponent = isCheckbox
                      ? FilterCheckChip
                      : FilterChip;

                    return (
                      <ChipComponent
                        key={option}
                        label={option}
                        selected={isSelected}
                        onClick={() => toggleFilter(filter.id, option)}
                      />
                    );
                  })}
                </div>
                {showMoreButton && (
                  <MoreButton
                    expanded={expandedSections[filter.id] || false}
                    onClick={() => toggleShowMore(filter.id)}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');`}</style>
    </div>
  );
}
