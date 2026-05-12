import { useState, useMemo, useCallback } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ProductsGrid from "../components/product/ProductsGrid";
import { mockProducts } from "../features/products/mockProducts";


const Products = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading] = useState(false);

  /* ── Filtered list ── */
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  /* ── Handlers ── */
  const handleView   = useCallback((p) => console.log("View:", p.id), []);
  const handleEdit   = useCallback((p) => console.log("Edit:", p.id), []);
  const handleDelete = useCallback((p) => {
    if (window.confirm(`Delete "${p.name}"?`))
      setProducts((prev) => prev.filter((item) => item.id !== p.id));
  }, []);
  const handleAddProduct = useCallback(() => console.log("Add product"), []);

  return (
    <main className="h-full overflow-y-auto bg-gray-50 p-6">

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-4 mb-5">

        {/* Search input */}
        <div className="relative flex items-center w-full max-w-sm">
          <span className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
            <SearchIcon sx={{ fontSize: 18 }} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-8 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 text-gray-400 hover:text-gray-600 transition cursor-pointer flex items-center"
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </button>
          )}
        </div>

        {/* Add Products button */}
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md shadow-indigo-200 transition-all duration-150 cursor-pointer whitespace-nowrap"
        >
          <AddIcon sx={{ fontSize: 18 }} />
          Add Products
        </button>
      </div>

      {/* ── Results count ── */}
      {!loading && (
        <p className="text-xs text-gray-400 font-medium mb-4">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          {searchQuery ? ` for "${searchQuery}"` : ""}
        </p>
      )}

      {/* ── Product grid ── */}
      <ProductsGrid
        products={filteredProducts}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  );
};

export default Products;
