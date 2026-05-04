export const DASHBOARD_STATS = [
  {
    title: "Total Revenue",
    value: "LKR 1,40,689.00",
    change: 8.5,
    changeLabel: "Up from last month",
    preset: "revenue",
  },
  {
    title: "Orders This Month",
    value: "50",
    change: 10,
    changeLabel: "Up from last month",
    preset: "orders",
  },
  {
    title: "Active Products",
    value: "351",
    change: -5,
    changeLabel: "out of stock",
    preset: "customers",
  },
  {
    title: "Pending Orders",
    value: "21",
    change: 20,
    changeLabel: "Shipped",
    preset: "inventory",
  },
];

export const DASHBOARD_RECENT_ORDERS = Array.from({ length: 32 }, (_, i) => ({
  id: `#${4231 + i}`,
  product: [
    "RTX 4080 Super 16GB",
    "Intel Core i9-14900K",
    "Samsung 990 Pro 2TB",
    "G.Skill Trident Z5 32GB",
    "ASUS ROG B650-E",
  ][i % 5],
  email: [
    "customer@example.com",
    "john.doe@gmail.com",
    "alice@company.lk",
    "buyer@email.com",
  ][i % 4],
  date: ["May 1", "May 2", "May 3", "Apr 30", "Apr 28"][i % 5],
  amount: [351000, 189900, 62900, 38900, 99900][i % 5],
  status: ["Paid", "Paid", "Pending", "Processing", "Paid", "Cancelled", "Paid", "Paid"][i % 8],
}));

export const DASHBOARD_LOW_STOCK_ITEMS = [
  { id: 1, name: "RTX 4090 20GB", stock: 2, maxStock: 50 },
  { id: 2, name: "Intel Core i9-14900K", stock: 3, maxStock: 40 },
  { id: 3, name: "Samsung 990 Pro 2TB", stock: 1, maxStock: 60 },
  { id: 4, name: "ASUS ROG Strix B650-E", stock: 4, maxStock: 30 },
];
