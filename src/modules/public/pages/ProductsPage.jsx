import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FilterBar from "../components/Filter/FilterBar.jsx";
import ProductGrid from "../components/Product/ProductGrid.jsx";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import { useProductFilter } from "../features/products/hooks/useProductFilter.js";
import { addProductToServer } from "../features/cart/service/cart.service.js";

const PRODUCTS_PER_PAGE = 16;

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryParam  = searchParams.get("category") || "";
  const navigate       = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const {
    selectedCat,
    filterOptions,
    filters,
    products,
    loadingOptions,
    loadingProducts,
    error,
    isValueChecked,
    toggleAttributeValue,
    setPriceRange,
    clearFilters,
    activeFilterCount,
  } = useProductFilter();

  // reset to page 1 whenever products list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  // lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = filterDrawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [filterDrawerOpen]);

  // ── Pagination ──────────────────────────────────────────
  const totalPages      = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex      = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handleProductClick = (productId) => navigate(`/product/${productId}`);
  const handleAddToCart = (productOrId) => {
    const id = productOrId?.product_id ?? productOrId?.id ?? productOrId;
    if (!id) return;
    addProductToServer(id).catch((e) => console.error(e));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const max   = window.innerWidth < 640 ? 5 : totalPages;
    let start   = Math.max(1, currentPage - Math.floor(max / 2));
    let end     = Math.min(totalPages, start + max - 1);
    if (end - start < max - 1) start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const loading = loadingProducts;

  return (
    <div
      className="w-full min-h-screen bg-[#f5f5f5]"
      style={{ fontFamily: "'Sora','Segoe UI',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        .product-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1200px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 860px)  { .product-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px)  { .product-grid { grid-template-columns: repeat(2, 1fr); } }

        .page-padded { padding-left: 350px; padding-right: 350px; }
        @media (max-width: 1600px) { .page-padded { padding-left: 160px; padding-right: 160px; } }
        @media (max-width: 1280px) { .page-padded { padding-left: 60px;  padding-right: 60px;  } }
        @media (max-width: 1024px) { .page-padded { padding-left: 32px;  padding-right: 32px;  } }
        @media (max-width: 640px)  { .page-padded { padding-left: 12px;  padding-right: 12px;  } }

        /* Filter drawer slide-in */
        .filter-drawer {
          position: fixed;
          top: 0; left: 0;
          width: 85vw;
          max-width: 320px;
          height: 100dvh;
          background: #fff;
          z-index: 50;
          overflow-y: auto;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          padding: 20px 16px 32px;
        }
        .filter-drawer.open { transform: translateX(0); }

        .filter-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 49;
        }
        .filter-backdrop.open { display: block; }
      `}</style>

      {/* ── Mobile filter drawer ── */}
      <div className={`filter-backdrop ${filterDrawerOpen ? "open" : ""}`}
           onClick={() => setFilterDrawerOpen(false)} />

      <div className={`filter-drawer ${filterDrawerOpen ? "open" : ""}`}>
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-[17px]" style={{ fontFamily: "'Sora',sans-serif" }}>
            Filters {activeFilterCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-[11px]">
                {activeFilterCount}
              </span>
            )}
          </span>
          <button onClick={() => setFilterDrawerOpen(false)}
                  className="p-1 hover:opacity-60 transition-opacity">
            <CloseIcon fontSize="small" />
          </button>
        </div>
        <FilterBar
          filterOptions={filterOptions}
          loadingOptions={loadingOptions}
          filters={filters}
          isValueChecked={isValueChecked}
          toggleAttributeValue={toggleAttributeValue}
          setPriceRange={setPriceRange}
          clearFilters={clearFilters}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {/* ── Header ── */}
      <div className="w-full flex items-center justify-center pt-8 sm:pt-10 pb-4 sm:pb-5">
        <h1
          className="text-[26px] sm:text-[40px] lg:text-[48px] font-bold text-black tracking-tight text-center px-4"
          style={{ fontFamily: "'Sora','Segoe UI',sans-serif" }}
        >
          {selectedCat?.name || categoryParam || "Products"}
        </h1>
      </div>

      {/* ── Content area ── */}
      <div className="page-padded pb-16">

        {/* ── Filter bar — desktop only; mobile gets the drawer button ── */}
        <div className="mb-5 sm:mb-6">
          {/* Desktop filter bar */}
          <div className="hidden sm:block">
            <FilterBar
              filterOptions={filterOptions}
              loadingOptions={loadingOptions}
              filters={filters}
              isValueChecked={isValueChecked}
              toggleAttributeValue={toggleAttributeValue}
              setPriceRange={setPriceRange}
              clearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>

          {/* Mobile: filter trigger row */}
          <div className="flex sm:hidden items-center justify-between">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:border-black hover:text-black transition-all"
            >
              <TuneIcon style={{ fontSize: 18 }} />
              Filters
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[10px]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {!loading && !error && (
              <p className="text-gray-400 text-xs">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {/* ── product count — desktop only ── */}
        {!loading && !error && (
          <p className="hidden sm:block text-gray-400 text-sm mb-4">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* ── Product grid ── */}
        {loading ? (
          <div className="product-grid grid gap-2.5 sm:gap-5">
            {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <div
                key={i}
                className="rounded-[10px] bg-white border border-[#E6E6E6] animate-pulse"
                style={{ height: "320px" }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-600 text-base sm:text-lg font-medium">
              Error loading products: {error}
            </p>
          </div>
        ) : currentProducts.length > 0 ? (
          <ProductGrid
            products={currentProducts}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <div className="text-center py-16 sm:py-24">
            <p className="text-gray-400 text-base sm:text-lg font-medium">
              No products found
              {activeFilterCount > 0 ? " matching your filters" : " in this category"}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 rounded-full border border-black text-black text-sm font-semibold hover:bg-black hover:text-white transition-all"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && !error && products.length > PRODUCTS_PER_PAGE && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 mt-10 sm:mt-12 flex-wrap">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 text-gray-600 hover:border-black hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-white"
            >
              <KeyboardArrowLeftIcon fontSize="small" />
            </button>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full font-semibold text-[12px] sm:text-[13px] transition-all
                    ${currentPage === page
                      ? "bg-black text-white border border-black"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-black hover:text-black"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 text-gray-600 hover:border-black hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-white"
            >
              <KeyboardArrowRightIcon fontSize="small" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}