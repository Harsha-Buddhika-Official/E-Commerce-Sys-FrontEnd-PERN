import { useState, useEffect } from "react";
import ProductCard from "./ProductCard.jsx";
import { fetchProductsBySection } from "../services/productService.js";

const ProductGrid = ({ title = "Best Sellers", section = "best-sellers" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-480 mx-auto px-4 md:px-8 lg:px-80 py-8">
      <h1 className="text-center font-semibold mb-6" style={{ fontSize: '60px', fontFamily: 'Inter, sans-serif' }}>
        {title}
      </h1>
      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.title}
              specs={product.specs}
              price={product.price}
              inStock={product.inStock}
              badge={product.badge}
              onAddToCart={() => alert("Added to cart!")}
              category={product.category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
