// features/orders/api/ordersMockData.js
// Mock order data for development and testing
// Replace with real API calls in ordersService.js when backend is ready

export const mockOrders = [
  {
    id: "ORD-001",
    product: "Premium Wireless Headphones",
    email: "john.doe@example.com",
    date: "2025-12-15",
    amount: 12500,
    status: "Paid",
  },
  {
    id: "ORD-002",
    product: "Laptop Stand - Aluminum",
    email: "sarah.smith@example.com",
    date: "2025-12-14",
    amount: 4200,
    status: "Processing",
  },
  {
    id: "ORD-003",
    product: "USB-C Hub 7 in 1",
    email: "mike.wilson@example.com",
    date: "2025-12-13",
    amount: 3500,
    status: "Pending",
  },
  {
    id: "ORD-004",
    product: "Mechanical Keyboard RGB",
    email: "emma.johnson@example.com",
    date: "2025-12-12",
    amount: 8900,
    status: "Paid",
  },
  {
    id: "ORD-005",
    product: "4K Webcam Pro",
    email: "david.brown@example.com",
    date: "2025-12-11",
    amount: 6700,
    status: "Cancelled",
  },
  {
    id: "ORD-006",
    product: "Gaming Mouse - DPI Adjustable",
    email: "lisa.anderson@example.com",
    date: "2025-12-10",
    amount: 2800,
    status: "Paid",
  },
  {
    id: "ORD-007",
    product: "Monitor Stand Dual Arm",
    email: "james.martinez@example.com",
    date: "2025-12-09",
    amount: 5400,
    status: "Processing",
  },
  {
    id: "ORD-008",
    product: "Cable Organizer Kit",
    email: "rachel.taylor@example.com",
    date: "2025-12-08",
    amount: 1500,
    status: "Paid",
  },
  {
    id: "ORD-009",
    product: "Desk Lamp LED - Smart",
    email: "chris.clark@example.com",
    date: "2025-12-07",
    amount: 3200,
    status: "Pending",
  },
  {
    id: "ORD-010",
    product: "Phone Charging Dock",
    email: "megan.white@example.com",
    date: "2025-12-06",
    amount: 2200,
    status: "Paid",
  },
  {
    id: "ORD-011",
    product: "Portable SSD 1TB",
    email: "alex.lewis@example.com",
    date: "2025-12-05",
    amount: 9500,
    status: "Paid",
  },
  {
    id: "ORD-012",
    product: "Bluetooth Speaker Compact",
    email: "jordan.hall@example.com",
    date: "2025-12-04",
    amount: 4100,
    status: "Refunded",
  },
  {
    id: "ORD-013",
    product: "Laptop Cooling Pad",
    email: "taylor.young@example.com",
    date: "2025-12-03",
    amount: 2900,
    status: "Processing",
  },
  {
    id: "ORD-014",
    product: "Wireless Mouse Ergonomic",
    email: "casey.king@example.com",
    date: "2025-12-02",
    amount: 1800,
    status: "Paid",
  },
  {
    id: "ORD-015",
    product: "HDMI Cable 2.1 - 3m",
    email: "morgan.wright@example.com",
    date: "2025-12-01",
    amount: 850,
    status: "Pending",
  },
];

// Helper function to get mock orders (simulates async API call)
export const getMockOrders = async () => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOrders);
    }, 500);
  });
};
