// Mock product data
const mockBestSellersProducts = [
  {
    id: 1,
    image: "https://redtech.lk/wp-content/uploads/2024/10/MSI-CYBORG-15-A13VEK.png",
    title: "MSI CYBORG 15 A13VF",
    specs: ["Intel Core i7-13620H", "GeForce RTX 4060", "15.6-inch FHD IPS", "16GB DDR5", "1TB NVMe SSD"],
    price: "Rs. 199,000.00",
    inStock: true,
    badge: "Best Seller",
    category: "Laptops"
  },
  {
    id: 2,
    image: "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2022/06/01-18-1-1.jpg/w=800,h=800,fit=crop",
    title: "APPLE MACBOOK PRO M2",
    specs: ["Apple M2 Chip", "8-Core CPU", "13.3-inch Retina Display", "16GB Unified Memory", "512GB SSD"],
    price: "Rs. 499,000.00",
    inStock: true,
    badge: "Best Seller",
    category: "Laptops"
  },
  {
    id: 3,
    image: "https://redtech.lk/wp-content/uploads/2024/12/ASUS-ROG-Strix-G16-Intel-i9-14900HX-_-16GB-DDR5-5600Mz-_-RTX-4070-8GB-GDDR6-_-1TB-Gen4-NVMe-_-16%E2%80%B3-QHD-2560x1600-240Hz-IPS-_-Win-11-Home.png",
    title: "ASUS ROG STRIX G16",
    specs: ["Intel Core i7-13650HX", "NVIDIA GeForce RTX 4060", "16-inch OLED", "16GB DDR5", "1TB NVMe SSD"],
    price: "Rs. 579,000.00",
    inStock: true,
    badge: "Best Seller",
    category: "Laptops"
  },
  {
    id: 4,
    image: "https://media.us.lg.com/transform/ecomm-PDPGallery-1100x730/0d1e62da-95ec-40e6-b2a3-0ef94b03aea3/md08000370-Z-01-jpg",
    title: "LG ULTRAGEAR 27GP850",
    specs: ["27-inch QHD IPS", "165Hz Refresh Rate", "1ms Response Time", "99% DCI-P3 Color", "HDR10 Support"],
    price: "Rs. 189,000.00",
    inStock: true,
    badge: "Best Seller",
    category: "Monitors"
  },
  {
    id: 5,
    image: "https://redtech.lk/wp-content/uploads/2021/03/27%E2%80%B3-SAMSUNG-ODYSSEY-G5-144Hz-VA-Curved-Wide-2K-LED-Monitor.png",
    title: "SAMSUNG ODYSSEY G5",
    specs: ["32-inch Curved QHD", "144Hz Refresh Rate", "1ms MPRT", "FreeSync Premium", "VA Panel"],
    price: "Rs. 165,000.00",
    inStock: true,
    badge: "Best Seller",
    category: "Monitors"
  },
  {
    id: 6,
    image: "https://cdn2.37left.lk/images/logitech-g-pro-wireless-gaming-mouse-N2ovHe9qkIx6.webp",
    title: "LOGITECH G PRO X SUPERLIGHT",
    specs: ["25,600 DPI HERO Sensor", "Wireless Lightspeed", "Ultra-lightweight Design", "60-hour Battery", "8 Programmable Buttons"],
    price: "Rs. 49,900.00",
    inStock: false,
    badge: "Best Seller",
    category: "Mouses"
  },
  {
    id: 7,
    image: "https://i5.walmartimages.com/seo/Razer-BlackWidow-V4-75-Hot-Swappable-Mechanical-Gaming-Keyboard-RGB-Chroma-Black_effe0aa5-8503-4285-9de7-e5bf74665895.5a5ae658a4ebf40dc56b3fa1c756aa72.jpeg",
    title: "RAZER BLACKWIDOW V4",
    specs: ["Mechanical Green Switch", "Per-key RGB Lighting", "Wrist Rest Included", "Chroma Compatibility", "Programmable Keys"],
    price: "Rs. 69,900.00",
    inStock: false,
    badge: "Best Seller",
    category: "Keyboards"
  },
  {
    id: 8,
    image: "https://www.nanotek.lk/storage/products/1324/mhcOzDGh2OQ9tqeayc6MEuybDneIC7D9FhnV0y5Z.webp",
    title: "STEELSERIES ARCTIS NOVA 7",
    specs: ["Wireless Gaming Headset", "Spatial Audio", "36-hour Battery Life", "Noise Cancelling", "Multi-platform Compatible"],
    price: "Rs. 79,900.00",
    inStock: false,
    badge: "Best Seller",
    category: "Headsets"
  }
];

const mockLatestProducts = [
  {
    id: 9,
    image: "https://snapshoppers.shophere.lk/wp-content/uploads/2024/10/img-MacBook-Pro-Retina-14-Inch-92084.jpg",
    title: "APPLE MACBOOK PRO M3 PRO",
    specs: ["Apple M3 Pro Chip", "12-Core CPU", "18-Core GPU", "14-inch Liquid Retina XDR", "18GB Unified Memory", "1TB SSD"],
    price: "Rs. 899,000.00",
    inStock: true,
    badge: "New",
    category: "Laptops"
  },
  {
    id: 10,
    image: "https://dlcdnwebimgs.asus.com/gain/E0275281-F18B-42C3-A025-3331C35A888F",
    title: "ASUS ROG ZEPHYRUS G16",
    specs: ["Intel Core Ultra 9", "NVIDIA RTX 4090", "16-inch OLED 240Hz", "32GB DDR5", "1TB NVMe SSD"],
    price: "Rs. 749,000.00",
    inStock: true,
    badge: "Latest",
    category: "Laptops"
  },
  {
    id: 11,
    image: "https://www.nanotek.lk/storage/products/941/wH8IDFSG1Df1NiUX853KBArQqDXL2RHyX4ZAJ1Ee.webp",
    title: "LENOVO LEGION PRO 7i",
    specs: ["Intel Core i9-14900HX", "NVIDIA RTX 4090", "16-inch QHD+ 240Hz", "32GB DDR5", "2TB NVMe SSD"],
    price: "Rs. 899,000.00",
    inStock: true,
    badge: "Latest",
    category: "Laptops"
  },
  {
    id: 12,
    image: "https://redtech.lk/wp-content/uploads/2024/02/MSI-Raider-GE78-HX-14VIG.png",
    title: "MSI RAIDER GE78 HX",
    specs: ["Intel Core i9-14900HX", "NVIDIA RTX 4090", "17-inch QHD+ 240Hz", "64GB DDR5", "2TB NVMe SSD"],
    price: "Rs. 1399,000.00",
    inStock: true,
    badge: "Premium",
    category: "Laptops"
  },
  {
    id: 13,
    image: "https://images.samsung.com/is/image/samsung/p6pim/lb/ls34bg850smxue/gallery/lb-odyssey-oled-g8-g85sb-ls34bg850smxue-535055175?$Q90_1248_936_F_PNG$",
    title: "SAMSUNG ODYSSEY OLED G8",
    specs: ["34-inch OLED Curved", "175Hz Refresh Rate", "0.03ms Response Time", "Ultra-Wide QHD", "Quantum Dot Technology"],
    price: "Rs. 459,000.00",
    inStock: true,
    badge: "New",
    category: "Monitors"
  },
  {
    id: 14,
    image: "https://dlcdnwebimgs.asus.com/gain/A00C8F15-E127-4AB4-A5F3-B22FF0CB6BC9",
    title: "ASUS ROG SWIFT PG32UQX",
    specs: ["32-inch Mini-LED 4K", "144Hz Refresh Rate", "1ms Response Time", "HDR1000", "G-SYNC Ultimate"],
    price: "Rs. 599,000.00",
    inStock: true,
    badge: "Latest",
    category: "Monitors"
  },
  {
    id: 15,
    image: "https://www.nanotek.lk/storage/products/953/WpyOoUVajLbZkGYfC3yrYWo22G7NNhYHmvLknwvt.webp",
    title: "PLAYSTATION 5 PRO",
    specs: ["Custom AMD Zen CPU", "Enhanced RDNA GPU", "2TB SSD Storage", "4K / 8K Ready", "Wi-Fi 7 Support"],
    price: "Rs. 289,000.00",
    inStock: true,
    badge: "Latest",
    category: "Consoles"
  },
  {
    id: 16,
    image: "https://m.media-amazon.com/images/I/516JY93vvXL._SS1000_.jpg",
    title: "XBOX SERIES X - 2TB GALAXY",
    specs: ["Custom AMD Zen 2", "12 TFLOPS GPU", "2TB Custom SSD", "4K Gaming Support", "Backward Compatible"],
    price: "Rs. 249,000.00",
    inStock: true,
    badge: "Latest",
    category: "Gaming Consoles"
  }
];

// Fetch products by section (currently returns mock data)
// TO CONNECT TO BACKEND: Replace this function with real API call
// Example: return fetch("http://your-backend-url/api/products/best-sellers")
export const fetchProductsBySection = async (section = "best-sellers") => {
  try {
    // UNCOMMENT BELOW WHEN BACKEND IS READY:
    // const response = await fetch(`http://your-backend-url/api/products/${section}`);
    // if (!response.ok) throw new Error("Failed to fetch products");
    // return await response.json();

    // MOCK DATA (using setTimeout to simulate API delay)
    return new Promise((resolve) => {
      setTimeout(() => {
        if (section === "best-sellers") {
          resolve(mockBestSellersProducts);
        } else if (section === "latest") {
          resolve(mockLatestProducts);
        } else {
          resolve([]);
        }
      }, 300); // Simulate 300ms API delay
    });
  } catch (error) {
    console.error(`Error fetching ${section} products:`, error);
    return [];
  }
};
