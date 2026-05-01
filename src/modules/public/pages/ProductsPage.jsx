import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// Sample product data by category
const PRODUCTS_BY_CATEGORY = {
  "Processors": [
    {
      id: 1,
      title: "INTEL CORE i9-14900K",
      specs: ["14 Cores / 32 Threads", "Up to 6.0GHz", "Intel UHD Graphics"],
      price: "Rs. 238,000.00",
      image: "https://via.placeholder.com/200?text=i9-14900K",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 2,
      title: "INTEL CORE i5-13400",
      specs: ["10 Cores / 16 Threads", "Up to 4.6GHz", "Intel UHD Graphics"],
      price: "Rs. 74,000.00",
      image: "https://via.placeholder.com/200?text=i5-13400",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 3,
      title: "INTEL CORE i5-12600K",
      specs: ["10 Cores / 16 Threads", "Up to 4.9GHz", "Unlocked"],
      price: "Rs. 52,000.00",
      image: "https://via.placeholder.com/200?text=i5-12600K",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 4,
      title: "AMD RYZEN 7 5700X",
      specs: ["8 Cores / 16 Threads", "Up to 4.6GHz", "Socket AM4"],
      price: "Rs. 78,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-5700X",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 5,
      title: "AMD RYZEN 5 5600X",
      specs: ["6 Cores / 12 Threads", "Up to 4.6GHz", "Gaming Optimized"],
      price: "Rs. 68,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-5600X",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 6,
      title: "AMD RYZEN 5 7600",
      specs: ["6 Cores / 12 Threads", "Up to 5.2GHz", "Socket AM5"],
      price: "Rs. 94,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-5600",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 7,
      title: "INTEL CORE i5-12400F",
      specs: ["6 Cores / 12 Threads", "Up to 4.4GHz", "Boot Xsave CPU"],
      price: "Rs. 52,000.00",
      image: "https://via.placeholder.com/200?text=i5-12400F",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 8,
      title: "AMD RYZEN 5 5500",
      specs: ["6 Cores / 12 Threads", "Up to 4.2GHz", "Budget Friendly"],
      price: "Rs. 45,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-5500",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 9,
      title: "INTEL CORE i9-13900K",
      specs: ["24 Cores / 32 Threads", "Up to 5.8GHz", "High Performance"],
      price: "Rs. 218,000.00",
      image: "https://via.placeholder.com/200?text=i9-13900K",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 10,
      title: "AMD RYZEN 7 7700X",
      specs: ["8 Cores / 16 Threads", "Up to 5.4GHz", "Socket AM5"],
      price: "Rs. 125,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-7700X",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 11,
      title: "INTEL CORE i7-13700K",
      specs: ["16 Cores / 24 Threads", "Up to 5.4GHz", "Unlocked"],
      price: "Rs. 165,000.00",
      image: "https://via.placeholder.com/200?text=i7-13700K",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 12,
      title: "AMD RYZEN 5 5600",
      specs: ["6 Cores / 12 Threads", "Up to 4.6GHz", "Socket AM4"],
      price: "Rs. 48,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-5600",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 13,
      title: "INTEL CORE i5-14600K",
      specs: ["14 Cores / 20 Threads", "Up to 5.3GHz", "Latest Gen"],
      price: "Rs. 98,000.00",
      image: "https://via.placeholder.com/200?text=i5-14600K",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 14,
      title: "AMD RYZEN 7 7700",
      specs: ["8 Cores / 16 Threads", "Up to 5.4GHz", "Socket AM5"],
      price: "Rs. 115,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-7700",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 15,
      title: "INTEL CORE i3-13100",
      specs: ["4 Cores / 8 Threads", "Up to 4.5GHz", "Budget Friendly"],
      price: "Rs. 32,000.00",
      image: "https://via.placeholder.com/200?text=i3-13100",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 16,
      title: "AMD RYZEN 5 7600X",
      specs: ["6 Cores / 12 Threads", "Up to 5.3GHz", "Socket AM5"],
      price: "Rs. 88,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-7600X",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 17,
      title: "INTEL CORE i9-14900KF",
      specs: ["24 Cores / 32 Threads", "Up to 6.0GHz", "No Integrated GPU"],
      price: "Rs. 228,000.00",
      image: "https://via.placeholder.com/200?text=i9-14900KF",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 18,
      title: "AMD RYZEN 9 7950X",
      specs: ["16 Cores / 32 Threads", "Up to 5.7GHz", "Premium"],
      price: "Rs. 298,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-9950X",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 19,
      title: "INTEL CORE i7-13700KF",
      specs: ["16 Cores / 24 Threads", "Up to 5.4GHz", "No Integrated GPU"],
      price: "Rs. 155,000.00",
      image: "https://via.placeholder.com/200?text=i7-13700KF",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 20,
      title: "AMD RYZEN 7 5800X",
      specs: ["8 Cores / 16 Threads", "Up to 4.7GHz", "Socket AM4"],
      price: "Rs. 85,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-5800X",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 21,
      title: "INTEL CORE i5-13600K",
      specs: ["14 Cores / 20 Threads", "Up to 5.1GHz", "Unlocked"],
      price: "Rs. 88,000.00",
      image: "https://via.placeholder.com/200?text=i5-13600K",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 22,
      title: "AMD RYZEN 5 5500X",
      specs: ["6 Cores / 12 Threads", "Up to 4.6GHz", "OEM Version"],
      price: "Rs. 52,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-5500X",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 23,
      title: "INTEL CORE i7-12700K",
      specs: ["12 Cores / 20 Threads", "Up to 5.0GHz", "Unlocked"],
      price: "Rs. 125,000.00",
      image: "https://via.placeholder.com/200?text=i7-12700K",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 24,
      title: "AMD RYZEN 9 7900X",
      specs: ["12 Cores / 24 Threads", "Up to 5.4GHz", "Socket AM5"],
      price: "Rs. 245,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-9900X",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 25,
      title: "INTEL CORE i5-12400",
      specs: ["6 Cores / 12 Threads", "Up to 4.4GHz", "Efficient"],
      price: "Rs. 48,000.00",
      image: "https://via.placeholder.com/200?text=i5-12400",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 26,
      title: "AMD RYZEN 3 5100",
      specs: ["4 Cores / 8 Threads", "Up to 3.9GHz", "Budget Friendly"],
      price: "Rs. 28,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-3100",
      inStock: false,
      badge: "Pre Order",
      category: "Processor",
    },
    {
      id: 27,
      title: "INTEL CORE i9-12900K",
      specs: ["16 Cores / 24 Threads", "Up to 5.2GHz", "Older Gen"],
      price: "Rs. 185,000.00",
      image: "https://via.placeholder.com/200?text=i9-12900K",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 28,
      title: "AMD RYZEN 7 7800X3D",
      specs: ["8 Cores / 16 Threads", "Up to 5.0GHz", "3D Cache"],
      price: "Rs. 158,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-7800X3D",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 29,
      title: "INTEL CORE i3-12100",
      specs: ["4 Cores / 8 Threads", "Up to 4.3GHz", "Budget"],
      price: "Rs. 28,000.00",
      image: "https://via.placeholder.com/200?text=i3-12100",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 30,
      title: "AMD RYZEN 5 8600G",
      specs: ["6 Cores / 12 Threads", "Up to 5.0GHz", "Integrated GPU"],
      price: "Rs. 75,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-8600G",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 31,
      title: "INTEL CORE i7-14700K",
      specs: ["20 Cores / 28 Threads", "Up to 5.6GHz", "Latest Gen"],
      price: "Rs. 188,000.00",
      image: "https://via.placeholder.com/200?text=i7-14700K",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 32,
      title: "AMD RYZEN 9 5900X",
      specs: ["12 Cores / 24 Threads", "Up to 4.7GHz", "Socket AM4"],
      price: "Rs. 158,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-5900X",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 33,
      title: "INTEL CORE i5-13500",
      specs: ["12 Cores / 16 Threads", "Up to 4.8GHz", "Efficient"],
      price: "Rs. 82,000.00",
      image: "https://via.placeholder.com/200?text=i5-13500",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 34,
      title: "AMD RYZEN 5 7500",
      specs: ["6 Cores / 12 Threads", "Up to 5.0GHz", "Budget Socket AM5"],
      price: "Rs. 82,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-7500",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 35,
      title: "INTEL CORE i9-13900KF",
      specs: ["24 Cores / 32 Threads", "Up to 5.8GHz", "No Integrated GPU"],
      price: "Rs. 208,000.00",
      image: "https://via.placeholder.com/200?text=i9-13900KF",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 36,
      title: "AMD RYZEN 7 7900X3D",
      specs: ["12 Cores / 24 Threads", "Up to 5.4GHz", "3D Cache"],
      price: "Rs. 285,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-7900X3D",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 37,
      title: "INTEL CORE i5-14600",
      specs: ["14 Cores / 20 Threads", "Up to 5.3GHz", "Efficient"],
      price: "Rs. 88,000.00",
      image: "https://via.placeholder.com/200?text=i5-14600",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 38,
      title: "AMD RYZEN 3 7100",
      specs: ["4 Cores / 8 Threads", "Up to 4.9GHz", "Budget Socket AM5"],
      price: "Rs. 38,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-7100",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 39,
      title: "INTEL CORE i7-12700KF",
      specs: ["12 Cores / 20 Threads", "Up to 5.0GHz", "No Integrated GPU"],
      price: "Rs. 115,000.00",
      image: "https://via.placeholder.com/200?text=i7-12700KF",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 40,
      title: "AMD RYZEN 5 3600",
      specs: ["6 Cores / 12 Threads", "Up to 4.2GHz", "Socket AM4"],
      price: "Rs. 42,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-3600",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 41,
      title: "INTEL CORE i3-13100F",
      specs: ["4 Cores / 8 Threads", "Up to 4.5GHz", "No Integrated GPU"],
      price: "Rs. 28,000.00",
      image: "https://via.placeholder.com/200?text=i3-13100F",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 42,
      title: "AMD RYZEN 9 7900",
      specs: ["12 Cores / 24 Threads", "Up to 5.4GHz", "Non-X Socket AM5"],
      price: "Rs. 225,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-9900",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 43,
      title: "INTEL CORE i7-14700KF",
      specs: ["20 Cores / 28 Threads", "Up to 5.6GHz", "No Integrated GPU"],
      price: "Rs. 178,000.00",
      image: "https://via.placeholder.com/200?text=i7-14700KF",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 44,
      title: "AMD RYZEN 7 5700",
      specs: ["8 Cores / 16 Threads", "Up to 4.3GHz", "Socket AM4"],
      price: "Rs. 72,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-5700",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 45,
      title: "INTEL CORE i5-12500K",
      specs: ["10 Cores / 16 Threads", "Up to 4.6GHz", "Unlocked"],
      price: "Rs. 68,000.00",
      image: "https://via.placeholder.com/200?text=i5-12500K",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 46,
      title: "AMD RYZEN 5 7600",
      specs: ["6 Cores / 12 Threads", "Up to 5.2GHz", "Socket AM5"],
      price: "Rs. 82,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-7600-2",
      inStock: false,
      badge: "Pre Order",
      category: "Processor",
    },
    {
      id: 47,
      title: "INTEL CORE i9-11900K",
      specs: ["8 Cores / 16 Threads", "Up to 5.3GHz", "Older Gen"],
      price: "Rs. 128,000.00",
      image: "https://via.placeholder.com/200?text=i9-11900K",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 48,
      title: "AMD RYZEN 7 8700G",
      specs: ["8 Cores / 16 Threads", "Up to 5.1GHz", "Integrated GPU"],
      price: "Rs. 125,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-8700G",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 49,
      title: "INTEL CORE i5-13600",
      specs: ["12 Cores / 16 Threads", "Up to 4.8GHz", "Non-K"],
      price: "Rs. 75,000.00",
      image: "https://via.placeholder.com/200?text=i5-13600",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 50,
      title: "AMD RYZEN 3 5100",
      specs: ["4 Cores / 8 Threads", "Up to 3.9GHz", "Socket AM4"],
      price: "Rs. 32,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-3100-2",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 51,
      title: "INTEL CORE i7-11700K",
      specs: ["8 Cores / 16 Threads", "Up to 5.0GHz", "Older Gen"],
      price: "Rs. 105,000.00",
      image: "https://via.placeholder.com/200?text=i7-11700K",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 52,
      title: "AMD RYZEN 5 8500G",
      specs: ["6 Cores / 12 Threads", "Up to 5.0GHz", "Integrated GPU"],
      price: "Rs. 68,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-8500G",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 53,
      title: "INTEL CORE i3-12100F",
      specs: ["4 Cores / 8 Threads", "Up to 4.3GHz", "No Integrated GPU"],
      price: "Rs. 24,000.00",
      image: "https://via.placeholder.com/200?text=i3-12100F",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 54,
      title: "AMD RYZEN 9 5950X",
      specs: ["16 Cores / 32 Threads", "Up to 4.9GHz", "Socket AM4"],
      price: "Rs. 298,000.00",
      image: "https://via.placeholder.com/200?text=Ryzen-5950X",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
    {
      id: 55,
      title: "INTEL CORE i7-13700",
      specs: ["16 Cores / 24 Threads", "Up to 5.2GHz", "Non-K"],
      price: "Rs. 148,000.00",
      image: "https://via.placeholder.com/200?text=i7-13700",
      inStock: true,
      badge: "In Stock",
      category: "Processor",
    },
  ],
  "Motherboard": [
    {
      id: 9,
      title: "ASUS ROG STRIX Z790-E",
      specs: ["Intel LGA 1700", "PCIe 5.0", "DDR5 Support"],
      price: "Rs. 85,000.00",
      image: "https://via.placeholder.com/200?text=Z790-E",
      inStock: true,
      badge: "In Stock",
      category: "Motherboard",
    },
    {
      id: 10,
      title: "MSI MPG B850E",
      specs: ["AMD AM5", "PCIe 5.0", "DDR5 Support"],
      price: "Rs. 72,000.00",
      image: "https://via.placeholder.com/200?text=B850E",
      inStock: true,
      badge: "In Stock",
      category: "Motherboard",
    },
  ],
  "Memory": [
    {
      id: 11,
      title: "CORSAIR DDR5 32GB",
      specs: ["6000MHz", "CAS 30", "RGB"],
      price: "Rs. 28,000.00",
      image: "https://via.placeholder.com/200?text=DDR5-32GB",
      inStock: true,
      badge: "In Stock",
      category: "Memory",
    },
    {
      id: 12,
      title: "G.SKILL DDR5 64GB",
      specs: ["6400MHz", "CAS 32", "High Speed"],
      price: "Rs. 55,000.00",
      image: "https://via.placeholder.com/200?text=DDR5-64GB",
      inStock: true,
      badge: "In Stock",
      category: "Memory",
    },
  ],
};

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "Processors";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const categoryProducts = PRODUCTS_BY_CATEGORY[categoryParam] || PRODUCTS_BY_CATEGORY["Processors"];
  
  // Calculate pagination
  const totalPages = Math.ceil(categoryProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = categoryProducts.slice(startIndex, endIndex);

  const handleAddToCart = (productId) => {
    console.log("Added product to cart:", productId);
    // TODO: Integrate with cart context/state management
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="w-full bg-[#f5f5f5]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');`}</style>
      
      {/* Sidebar - Limited to content height */}
      <div className="absolute left-0 top-[100px] w-[330px] bg-white z-10">
        <FilterSidebar category={categoryParam} onCollapse={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Main Content - Centered on full page */}
      <div className="flex justify-center my-4">
        <div className="flex flex-col items-center">
          {/* Category Title */}
          <div className="flex justify-center pt-[20px] pb-[30px]">
            <h1
              className="text-[42px] font-bold text-black tracking-tight"
              style={{ fontFamily: "'Sora', 'Segoe UI', sans-serif" }}
            >
              {categoryParam}
            </h1>
          </div>

          {/* Content Area - Centered */}
          <div className="pb-12">
            {/* Products Grid */}
            <div style={{ padding: '0px 50px 50px 50px' }}>
              {currentProducts.length > 0 ? (
                <div className="grid grid-cols-4" style={{ gap: '33px' }}>
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      image={product.image}
                      title={product.title}
                      specs={product.specs}
                      price={product.price}
                      inStock={product.inStock}
                      badge={product.badge}
                      category={product.category}
                      onAddToCart={() => handleAddToCart(product.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found in this category</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {categoryProducts.length > productsPerPage && (
              <div className="flex items-center justify-center gap-4 mt-12">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:border-black hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <KeyboardArrowLeftIcon fontSize="small" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`flex items-center justify-center w-9 h-9 rounded-full font-semibold text-[13px] transition-all ${
                        currentPage === page
                          ? "bg-red-500 text-white border border-red-500"
                          : "border border-gray-300 text-gray-700 hover:border-black hover:text-black"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:border-black hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <KeyboardArrowRightIcon fontSize="small" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
