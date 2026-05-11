import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";

const ProductGrid = ({ products, onProductClick, onAddToCart }) => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    if (onProductClick) {
      onProductClick(productId);
    } else {
      navigate(`/product/${productId}`);
    }
  };

  const handleAddToCart = (productId) => {
    if (onAddToCart) {
      onAddToCart(productId);
    } else {
      alert("Added to cart!");
    }
  };

  return (
    <div className="product-grid grid gap-5">
      {products.map((product) => {
        const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
        const specs = product.attributes?.map(attr => attr.value) || [];
        return (
          <ProductCard
            key={product.product_id}
            id={product.product_id}
            image={primaryImage?.image_url || "/placeholder.png"}
            title={product.name}
            specs={specs}
            price={`Rs. ${parseFloat(product.discounted_price).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            inStock={product.stock_quantity > 0}
            category={product.category_name}
            onCardClick={() => handleProductClick(product.product_id)}
            onAddToCart={() => handleAddToCart(product.product_id)}
          />
        );
      })}
    </div>
  );
};

export default ProductGrid;
