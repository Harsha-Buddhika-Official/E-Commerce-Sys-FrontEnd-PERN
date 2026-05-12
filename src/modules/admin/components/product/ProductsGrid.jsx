import ProductCard from "./ProductCard";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";

/**
 * ProductsGrid
 * Renders a responsive grid of ProductCard components.
 * Handles empty and loading states internally.
 *
 * @param {Array}    products  - Array of product objects
 * @param {Boolean}  loading   - Whether data is being fetched
 * @param {Function} onView    - Passed to each ProductCard
 * @param {Function} onEdit    - Passed to each ProductCard
 * @param {Function} onDelete  - Passed to each ProductCard
 */
const ProductsGrid = ({ products = [], loading = false, onView, onEdit, onDelete }) => {
  if (loading) return <GridSkeleton />;

  if (products.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

/* ── Skeleton loader ──────────────────────────── */
const GridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
        <div className="bg-gray-200 h-48 w-full" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="space-y-1.5">
            <div className="h-3 bg-gray-100 rounded" />
            <div className="h-3 bg-gray-100 rounded" />
            <div className="h-3 bg-gray-100 rounded" />
          </div>
          <div className="flex gap-2 pt-1">
            <div className="h-7 bg-gray-200 rounded-lg flex-1" />
            <div className="h-7 bg-gray-200 rounded-lg flex-1" />
            <div className="h-7 bg-gray-200 rounded-lg flex-1" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* ── Empty state ──────────────────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
    <div className="p-5 bg-gray-100 rounded-full text-gray-400">
      <InventoryOutlinedIcon sx={{ fontSize: 48 }} />
    </div>
    <div>
      <p className="text-gray-700 font-semibold text-base">No products found</p>
      <p className="text-gray-400 text-sm mt-1">Try adjusting your search or add a new product.</p>
    </div>
  </div>
);

export default ProductsGrid;
