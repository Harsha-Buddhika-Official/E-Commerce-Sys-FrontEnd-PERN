/**
 * Mock data for product filters
 */

export const mockFilters = {
  processors: {
    brand: ['Intel', 'AMD'],
    priceRange: { min: 100, max: 600 },
    cores: ['4-Core', '6-Core', '8-Core', '12-Core', '16-Core'],
    socket: ['LGA1700', 'AM5', 'LGA1200']
  },
  monitors: {
    brand: ['Dell', 'LG', 'ASUS', 'Samsung'],
    priceRange: { min: 150, max: 1000 },
    resolution: ['1080p', '1440p', '4K'],
    refreshRate: ['60Hz', '75Hz', '144Hz', '165Hz', '240Hz'],
    panelType: ['IPS', 'VA', 'TN']
  },
  laptops: {
    brand: ['Dell', 'HP', 'Lenovo', 'ASUS'],
    priceRange: { min: 500, max: 3000 },
    processor: ['Intel i5', 'Intel i7', 'AMD Ryzen 5', 'AMD Ryzen 7'],
    ram: ['8GB', '16GB', '32GB'],
    storage: ['256GB SSD', '512GB SSD', '1TB SSD']
  },
  motherboard: {
    brand: ['ASUS', 'MSI', 'Gigabyte'],
    priceRange: { min: 80, max: 400 },
    socket: ['LGA1700', 'AM5'],
    formFactor: ['ATX', 'Micro-ATX', 'Mini-ITX']
  },
  memory: {
    brand: ['Corsair', 'G.Skill', 'Kingston', 'Crucial'],
    priceRange: { min: 30, max: 300 },
    capacity: ['8GB', '16GB', '32GB', '64GB'],
    type: ['DDR4', 'DDR5']
  }
};

export const mockAllFilters = mockFilters;
