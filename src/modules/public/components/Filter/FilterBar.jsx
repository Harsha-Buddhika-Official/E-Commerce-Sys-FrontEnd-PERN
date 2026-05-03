import { useState, useEffect, useRef } from "react";
import Slider from "@mui/material/Slider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";
import { fetchCategoryFilters } from "../../features/products/api/filterService.js";

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
  };

  const handleCategoryFilterToggle = (filterId, option, type) => {
    setFilterState((prev) => {
      const newState = { ...prev };
      if (type === "checkbox") {
        const arr = newState[filterId] || [];
        newState[filterId] = arr.includes(option) ? arr.filter(v => v !== option) : [...arr, option];
      } else if (type === "radio") {
        newState[filterId] = newState[filterId] === option ? null : option;
      }
      onFilterChange(newState);
      return newState;
    });
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 border-b border-gray-200 bg-white">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Price Filter */}
        <div className="flex items-center gap-2">
          <SectionLabel>{PRICE_FILTER.label}</SectionLabel>
          <Slider
            value={priceRange}
            onChange={(e, newValue) => handlePriceChange(newValue)}
            min={PRICE_FILTER.min}
            max={PRICE_FILTER.max}
            step={PRICE_FILTER.step}
            valueLabelDisplay="auto"
            marks={[
              { value: PRICE_FILTER.min, label: `${PRICE_FILTER.currency}0` },
              { value: PRICE_FILTER.max, label: `${PRICE_FILTER.currency}500k` }
            ]}
            sx={{ width: 150, mr: 2 }}
          />
        </div>

        <VDivider />

        {/* Availability Filter */}
        <div className="flex items-center gap-2">
          <SectionLabel>{AVAILABILITY_FILTER.label}</SectionLabel>
          {AVAILABILITY_FILTER.options.map((opt) => (
            <CheckChip
              key={opt}
              label={opt}
              selected={filterState.availability?.includes(opt) || false}
              onClick={() => handleAvailabilityToggle(opt)}
            />
          ))}
        </div>

        <VDivider />

        {/* Category-specific filters */}
        {categoryFilters.map((filter) => (
          <FilterDropdown
            key={filter.id}
            filter={filter}
            filterState={filterState}
            onToggle={handleCategoryFilterToggle}
          />
        ))}

        {/* Clear all button */}
        {Object.values(filterState).some(v => v && (Array.isArray(v) ? v.length > 0 : true)) && (
          <button
            onClick={() => {
              setFilterState({
                price: [PRICE_FILTER.defaultMin, PRICE_FILTER.defaultMax],
                availability: [],
              });
              setPriceRange([PRICE_FILTER.defaultMin, PRICE_FILTER.defaultMax]);
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-full border border-gray-300 bg-white text-gray-700 text-[12px] font-semibold hover:border-red-500 hover:text-red-500 transition-all"
          >
            <CloseIcon style={{ fontSize: 14 }} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
