// import { useState, useEffect } from "react";
// import Slider from "@mui/material/Slider";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import CloseIcon from "@mui/icons-material/Close";
// import { fetchCategoryFilters } from "../services/filterMockData";

// // ── helpers ──────────────────────────────────────────────────────────────────

// function SectionDivider({ label }) {
//   return (
//     <div className="mt-6 mb-3">
//       <h2 className="text-[17px] font-bold text-black tracking-tight">{label}</h2>
//       <div className="h-px bg-black mt-1" />
//     </div>
//   );
// }

// function FilterChip({ label, selected, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[13px] font-medium transition-all duration-150
//         ${selected
//           ? "border-black bg-black text-white"
//           : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
//         }`}
//     >
//       <span
//         className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
//           ${selected ? "border-white" : "border-gray-400"}`}
//       >
//         {selected && <span className="w-2 h-2 rounded-full bg-white block" />}
//       </span>
//       {label}
//     </button>
//   );
// }

// function FilterCheckChip({ label, selected, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[13px] font-medium transition-all duration-150
//         ${selected
//           ? "border-red-500 bg-red-50 text-red-600"
//           : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
//         }`}
//     >
//       <span
//         className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
//           ${selected ? "border-red-500 bg-red-500" : "border-gray-400"}`}
//       >
//         {selected && (
//           <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
//             <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//         )}
//       </span>
//       {label}
//     </button>
//   );
// }

// function MoreButton({ expanded, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="w-full flex items-center justify-center gap-1 border border-gray-300 rounded-lg py-2 text-[13px] font-semibold text-gray-600 hover:border-black hover:text-black transition-all mt-2"
//     >
//       More
//       <KeyboardArrowDownIcon
//         fontSize="small"
//         className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
//       />
//     </button>
//   );
// }

// // ── Main Component ────────────────────────────────────────────────────────────
// // Props:
// //   category      — string
// //   onFilterChange — function
// //   isOpen        — boolean (mobile drawer open state)
// //   onClose       — function (close the mobile drawer)
// export default function FilterSidebar({
//   category = "processors",
//   onFilterChange = () => {},
//   isOpen = false,
//   onClose = () => {},
// }) {
//   const commonFilters = [
//     {
//       id: "price",
//       label: "Price Range",
//       type: "range",
//       min: 0,
//       max: 500000,
//       step: 1000,
//       defaultMin: 40000,
//       defaultMax: 300000,
//       currency: "Rs",
//       minLabel: "Min Price",
//       maxLabel: "Max Price",
//     },
//     {
//       id: "availability",
//       label: "Availability",
//       type: "checkbox",
//       maxShowInitial: 2,
//       options: ["In Stock", "Pre Order"],
//     },
//   ];

//   const [filterState, setFilterState] = useState({});
//   const [categoryFilters, setCategoryFilters] = useState([]);
//   const [allFilters, setAllFilters] = useState([]);
//   const [priceRange, setPriceRange] = useState([40000, 300000]);
//   const [expandedSections, setExpandedSections] = useState({});

//   useEffect(() => {
//     const fetchFilters = async () => {
//       try {
//         const data = await fetchCategoryFilters(category);
//         const combined = [...commonFilters, ...(data.filters || [])];
//         setAllFilters(combined);
//         setCategoryFilters(data.filters || []);

//         const initialState = {};
//         combined.forEach((filter) => {
//           if (filter.type === "radio") {
//             initialState[filter.id] = null;
//           } else if (filter.type === "checkbox") {
//             initialState[filter.id] = [];
//           } else if (filter.type === "range") {
//             initialState[filter.id] = [filter.defaultMin, filter.defaultMax];
//             setPriceRange([filter.defaultMin, filter.defaultMax]);
//           }
//         });
//         setFilterState(initialState);
//         setExpandedSections({});
//       } catch (error) {
//         console.error("Failed to fetch category filters:", error);
//       }
//     };

//     fetchFilters();
//   }, [category]);

//   const toggleFilter = (filterId, value) => {
//     setFilterState((prev) => {
//       const currentFilter = categoryFilters.find((f) => f.id === filterId);
//       let newValue;

//       if (currentFilter?.type === "radio") {
//         newValue = prev[filterId] === value ? null : value;
//       } else {
//         newValue = prev[filterId]?.includes(value)
//           ? prev[filterId].filter((v) => v !== value)
//           : [...(prev[filterId] || []), value];
//       }

//       const updatedState = { ...prev, [filterId]: newValue };
//       onFilterChange(updatedState);
//       return updatedState;
//     });
//   };

//   const handlePriceChange = (newRange) => {
//     setPriceRange(newRange);
//     setFilterState((prev) => {
//       const updatedState = { ...prev, price: newRange };
//       onFilterChange(updatedState);
//       return updatedState;
//     });
//   };

//   const toggleShowMore = (filterId) => {
//     setExpandedSections((prev) => ({ ...prev, [filterId]: !prev[filterId] }));
//   };

//   const sidebarContent = (
//     <div className="overflow-y-auto px-6 pb-10 no-scrollbar" style={{ flex: 1, height: "100%" }}>
//       {allFilters.length === 0 ? (
//         <div className="text-center text-gray-500 mt-4">Loading filters...</div>
//       ) : (
//         allFilters.map((filter) => {
//           if (filter.type === "range") {
//             return (
//               <div key={filter.id} className="mt-2">
//                 <SectionDivider label={filter.label} />
//                 <div className="flex justify-between text-[12px] text-gray-500 font-medium mb-1">
//                   <span>{filter.minLabel || "Min"}</span>
//                   <span>{filter.maxLabel || "Max"}</span>
//                 </div>
//                 <div className="flex justify-between mb-3 gap-2">
//                   <div className="border border-gray-300 rounded px-2 py-1 text-[12px] text-gray-700 w-1/2">
//                     {filter.currency || "Rs"}: {priceRange[0].toLocaleString()}
//                   </div>
//                   <div className="border border-gray-300 rounded px-2 py-1 text-[12px] text-gray-700 w-1/2 text-right">
//                     {filter.currency || "Rs"}: {priceRange[1].toLocaleString()}
//                   </div>
//                 </div>
//                 <Slider
//                   value={priceRange}
//                   onChange={(_, val) => handlePriceChange(val)}
//                   min={filter.min}
//                   max={filter.max}
//                   step={filter.step || 1000}
//                   disableSwap
//                   sx={{
//                     color: "#111",
//                     height: 3,
//                     "& .MuiSlider-thumb": {
//                       width: 18,
//                       height: 18,
//                       backgroundColor: "#fff",
//                       border: "2px solid #111",
//                       "&:hover": { boxShadow: "0 0 0 6px rgba(0,0,0,0.1)" },
//                     },
//                     "& .MuiSlider-track": { backgroundColor: "#111", border: "none" },
//                     "& .MuiSlider-rail": { backgroundColor: "#d1d5db" },
//                   }}
//                 />
//               </div>
//             );
//           }

//           const isCheckbox = filter.type === "checkbox";
//           const isMultiColumn = filter.columnLayout === 2;
//           const visibleOptions = expandedSections[filter.id]
//             ? filter.options
//             : filter.options.slice(0, filter.maxShowInitial || 6);
//           const showMoreButton = filter.options.length > (filter.maxShowInitial || 6);

//           return (
//             <div key={filter.id}>
//               <SectionDivider label={filter.label} />
//               <div className={`flex flex-col gap-2 ${isMultiColumn ? "grid grid-cols-2" : ""}`}>
//                 {visibleOptions.map((option) => {
//                   const isSelected = isCheckbox
//                     ? filterState[filter.id]?.includes(option)
//                     : filterState[filter.id] === option;
//                   const ChipComponent = isCheckbox ? FilterCheckChip : FilterChip;
//                   return (
//                     <ChipComponent
//                       key={option}
//                       label={option}
//                       selected={isSelected}
//                       onClick={() => toggleFilter(filter.id, option)}
//                     />
//                   );
//                 })}
//               </div>
//               {showMoreButton && (
//                 <MoreButton
//                   expanded={expandedSections[filter.id] || false}
//                   onClick={() => toggleShowMore(filter.id)}
//                 />
//               )}
//             </div>
//           );
//         })
//       )}
//     </div>
//   );

//   return (
//     <>
//       {/* ── Desktop sidebar (lg+) ── */}
//       <div
//         className="hidden lg:flex flex-col bg-white"
//         style={{
//           fontFamily: "'Sora', 'Segoe UI', sans-serif",
//           width: "300px",
//           height: "calc(100vh - 100px)",
//           borderRadius: "0px 20px 20px 0px",
//           overflow: "hidden",
//           position: "sticky",
//           top: "100px",
//           alignSelf: "flex-start",
//         }}
//       >
//         {sidebarContent}
//       </div>

//       {/* ── Mobile/tablet drawer overlay (below lg) ── */}
//       {/* Backdrop */}
//       <div
//         className={`lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
//           isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={onClose}
//       />

//       {/* Drawer panel */}
//       <div
//         className={`lg:hidden fixed top-0 left-0 h-full z-50 bg-white flex flex-col transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//         style={{
//           width: "min(320px, 85vw)",
//           fontFamily: "'Sora', 'Segoe UI', sans-serif",
//           borderRadius: "0 20px 20px 0",
//         }}
//       >
//         {/* Drawer header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//           <span className="font-bold text-[18px] text-black">Filters</span>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-gray-100 transition-colors"
//           >
//             <CloseIcon fontSize="small" />
//           </button>
//         </div>
//         {sidebarContent}
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//       `}</style>
//     </>
//   );
// }