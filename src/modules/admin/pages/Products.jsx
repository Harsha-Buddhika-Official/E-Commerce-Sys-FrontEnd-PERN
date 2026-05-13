import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon                from "@mui/icons-material/Search";
import CloseIcon                 from "@mui/icons-material/Close";
import AddIcon                   from "@mui/icons-material/Add";
import FilterListOutlinedIcon    from "@mui/icons-material/FilterListOutlined";
import ViewListOutlinedIcon      from "@mui/icons-material/ViewListOutlined";
import GridViewOutlinedIcon      from "@mui/icons-material/GridViewOutlined";
import VisibilityOutlinedIcon    from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon          from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InventoryOutlinedIcon     from "@mui/icons-material/InventoryOutlined";
import KeyboardArrowLeftIcon     from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon    from "@mui/icons-material/KeyboardArrowRight";
import WarningAmberOutlinedIcon  from "@mui/icons-material/WarningAmberOutlined";
import ProductsGrid              from "../components/product/ProductsGrid";
import { mockProducts }          from "../features/products/mockProducts";

// ─── Font constants — leaf elements only, never on wrapper divs ───────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Pagination config ────────────────────────────────────────────────────────
const GRID_PER_PAGE = 10;
const LIST_PER_PAGE = 12;

// ─── Derive category list from products ───────────────────────────────────────
const deriveCategories = (products) => [
  "All",
  ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
];

// ─── Format price helper ──────────────────────────────────────────────────────
const fmt = (amount) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 2,
  }).format(amount ?? 0);

// ══════════════════════════════════════════════════════════════════════════════
// DELETE CONFIRM MODAL
// ══════════════════════════════════════════════════════════════════════════════
function DeleteModal({ product, onConfirm, onCancel }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="bg-white rounded-2xl p-7 flex flex-col gap-4 w-full"
        style={{ maxWidth: 380, border: "1px solid #f0f0f0", boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
            style={{ backgroundColor: "#fef2f2" }}
          >
            <WarningAmberOutlinedIcon style={{ fontSize: 20, color: "#e53935" }} />
          </div>
          <h3 style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>
            Delete Product
          </h3>
        </div>

        <p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
          Are you sure you want to delete{" "}
          <span style={{ fontWeight: 700, color: "#111" }}>"{product.name}"</span>?
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            style={{ ...INTER, fontSize: 13, fontWeight: 600, background: "#fff", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(product)}
            className="flex-1 py-2.5 rounded-xl text-white transition-all hover:bg-red-600"
            style={{ ...INTER, fontSize: 13, fontWeight: 700, background: "#e53935", border: "none", cursor: "pointer" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VIEW DETAIL MODAL
// ══════════════════════════════════════════════════════════════════════════════
function ViewModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="bg-white rounded-2xl overflow-hidden w-full flex flex-col"
        style={{ maxWidth: 500, maxHeight: "90vh", border: "1px solid #f0f0f0", boxShadow: "0 8px 40px rgba(0,0,0,0.16)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
          <h3 style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>
            Product Details
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-transparent border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all cursor-pointer"
          >
            <CloseIcon style={{ fontSize: 16 }} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">
          {/* Product image */}
          <div
            className="w-full rounded-xl bg-[#f7f7f7] border border-[#f0f0f0] flex items-center justify-center overflow-hidden"
            style={{ height: 200 }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full object-contain p-6"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <InventoryOutlinedIcon style={{ fontSize: 52, color: "#ddd" }} />
                <span style={{ ...INTER, fontSize: 11, color: "#bbb" }}>No Image</span>
              </div>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Product Name", value: product.name,     full: true },
              { label: "Brand",        value: product.brand             },
              { label: "Category",     value: product.category          },
              { label: "Stock Count",  value: product.stockCount        },
              ...(product.specs ? [{ label: "Specs", value: product.specs, full: true }] : []),
            ].map(({ label, value, full }) => (
              <div key={label} className={full ? "col-span-2" : ""}>
                <p
                  className="mb-1"
                  style={{ ...INTER, fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}
                >
                  {label}
                </p>
                <p style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#111" }}>
                  {value ?? "—"}
                </p>
              </div>
            ))}
          </div>

          {/* Pricing block */}
          <div
            className="rounded-xl p-4 flex flex-col gap-2.5"
            style={{ backgroundColor: "#f9f9f9", border: "1px solid #ebebeb" }}
          >
            <p style={{ ...SORA, fontSize: 11, fontWeight: 800, color: "#111", letterSpacing: "0.08em" }}>
              PRICING
            </p>
            {[
              { label: "Base Price",    value: fmt(product.basePrice)     },
              { label: "Selling Price", value: fmt(product.sellingPrice), accent: true  },
              { label: "Discount",      value: fmt(product.discountPrice) },
            ].map(({ label, value, accent }) => (
              <div key={label} className="flex items-center justify-between">
                <span style={{ ...INTER, fontSize: 12, color: "#888" }}>{label}</span>
                <span
                  style={{
                    ...INTER,
                    fontSize: 13,
                    fontWeight: 700,
                    color: accent ? "#e53935" : "#111",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LIST VIEW ROW
// ══════════════════════════════════════════════════════════════════════════════
function ProductListRow({ product, onView, onEdit, onDelete }) {
  const inStock = product.stockCount > 0;
  return (
    <tr className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors duration-100">
      {/* Thumbnail */}
      <td style={{ padding: "11px 16px", width: 56 }}>
        <div
          className="flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0"
          style={{ width: 44, height: 44, backgroundColor: "#f5f5f5", border: "1px solid #ebebeb" }}
        >
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
          ) : (
            <InventoryOutlinedIcon style={{ fontSize: 20, color: "#ccc" }} />
          )}
        </div>
      </td>

      {/* Name + brand */}
      <td style={{ padding: "11px 16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>
        <p style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {product.name}
        </p>
        <p style={{ ...INTER, fontSize: 11, color: "#999" }}>{product.brand}</p>
      </td>

      {/* Category */}
      <td style={{ padding: "11px 16px" }}>
        <span
          className="px-2 py-0.5 rounded-md"
          style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#555", backgroundColor: "#f0f0f0" }}
        >
          {product.category}
        </span>
      </td>

      {/* Stock */}
      <td style={{ padding: "11px 16px" }}>
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: inStock ? "#16a34a" : "#ef4444" }}
          />
          <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#111" }}>
            {product.stockCount}
          </span>
        </div>
      </td>

      {/* Selling price */}
      <td style={{ padding: "11px 16px" }}>
        <span style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#e53935" }}>
          {fmt(product.sellingPrice)}
        </span>
      </td>

      {/* Actions */}
      <td style={{ padding: "11px 16px" }}>
        <div className="flex items-center gap-1.5">
          <ActionBtn icon={<VisibilityOutlinedIcon style={{ fontSize: 13 }} />}   label="View"   variant="ghost"   onClick={() => onView(product)}   />
          <ActionBtn icon={<EditOutlinedIcon style={{ fontSize: 13 }} />}          label="Edit"   variant="dark"    onClick={() => onEdit(product)}   />
          <ActionBtn icon={<DeleteOutlineOutlinedIcon style={{ fontSize: 13 }} />} label="Delete" variant="danger"  onClick={() => onDelete(product)} />
        </div>
      </td>
    </tr>
  );
}

// ─── Shared action button ─────────────────────────────────────────────────────
const VARIANT_STYLES = {
  ghost:  { background: "#fff",     border: "1px solid #e5e5e5", color: "#555"  },
  dark:   { background: "#111",     border: "1px solid #111",    color: "#fff"  },
  danger: { background: "#e53935",  border: "1px solid #e53935", color: "#fff"  },
};

function ActionBtn({ icon, label, variant = "ghost", onClick }) {
  const s = VARIANT_STYLES[variant];
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 transition-all duration-150 hover:opacity-80"
      style={{ ...INTER, fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 8, cursor: "pointer", ...s }}
    >
      {icon}
      {label}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCTS PAGE
// ══════════════════════════════════════════════════════════════════════════════
const Products = () => {
  const [products,     setProducts]     = useState(mockProducts);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [category,     setCategory]     = useState("All");
  const [viewMode,     setViewMode]     = useState("grid"); // "grid" | "list"
  const [page,         setPage]         = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget,   setViewTarget]   = useState(null);
  const [loading]                       = useState(false);

  /* Category list — derived once from products */
  const categories = useMemo(() => deriveCategories(products), [products]);

  /* Filtered list */
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat    = category === "All" || p.category === category;
      const matchSearch = !q || [p.name, p.brand, p.category].some((f) => f?.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [products, searchQuery, category]);

  /* Pagination */
  const perPage    = viewMode === "grid" ? GRID_PER_PAGE : LIST_PER_PAGE;
  const totalPages = Math.ceil(filtered.length / perPage);
  const startIdx   = (page - 1) * perPage;
  const paginated  = filtered.slice(startIdx, startIdx + perPage);

  const handlePage     = (p) => { if (p >= 1 && p <= totalPages) setPage(p); };
  const handleSearch   = (v) => { setSearchQuery(v); setPage(1); };
  const handleCategory = (c) => { setCategory(c);    setPage(1); };
  const handleViewMode = (m) => { setViewMode(m);    setPage(1); };

  /* Callbacks */
  const handleView   = useCallback((p) => setViewTarget(p),   []);
  const handleEdit   = useCallback((p) => console.log("Edit:", p.id), []);
  const handleDelete = useCallback((p) => setDeleteTarget(p), []);
  const handleDeleteConfirm = useCallback((p) => {
    setProducts((prev) => prev.filter((item) => item.id !== p.id));
    setDeleteTarget(null);
  }, []);
  const navigate = useNavigate();
  const handleAddProduct = useCallback(() => navigate("add"), [navigate]);

  /* Page number array */
  const pageNums = () => {
    const max = 5;
    let s = Math.max(1, page - Math.floor(max / 2));
    let e = Math.min(totalPages, s + max - 1);
    if (e - s < max - 1) s = Math.max(1, e - max + 1);
    return Array.from({ length: e - s + 1 }, (_, i) => s + i);
  };

  return (
    <main className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* Modals */}
      <DeleteModal
        product={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
      <ViewModal
        product={viewTarget}
        onClose={() => setViewTarget(null)}
      />

      {/* ── Toolbar row ── */}
      <div className="flex items-center gap-3 flex-wrap mb-4">

        {/* Search */}
        <div
          className="relative flex items-center"
          style={{ minWidth: 200, maxWidth: 260 }}
        >
          <span className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
            <SearchIcon style={{ fontSize: 17 }} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-8 py-2 text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            style={{ ...INTER, fontSize: 13 }}
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-2.5 text-gray-400 hover:text-gray-600 transition cursor-pointer flex items-center bg-transparent border-none"
            >
              <CloseIcon style={{ fontSize: 15 }} />
            </button>
          )}
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <FilterListOutlinedIcon style={{ fontSize: 17, color: "#bbb", flexShrink: 0 }} />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => handleCategory(c)}
              className="px-3 py-1.5 rounded-full border text-[12px] font-semibold whitespace-nowrap transition-all duration-150"
              style={{
                ...INTER,
                backgroundColor: category === c ? "#111"     : "#fff",
                borderColor:     category === c ? "#111"     : "#e5e7eb",
                color:           category === c ? "#fff"     : "#555",
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div
          className="flex items-center rounded-xl overflow-hidden border border-[#e5e7eb] flex-shrink-0"
        >
          {[
            { mode: "grid", Icon: GridViewOutlinedIcon  },
            { mode: "list", Icon: ViewListOutlinedIcon  },
          ].map(({ mode, Icon }, i) => (
            <button
              key={mode}
              onClick={() => handleViewMode(mode)}
              style={{
                width: 36, height: 36,
                backgroundColor: viewMode === mode ? "#111" : "#fff",
                color:           viewMode === mode ? "#fff" : "#999",
                border:          "none",
                borderLeft:      i > 0 ? "1px solid #e5e7eb" : "none",
                cursor:          "pointer",
                display:         "flex", alignItems: "center", justifyContent: "center",
                transition:      "all 0.15s",
              }}
            >
              <Icon style={{ fontSize: 18 }} />
            </button>
          ))}
        </div>

        {/* Add Products */}
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-1.5 text-white transition-all duration-150 hover:bg-[#1558c0] whitespace-nowrap flex-shrink-0"
          style={{
            ...SORA,
            fontSize: 13,
            fontWeight: 700,
            backgroundColor: "#1a73e8",
            padding: "8px 18px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            height: 36,
          }}
        >
          <AddIcon style={{ fontSize: 17 }} />
          Add Products
        </button>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="mb-4" style={{ ...INTER, fontSize: 12, color: "#aaa" }}>
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          {searchQuery ? ` for "${searchQuery}"` : ""}
          {category !== "All" ? ` in ${category}` : ""}
        </p>
      )}

      {/* ── GRID VIEW — passes through to your existing ProductsGrid ── */}
      {viewMode === "grid" && (
        <ProductsGrid
          products={paginated}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* ── LIST VIEW ── */}
      {viewMode === "list" && (
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse"
              style={{ tableLayout: "fixed", minWidth: 700 }}
            >
              <colgroup>
                <col style={{ width: "6%"  }} />  {/* thumb     */}
                <col style={{ width: "28%" }} />  {/* name      */}
                <col style={{ width: "14%" }} />  {/* category  */}
                <col style={{ width: "10%" }} />  {/* stock     */}
                <col style={{ width: "16%" }} />  {/* price     */}
                <col style={{ width: "26%" }} />  {/* actions   */}
              </colgroup>
              <thead>
                <tr className="border-b border-[#f0f0f0]">
                  {["", "Product", "Category", "Stock", "Price", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left"
                      style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#111", padding: "13px 16px" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16" style={{ ...INTER, fontSize: 14, color: "#bbb" }}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((p) => (
                    <ProductListRow
                      key={p.id}
                      product={p}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
          <p style={{ ...INTER, fontSize: 12, color: "#aaa" }}>
            Showing {startIdx + 1}–{Math.min(startIdx + perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <KeyboardArrowLeftIcon style={{ fontSize: 16 }} />
            </button>

            {pageNums().map((n) => (
              <button
                key={n}
                onClick={() => handlePage(n)}
                className="flex items-center justify-center w-8 h-8 rounded-lg border text-[12px] font-semibold transition-all"
                style={{
                  ...INTER,
                  backgroundColor: page === n ? "#111"    : "#fff",
                  borderColor:     page === n ? "#111"    : "#e5e7eb",
                  color:           page === n ? "#fff"    : "#555",
                  cursor: "pointer",
                }}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => handlePage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <KeyboardArrowRightIcon style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      )}

    </main>
  );
};

export default Products;