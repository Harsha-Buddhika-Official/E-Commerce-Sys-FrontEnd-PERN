import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";

// Format product tag from BEST_SELLER to Best Seller
const formatProductTag = (tag) => {
  if (!tag) return null;
  return tag
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const ProductGrid = ({ title = "Best Sellers", products, loading, error }) => {
  const navigate = useNavigate();

  if (loading)
    return (
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
      />
    );

  if (error)
    return (
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
      >
        <div className="bg-white p-6 rounded-lg">
          <p className="text-red-600">Error loading products: {error}</p>
        </div>
      </div>
    );

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-8">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-center font-semibold mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {title}
        </h1>
        {loading ? (
          <div className="text-center py-10">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 auto-rows-fr">
            {products.map((product) => {
              const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
              // Transform attributes array to array of strings for specs (only values)
              const specs = product.attributes?.map(attr => attr.value) || [];
              return (
                <ProductCard
                  key={product.product_id}
                  id={product.product_id}
                  image={primaryImage?.image_url || "/placeholder.png"}
                  title={product.name}
                  specs={specs}
                  price={`Rs. ${parseFloat(product.selling_price).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  inStock={product.stock_quantity > 0}
                  badge={formatProductTag(product.product_tag)}
                  onCardClick={() => handleProductClick(product.product_id)}
                  onAddToCart={() => alert("Added to cart!")}
                  category={product.category_name}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
