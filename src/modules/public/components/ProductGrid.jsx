import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";
import { fetchProductsBySection } from "../features/products/api/productService.js";

const ProductGrid = ({ title = "Best Sellers", section = "best-sellers" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products based on section
    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchProductsBySection(section);
      setProducts(data);
      setLoading(false);
    };

    loadProducts();
  }, [section]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center font-semibold mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl" style={{ fontFamily: 'Inter, sans-serif' }}>
          {title}
        </h1>
        {loading ? (
          <div className="text-center py-10">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 auto-rows-fr">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                title={product.title}
                specs={product.specs}
                price={product.price}
                inStock={product.inStock}
                badge={product.badge}
                onCardClick={() => handleProductClick(product.id)}
                onAddToCart={() => alert("Added to cart!")}
                category={product.category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
