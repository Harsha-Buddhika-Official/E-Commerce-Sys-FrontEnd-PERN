// Filter service for different product categories
// This service provides filter data for product filtering functionality

export const filterMockData = {
  processors: {
    filters: [
      {
        id: "brand",
        label: "Brand",
        type: "radio",
        options: ["INTEL", "AMD"],
      },
      {
        id: "generation",
        label: "Generation",
        type: "checkbox",
        columnLayout: 2,
        maxShowInitial: 6,
        options: [
          "6th gen",
          "10th gen",
          "11th gen",
          "12th gen",
          "13th gen",
          "14th gen",
          "3000 Series",
          "5000 Series",
          "7000 Series",
          "8000 Series",
          "9000 Series",
        ],
      },
      {
        id: "cores",
        label: "Cores",
        type: "checkbox",
        maxShowInitial: 6,
        options: [
          "2 CORES",
          "4 CORES",
          "6 CORES",
          "8 CORES",
          "10 CORES",
          "12 CORES",
          "16 CORES",
          "24 CORES",
        ],
      },
      {
        id: "threads",
        label: "Threads",
        type: "checkbox",
        maxShowInitial: 6,
        options: [
          "2 Threads",
          "4 Threads",
          "8 Threads",
          "12 Threads",
          "16 Threads",
          "20 Threads",
          "24 Threads",
          "32 Threads",
        ],
      },
    ],
  },

  monitors: {
    filters: [
      {
        id: "brand",
        label: "Brand",
        type: "radio",
        options: ["LG", "ASUS", "Dell", "BenQ", "Samsung", "Acer"],
      },
      {
        id: "resolution",
        label: "Resolution",
        type: "checkbox",
        maxShowInitial: 6,
        options: ["1080p", "1440p", "2160p (4K)", "5K"],
      },
      {
        id: "refresh_rate",
        label: "Refresh Rate",
        type: "checkbox",
        maxShowInitial: 6,
        options: [
          "60Hz",
          "75Hz",
          "120Hz",
          "144Hz",
          "165Hz",
          "240Hz",
          "360Hz",
        ],
      },
      {
        id: "panel_type",
        label: "Panel Type",
        type: "checkbox",
        options: ["IPS", "TN", "VA", "OLED"],
      },
    ],
  },

  graphics_cards: {
    filters: [
      {
        id: "brand",
        label: "Brand",
        type: "radio",
        options: ["NVIDIA", "AMD", "Intel"],
      },
      {
        id: "series",
        label: "Series",
        type: "checkbox",
        columnLayout: 2,
        maxShowInitial: 6,
        options: [
          "RTX 40 Series",
          "RTX 4090",
          "RTX 4080",
          "RTX 4070 Ti",
          "RTX 4070",
          "RTX 4060 Ti",
          "RX 7000 Series",
          "RX 7900 XTX",
          "RX 7900 XT",
        ],
      },
      {
        id: "memory",
        label: "Memory (VRAM)",
        type: "checkbox",
        options: [
          "2GB",
          "4GB",
          "6GB",
          "8GB",
          "10GB",
          "12GB",
          "16GB",
          "24GB",
        ],
      },
    ],
  },

  laptops: {
    filters: [
      {
        id: "brand",
        label: "Brand",
        type: "radio",
        options: [
          "Dell",
          "HP",
          "Lenovo",
          "ASUS",
          "Apple",
          "Acer",
          "MSI",
          "Razer",
        ],
      },
      {
        id: "processor_brand",
        label: "Processor Brand",
        type: "checkbox",
        options: ["Intel", "AMD", "Apple M-Series"],
      },
      {
        id: "ram",
        label: "RAM",
        type: "checkbox",
        options: ["8GB", "16GB", "32GB", "64GB"],
      },
      {
        id: "storage",
        label: "Storage",
        type: "checkbox",
        options: ["256GB", "512GB", "1TB", "2TB"],
      },
    ],
  },
};

// Function to get filters for a specific category
export const getFiltersByCategory = (category) => {
  return filterMockData[category] || filterMockData.processors;
};

// Function to fetch category filters (simulates API call)
export const fetchCategoryFilters = async (category) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getFiltersByCategory(category));
    }, 500); // Simulate network delay
  });
};
