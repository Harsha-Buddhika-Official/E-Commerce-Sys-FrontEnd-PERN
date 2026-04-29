import ProductCard from "./ProductCard.jsx";

const ProductGrid = () => {
  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-80 py-8">
      <h1 className="text-center font-semibold mb-6" style={{ fontSize: '60px', fontFamily: 'Inter, sans-serif' }}>Best Sellers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard
          image="https://storage-asset.msi.com/global/picture/image/feature/nb/Cyborg15-A13V/images/cyborg-gpu-laptop.png"
          title="MSI Cyborg 15 A13VF"
          specs={[
            "Intel® Core™ i7-13620H",
            "GeForce RTX™ 4060",
            "15.6-inch Full HD IPS 144Hz",
            "16GB DDR5",
            "1TB NVMe",
          ]}
          price="Rs. 199,000.00"
          inStock={true}
          badge="Best Seller"
          onAddToCart={() => alert("Added to cart!")}
          category="Laptops"
        />
        <ProductCard
          image="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop"
          title="ASUS TUF Gaming F15"
          specs={[
            "Intel® Core™ i7-12700H",
            "GeForce RTX™ 3060",
            "15.6-inch 144Hz IPS",
            "16GB DDR4",
            "512GB SSD",
          ]}
          price="Rs. 179,000.00"
          inStock={true}
          badge="Best Seller"
          onAddToCart={() => alert("Added to cart!")}
          category="Laptops"
        />
        <ProductCard
          image="https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400"
          title="Dell XPS 15"
          specs={[
            "Intel® Core™ i9-12900H",
            "GeForce RTX™ 4070",
            "15.6-inch 4K OLED",
            "32GB DDR5",
            "1TB NVMe SSD",
          ]}
          price="Rs. 299,999.00"
          inStock={true}
          badge="Premium"
          onAddToCart={() => alert("Added to cart!")}
          category="Laptops"
        />
        <ProductCard
          image="https://images.unsplash.com/photo-1602088113235-229c19758e9f?w=400&h=300&fit=crop"
          title="Lenovo Legion Pro 5"
          specs={[
            "AMD Ryzen 7 6800H",
            "GeForce RTX™ 3070 Ti",
            "16-inch WQXGA IPS",
            "16GB DDR5",
            "512GB SSD",
          ]}
          price="Rs. 189,500.00"
          inStock={true}
          badge="New"
          onAddToCart={() => alert("Added to cart!")}
          category="Laptops"
        />
        <ProductCard
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
          title="MacBook Pro 16"
          specs={[
            "Apple M2 Pro Max",
            "16GB Unified Memory",
            "16-inch Liquid Retina XDR",
            "512GB SSD",
            "Up to 19 Hours Battery",
          ]}
          price="Rs. 349,900.00"
          inStock={true}
          badge="Premium"
          onAddToCart={() => alert("Added to cart!")}
          category="Laptops"
        />
        <ProductCard
          image="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop"
          title="Razer Blade 15"
          specs={[
            "Intel® Core™ i9-13900K",
            "GeForce RTX™ 4090",
            "15.6-inch FHD 144Hz",
            "32GB DDR5",
            "1TB NVMe SSD",
          ]}
          price="Rs. 399,999.00"
          inStock={false}
          badge="Gaming"
          onAddToCart={() => alert("Added to cart!")}
          category="Laptops"
        />
        <ProductCard
          image="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop"
          title="HP Pavilion 15"
          specs={[
            "Intel® Core™ i5-12450H",
            "Intel® Iris Xe Graphics",
            "15.6-inch FHD IPS",
            "8GB DDR4",
            "256GB SSD",
          ]}
          price="Rs. 89,999.00"
          inStock={true}
          badge="Budget"
          onAddToCart={() => alert("Added to cart!")}
          category="Laptops"
        />
        <ProductCard
          image="https://images.pexels.com/photos/18105/pexels-photo.jpg?w=400&h=300&fit=crop"
          title="Microsoft Surface Laptop 5"
          specs={[
            "Intel® Core™ i7-1255U",
            "Intel® Iris Xe",
            "13.5-inch PixelSense",
            "16GB LPDDR5",
            "512GB SSD",
          ]}
          price="Rs. 149,999.00"
          inStock={true}
          badge="Featured"
          onAddToCart={() => alert("Added to cart!")}
          category="Laptops"
        />
      </div>
    </div>
  );
};

export default ProductGrid;
