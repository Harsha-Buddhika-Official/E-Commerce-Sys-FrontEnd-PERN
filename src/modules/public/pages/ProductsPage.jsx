import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FilterBar from "../components/Filter/FilterBar.jsx";
import ProductGrid from "../components/Product/ProductGrid.jsx";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useProducts } from "../features/products/hooks/useProducts.js";

// 4 cols × 4 rows = 16 per page
const PRODUCTS_PER_PAGE = 16;

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "Processors";
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  
  const { products, loading, error } = useProducts();

  // Filter products based on selected category name
  const filteredProducts = products.filter(p => p.category_name === categoryParam);

  /* Pagination */
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handleAddToCart  = (id) => console.log("Added to cart:", id);
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
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

  return (
    <div
      className="w-full min-h-screen bg-[#f5f5f5]"
      style={{ fontFamily: "'Sora','Segoe UI',sans-serif" }}
    >
      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        /* 4-col grid, responsive breakpoints */
        .product-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1200px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 860px)  { .product-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px)  { .product-grid { grid-template-columns: repeat(1, 1fr); } }

        /* 350px x-padding at full 1920px desktop — scales down gracefully */
        .page-padded { padding-left: 350px; padding-right: 350px; }
        @media (max-width: 1600px) { .page-padded { padding-left: 160px; padding-right: 160px; } }
        @media (max-width: 1280px) { .page-padded { padding-left: 60px;  padding-right: 60px;  } }
        @media (max-width: 1024px) { .page-padded { padding-left: 32px;  padding-right: 32px;  } }
        @media (max-width: 640px)  { .page-padded { padding-left: 16px;  padding-right: 16px;  } }
      `}</style>

      {/*
        ══════════════════════════════════════════════════════
        HEADER BLOCK
        Full viewport width → title genuinely centred on 1920px.
        ══════════════════════════════════════════════════════
      */}
      <div className="w-full flex items-center justify-center pt-10 pb-5">
        <h1
          className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-black tracking-tight text-center"
          style={{ fontFamily: "'Sora','Segoe UI',sans-serif" }}
        >
          {categoryParam}
        </h1>
      </div>

      {/*
        ══════════════════════════════════════════════════════
        CONTENT AREA — same horizontal padding for both
        the filter bar and the product grid, so they align.
        ══════════════════════════════════════════════════════
      */}
      <div className="page-padded pb-16">

        {/* ── Filter bar ── */}
        <div className="mb-6">
          <FilterBar category={categoryParam} />
        </div>

        {/* ── Product grid ── */}
        {loading ? (
          /* skeleton */
          <div className="product-grid grid gap-5">
            {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <div
                key={i}
                className="rounded-[10px] bg-white border border-[#E6E6E6] animate-pulse"
                style={{ height: "380px" }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-600 text-lg font-medium">Error loading products: {error}</p>
          </div>
        ) : currentProducts.length > 0 ? (
          <ProductGrid 
            products={currentProducts}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg font-medium">No products found in this category</p>
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && !error && filteredProducts.length > PRODUCTS_PER_PAGE && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-12 flex-wrap">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:border-black hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-white"
            >
              <KeyboardArrowLeftIcon fontSize="small" />
            </button>

            <div className="flex items-center gap-1.5">
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`flex items-center justify-center w-9 h-9 rounded-full font-semibold text-[13px] transition-all
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
              className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:border-black hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-white"
            >
              <KeyboardArrowRightIcon fontSize="small" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}