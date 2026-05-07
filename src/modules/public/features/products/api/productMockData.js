/**
 * Mock data for products
 */

export const mockProducts = [
  {
    id: 1,
    title: 'Intel Core i7-13700K',
    category: 'Processors',
    price: '$399.99',
    originalPrice: '$449.99',
    image: 'https://via.placeholder.com/300?text=Processor',
    rating: 4.8,
    reviews: 156,
    inStock: true,
    stock: 45,
    section: 'best-sellers',
    badge: 'Best Seller',
    specs: ['16-Core Processor', 'LGA1700 Socket', '125W TDP', '24 Threads', '8P+8E Cores']
  },
  {
    id: 2,
    title: 'AMD Ryzen 7 7700X',
    category: 'Processors',
    price: '$299.99',
    originalPrice: '$349.99',
    image: 'https://via.placeholder.com/300?text=Processor',
    rating: 4.7,
    reviews: 142,
    inStock: true,
    stock: 38,
    section: 'best-sellers',
    badge: 'Sale',
    specs: ['8-Core Processor', 'AM5 Socket', '105W TDP', '16 Threads', 'Zen 4']
  },
  {
    id: 3,
    title: 'Dell UltraSharp 27" 4K',
    category: 'Monitors',
    price: '$699.99',
    originalPrice: '$799.99',
    image: 'https://via.placeholder.com/300?text=Monitor',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    stock: 22,
    section: 'best-sellers',
    badge: null,
    specs: ['27 inch 4K Display', '60Hz Refresh Rate', 'IPS Panel', 'USB-C', 'HDR10']
  },
  {
    id: 4,
    title: 'ASUS ProArt PA279',
    category: 'Monitors',
    price: '$549.99',
    originalPrice: '$649.99',
    image: 'https://via.placeholder.com/300?text=Monitor',
    rating: 4.6,
    reviews: 76,
    inStock: true,
    stock: 18,
    section: 'latest',
    badge: 'New',
    specs: ['27 inch 1440p Display', '75Hz Refresh Rate', 'IPS Panel', 'Color Accurate', 'USB-C']
  },
  {
    id: 5,
    title: 'ASUS ROG Gaming Laptop',
    category: 'Laptops',
    price: '$1899.99',
    originalPrice: '$2099.99',
    image: 'https://via.placeholder.com/300?text=Laptop',
    rating: 4.7,
    reviews: 112,
    inStock: true,
    stock: 12,
    section: 'best-sellers',
    badge: 'Gaming',
    specs: ['Intel Core i9-13900K', '32GB DDR5 RAM', '1TB NVMe SSD', 'RTX 4080', '16 inch Display']
  },
  {
    id: 6,
    title: 'Dell XPS 13',
    category: 'Laptops',
    price: '$999.99',
    originalPrice: '$1199.99',
    image: 'https://via.placeholder.com/300?text=Laptop',
    rating: 4.8,
    reviews: 198,
    inStock: true,
    stock: 28,
    section: 'latest',
    badge: 'Premium',
    specs: ['Intel Core i7-1360P', '16GB LPDDR5 RAM', '512GB NVMe SSD', 'Iris Xe Graphics', '13 inch OLED']
  },
  {
    id: 7,
    title: 'ASUS ROG Strix Z790-E',
    category: 'Motherboard',
    price: '$289.99',
    originalPrice: '$349.99',
    image: 'https://via.placeholder.com/300?text=Motherboard',
    rating: 4.6,
    reviews: 67,
    inStock: true,
    stock: 35,
    section: 'best-sellers',
    badge: null,
    specs: ['LGA1700 Socket', 'ATX Form Factor', 'WiFi 6E', 'PCIe 5.0', 'DDR5 Support']
  },
  {
    id: 8,
    title: 'MSI B650E Tomahawk',
    category: 'Motherboard',
    price: '$229.99',
    originalPrice: '$279.99',
    image: 'https://via.placeholder.com/300?text=Motherboard',
    rating: 4.5,
    reviews: 54,
    inStock: true,
    stock: 41,
    section: 'latest',
    badge: 'Value',
    specs: ['AM5 Socket', 'ATX Form Factor', 'WiFi 6', 'PCIe 5.0', 'DDR5 Support']
  },
  {
    id: 9,
    title: 'Corsair Vengeance DDR5 32GB',
    category: 'Memory',
    price: '$149.99',
    originalPrice: '$179.99',
    image: 'https://via.placeholder.com/300?text=RAM',
    rating: 4.7,
    reviews: 145,
    inStock: true,
    stock: 92,
    section: 'best-sellers',
    badge: null,
    specs: ['32GB Total Capacity', 'DDR5 Memory', '6000MHz Speed', 'Dual Channel', 'RGB Lighting']
  },
  {
    id: 10,
    title: 'G.Skill Trident Z5 16GB',
    category: 'Memory',
    price: '$79.99',
    originalPrice: '$99.99',
    image: 'https://via.placeholder.com/300?text=RAM',
    rating: 4.8,
    reviews: 167,
    inStock: true,
    stock: 125,
    section: 'latest',
    badge: 'Best Price',
    specs: ['16GB Total Capacity', 'DDR5 Memory', '5600MHz Speed', 'Dual Channel', 'Premium Design']
  }
];

/**
 * Get products by section
 * @param {string} section - "best-sellers" or "latest"
 * @returns {Array} Filtered products
 */
export const getProductsBySection = (section = 'best-sellers') => {
  return mockProducts.filter(product => product.section === section);
};

/**
 * Get products by category
 * @param {string} category - Product category
 * @returns {Array} Filtered products
 */
export const getProductsByCategory = (category = 'Processors') => {
  return mockProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
};
