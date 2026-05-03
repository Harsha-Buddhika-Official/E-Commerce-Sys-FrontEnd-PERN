import { useState, useEffect, useRef } from "react";
import Slider from "@mui/material/Slider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";
import { fetchCategoryFilters } from "../features/products/mocks/filterMockData.js";

// ─── Availability chip (checkbox style) ──────────────────────────────────────

function CheckChip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-semibold whitespace-nowrap transition-all duration-150
        ${selected
          ? "border-black bg-black text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
        }`}
    >
      <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center shrink-0
        ${selected ? "border-white" : "border-gray-400"}`}>
        {selected && (
          <svg viewBox="0 0 10 10" className="w-2 h-2" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

function RadioChip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-semibold whitespace-nowrap transition-all duration-150
        ${selected
          ? "border-black bg-black text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
        }`}
    >
      <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center shrink-0
        ${selected ? "border-white" : "border-gray-400"}`}>
        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
      </span>
      {label}
    </button>
  );
}

// ─── Vertical divider ─────────────────────────────────────────────────────────

function VDivider() {
  return <div className="shrink-0 self-stretch w-px bg-gray-200 mx-1" />;
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <span className="shrink-0 text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
      {children}
    </span>
  );
}

// ─── Dropdown for category-specific filters (non-common) ─────────────────────

function FilterDropdown({ filter, filterState, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const val = filterState[filter.id];
  const activeCount = Array.isArray(val) ? val.length : (val ? 1 : 0);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[12px] font-semibold transition-all duration-150 whitespace-nowrap
          ${open || activeCount > 0
            ? "border-black bg-black text-white"
            : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
          }`}
      >
        {filter.label}
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold bg-white text-black">
            {activeCount}
          </span>
        )}
        {open
          ? <KeyboardArrowUpIcon style={{ fontSize: 15 }} />
          : <KeyboardArrowDownIcon style={{ fontSize: 15 }} />
        }
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex flex-col gap-2"
          style={{ minWidth: "200px" }}
        >
          {filter.options.map((option) => {
            const isCheckbox = filter.type === "checkbox";
            const isSelected = isCheckbox
              ? filterState[filter.id]?.includes(option)
              : filterState[filter.id] === option;
            const Chip = isCheckbox ? CheckChip : RadioChip;
            return (
              <Chip
                key={option}
                label={option}
                selected={isSelected}
                onClick={() => onToggle(filter.id, option, filter.type)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main FilterBar ───────────────────────────────────────────────────────────

const PRICE_FILTER = {
  id: "price",
  label: "Price",
  type: "range",
  min: 0,
  max: 500000,
  step: 1000,
  defaultMin: 40000,
  defaultMax: 300000,
  currency: "Rs",
};

const AVAILABILITY_FILTER = {
  id: "availability",
  label: "Availability",
  type: "checkbox",
  options: ["In Stock", "Pre Order"],
};

export default function FilterBar({
  category = "processors",
  onFilterChange = () => {},
}) {
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [filterState, setFilterState]         = useState({});
  const [priceRange, setPriceRange]           = useState([PRICE_FILTER.defaultMin, PRICE_FILTER.defaultMax]);
  const [loaded, setLoaded]                   = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCategoryFilters(category);
        const catFilters = data.filters || [];
        setCategoryFilters(catFilters);

        const initial = {
          price: [PRICE_FILTER.defaultMin, PRICE_FILTER.defaultMax],
          availability: [],
        };
        catFilters.forEach((f) => {
          if (f.type === "radio")         initial[f.id] = null;
          else if (f.type === "checkbox") initial[f.id] = [];
          else if (f.type === "range")    initial[f.id] = [f.defaultMin, f.defaultMax];
        });
        setFilterState(initial);
        setPriceRange([PRICE_FILTER.defaultMin, PRICE_FILTER.defaultMax]);
        setLoaded(true);
      } catch (e) {
        console.error("Failed to load filters", e);
      }
    };
    load();
  }, [category]);

  const handleAvailabilityToggle = (value) => {
    setFilterState((prev) => {
      const arr = prev.availability || [];
      const next = {
        ...prev,
        availability: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      };
      onFilterChange(next);
      return next;
    });
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
    setFilterState((prev) => {
      const next = { ...prev, price: range };
      onFilterChange(next);
      return next;
    });
  };

  const handleCategoryToggle = (filterId, value, type) => {
    setFilterState((prev) => {
      let next;
      if (type === "radio") {
        next = { ...prev, [filterId]: prev[filterId] === value ? null : value };
      } else {
        const arr = prev[filterId] || [];
        next = { ...prev, [filterId]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
      }
      onFilterChange(next);
      return next;
    });
  };

  // Active count for clear-all
  const priceActive = priceRange[0] !== PRICE_FILTER.defaultMin || priceRange[1] !== PRICE_FILTER.defaultMax ? 1 : 0;
  const availActive = (filterState.availability || []).length;
  const catActive   = categoryFilters.reduce((acc, f) => {
    const v = filterState[f.id];
    return acc + (Array.isArray(v) ? v.length : v ? 1 : 0);
  }, 0);
  const totalActive = priceActive + availActive + catActive;

  const clearAll = () => {
    const reset = {
      price: [PRICE_FILTER.defaultMin, PRICE_FILTER.defaultMax],
      availability: [],
    };
    categoryFilters.forEach((f) => {
      reset[f.id] = f.type === "radio" ? null : [];
    });
    setFilterState(reset);
    setPriceRange([PRICE_FILTER.defaultMin, PRICE_FILTER.defaultMax]);
    onFilterChange(reset);
  };

  // Skeleton while loading
  if (!loaded) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 flex items-center gap-4">
        {[120, 80, 80, 100, 100].map((w, i) => (
          <div key={i} className="h-7 rounded-full bg-gray-100 animate-pulse shrink-0" style={{ width: w }} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm"
      style={{ fontFamily: "'Sora','Segoe UI',sans-serif" }}
    >
      <div className="flex items-center gap-3 px-5 py-3 flex-wrap">

        {/* ── PRICE — inline slider ─────────────────────────────────── */}
        <SectionLabel>Price</SectionLabel>

        {/* Value pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="border border-gray-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-gray-700 bg-gray-50 whitespace-nowrap">
            Rs {priceRange[0].toLocaleString()}
          </div>
          <span className="text-gray-400 text-[11px]">–</span>
          <div className="border border-gray-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-gray-700 bg-gray-50 whitespace-nowrap">
            Rs {priceRange[1].toLocaleString()}
          </div>
        </div>

        {/* Slider — fixed width so it doesn't stretch too wide */}
        <div className="shrink-0" style={{ width: "160px" }}>
          <Slider
            value={priceRange}
            onChange={(_, val) => handlePriceChange(val)}
            min={PRICE_FILTER.min}
            max={PRICE_FILTER.max}
            step={PRICE_FILTER.step}
            disableSwap
            sx={{
              color: "#111",
              height: 3,
              padding: "8px 0",
              "& .MuiSlider-thumb": {
                width: 15,
                height: 15,
                backgroundColor: "#fff",
                border: "2px solid #111",
                "&:hover": { boxShadow: "0 0 0 5px rgba(0,0,0,0.08)" },
              },
              "& .MuiSlider-track": { backgroundColor: "#111", border: "none" },
              "& .MuiSlider-rail": { backgroundColor: "#e5e7eb" },
            }}
          />
        </div>

        <VDivider />

        {/* ── AVAILABILITY — inline chips ───────────────────────────── */}
        <SectionLabel>Availability</SectionLabel>

        <div className="flex items-center gap-2 shrink-0">
          {AVAILABILITY_FILTER.options.map((option) => (
            <CheckChip
              key={option}
              label={option}
              selected={(filterState.availability || []).includes(option)}
              onClick={() => handleAvailabilityToggle(option)}
            />
          ))}
        </div>

        {/* ── CATEGORY-SPECIFIC filters — dropdowns ────────────────── */}
        {categoryFilters.length > 0 && (
          <>
            <VDivider />
            {categoryFilters.map((filter) => (
              <FilterDropdown
                key={filter.id}
                filter={filter}
                filterState={filterState}
                onToggle={handleCategoryToggle}
              />
            ))}
          </>
        )}

        {/* ── CLEAR ALL ─────────────────────────────────────────────── */}
        {totalActive > 0 && (
          <>
            <div className="flex-1" /> {/* push clear to right */}
            <button
              onClick={clearAll}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold text-red-500 hover:bg-red-50 border border-red-200 transition-all shrink-0 whitespace-nowrap"
            >
              <CloseIcon style={{ fontSize: 12 }} />
              Clear ({totalActive})
            </button>
          </>
        )}
      </div>
    </div>
  );
}