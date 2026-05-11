import { useState, useEffect, useRef } from "react";
import Slider from "@mui/material/Slider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";

// ─── Chip components (keep exactly as you have) ───────────────────────────────

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

function VDivider() {
  return <div className="shrink-0 self-stretch w-px bg-gray-200 mx-1" />;
}

function SectionLabel({ children }) {
  return (
    <span className="shrink-0 text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
      {children}
    </span>
  );
}

// ─── Dropdown for each attribute group ────────────────────────────────────────

function AttributeDropdown({ attribute, isValueChecked, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // count how many values are checked for this attribute
  const activeCount = attribute.values.filter(({ value }) =>
    isValueChecked(attribute.attributeId, value)
  ).length;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[12px] font-semibold transition-all duration-150 whitespace-nowrap
          ${open || activeCount > 0
            ? "border-black bg-black text-white"
            : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
          }`}
      >
        {attribute.name}
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
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex flex-col gap-2"
          style={{ minWidth: "220px", maxHeight: "300px", overflowY: "auto" }}
        >
          {attribute.values.map(({ value, count }) => {
            const checked = isValueChecked(attribute.attributeId, value);
            return (
              <CheckChip
                key={value}
                label={`${value} (${count})`}
                selected={checked}
                onClick={() => onToggle(attribute.attributeId, value)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Price range constants ─────────────────────────────────────────────────────

const PRICE_MIN = 0;
const PRICE_MAX = 500000;
const PRICE_STEP = 1000;

// ─── Main FilterBar ───────────────────────────────────────────────────────────

export default function FilterBar({
  filterOptions   = [],   // [{ attributeId, name, values: [{value, count}] }]
  loadingOptions  = false,
  filters,                // { attributeFilters, priceMin, priceMax } from hook
  isValueChecked,         // (attributeId, value) => bool
  toggleAttributeValue,   // (attributeId, value) => void
  setPriceRange,          // (min, max) => void
  clearFilters,           // () => void
  activeFilterCount = 0,
}) {
  // local slider state for smooth dragging — only calls setPriceRange on commit
  const [sliderValue, setSliderValue] = useState([
    filters.priceMin !== '' ? Number(filters.priceMin) : PRICE_MIN,
    filters.priceMax !== '' ? Number(filters.priceMax) : PRICE_MAX,
  ]);

  // sync slider if filters cleared externally
  useEffect(() => {
    if (filters.priceMin === '' && filters.priceMax === '') {
      setSliderValue([PRICE_MIN, PRICE_MAX]);
    }
  }, [filters.priceMin, filters.priceMax]);

  const handleSliderChange = (_, newValue) => {
    setSliderValue(newValue); // smooth UI update
  };

  const handleSliderCommit = (_, newValue) => {
    // only call API when user releases the slider
    setPriceRange(
      newValue[0] === PRICE_MIN ? '' : newValue[0],
      newValue[1] === PRICE_MAX ? '' : newValue[1],
    );
  };

  if (loadingOptions) {
    return (
      <div className="w-full px-2 sm:px-4 py-4 border-b border-gray-200 bg-white">
        <div className="flex gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-7 w-24 bg-gray-100 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 py-4 border-b border-gray-200 bg-white">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">

        {/* ── Price ── */}
        <div className="flex items-center gap-2">
          <SectionLabel>Price</SectionLabel>
          <Slider
            value={sliderValue}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderCommit}
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `Rs ${v.toLocaleString()}`}
            marks={[
              { value: PRICE_MIN, label: "Rs 0" },
              { value: PRICE_MAX, label: "Rs 500k" },
            ]}
            sx={{
              width: 150,
              mr: 2,
              color: "black",
              "& .MuiSlider-thumb": { backgroundColor: "black" },
              "& .MuiSlider-track": { backgroundColor: "black" },
              "& .MuiSlider-rail": { backgroundColor: "#e5e7eb" },
            }}
          />
        </div>

        <VDivider />

        {/* ── Category attribute dropdowns ── */}
        {filterOptions.length > 0 && (
          <>
            {filterOptions.map(attr => (
              <AttributeDropdown
                key={attr.attributeId}
                attribute={attr}
                isValueChecked={isValueChecked}
                onToggle={toggleAttributeValue}
              />
            ))}
            <VDivider />
          </>
        )}

        {/* ── Clear all ── */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1 rounded-full border border-gray-300 bg-white text-gray-700 text-[12px] font-semibold hover:border-red-500 hover:text-red-500 transition-all"
          >
            <CloseIcon style={{ fontSize: 14 }} />
            Clear all ({activeFilterCount})
          </button>
        )}

      </div>
    </div>
  );
}