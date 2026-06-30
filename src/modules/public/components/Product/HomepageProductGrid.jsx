import { useNavigate } from "react-router-dom";
import { addProductToServer } from "../../features/cart/service/cart.service.js";
import ProductCard from "./ProductCard.jsx";

const formatProductTag = (tag) => {
  if (!tag) return null;
  return tag
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// ── Skeleton card shown while loading ────────────────────────────────────────
const SkeletonCard = () => (
  <div className="relative bg-white border border-[#E6E6E6] rounded-[10px] overflow-hidden flex flex-col w-full animate-pulse min-h-[380px] sm:min-h-[420px] md:min-h-[450px]">
    {/* Image area */}
    <div className="relative w-full" style={{ paddingTop: "85%" }}>
      <div className="absolute inset-3 bg-gray-200 rounded-[10px]" />
    </div>
    {/* Text area */}
    <div className="flex flex-col flex-1 px-4 pb-4 pt-2 gap-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
      <div className="h-3 bg-gray-100 rounded w-4/6" />
      <div className="mt-auto flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-6 bg-gray-200 rounded-full w-1/4" />
      </div>
    </div>
  </div>
);

const HomepageProductGrid = ({
  title = "Best Sellers",
  products,
  loading,
  error,
  onProductClick,
  onAddToCart,
}) => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    if (onProductClick) {
      onProductClick(productId);
    } else {
      navigate(`/product/${productId}`);
    }
  };

  const handleAddToCart = (productOrId) => {
    const id = productOrId?.product_id ?? productOrId?.id ?? productOrId;
    if (!id) return;
    if (onAddToCart) {
      onAddToCart(productOrId);
    } else {
      addProductToServer(id).catch((e) => console.error(e));
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <h1
          className="text-center font-semibold mb-5 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {title}
        </h1>

        {error && (
          <div className="text-center py-10">
            <p className="text-red-600">Error loading products: {error}</p>
          </div>
        )}

        {/* Grid — skeletons while loading, real cards after */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6 auto-rows-fr">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : !error &&
              products.slice(0, 8).map((product) => {
                const primaryImage =
                  product.images?.find((img) => img.is_primary) ||
                  product.images?.[0];

                const specs =
                  product.attributes?.map((attr) => attr.value) || [];

                return (
                  <ProductCard
                    key={product.product_id}
                    id={product.product_id}
                    product={product}
                    image={primaryImage?.image_url || "/placeholder.png"}
                    title={product.name}
                    specs={specs}
                    price={`Rs. ${parseFloat(
                      product.discounted_price
                    ).toLocaleString("en-LK", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                    inStock={product.stock_quantity > 0}
                    badge={formatProductTag(product.product_tag)}
                    category={product.category_name}
                    onCardClick={() => handleProductClick(product.product_id)}
                    onAddToCart={handleAddToCart}
                  />
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default HomepageProductGrid;