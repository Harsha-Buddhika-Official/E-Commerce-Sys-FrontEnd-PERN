const formatRevenue = (value) => {
  const numericValue = Number(value) || 0;

  return `LKR ${numericValue.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatCount = (value) => Number(value || 0).toLocaleString();

export const buildDashboardStats = ({
  revenue = 0,
  revenueGrowth = 0,
  totalOrders = 0,
  orderGrowth = 0,
  totalRevenueThisMonth,
  comparedRevenuePercentage,
  totalOrdersThisMonth,
  comparedOrdersPercentage,
  activeProducts = 0,
  lowStockProducts = 0,
  pendingOrders = 0,
  shippedOrders = 0,
} = {}) => {
  const totalRevenueValue = totalRevenueThisMonth ?? revenue;
  const revenueDeltaSource = comparedRevenuePercentage ?? revenueGrowth;
  const totalOrdersValue = totalOrdersThisMonth ?? totalOrders;
  const orderDeltaSource = comparedOrdersPercentage ?? orderGrowth;

  const revenueDelta = Number(revenueDeltaSource) || 0;
  const orderDelta = Number(orderDeltaSource) || 0;
  const lowStockDelta = -Math.abs(Number(lowStockProducts) || 0);
  const shippedDelta = Number(shippedOrders) || 0;

  return [
    {
      title: "Total Revenue",
      value: formatRevenue(totalRevenueValue),
      change: revenueDelta,
      changeLabel: revenueDelta >= 0 ? "Up from last month" : "Down from last month",
      preset: "revenue",
    },
    {
      title: "Orders This Month",
      value: formatCount(totalOrdersValue),
      change: orderDelta,
      changeLabel: orderDelta >= 0 ? "Up from last month" : "Down from last month",
      preset: "orders",
    },
    {
      title: "Active Products",
      value: formatCount(activeProducts),
      change: lowStockDelta,
      changeLabel: "out of stock",
      preset: "customers",
    },
    {
      title: "Pending Orders",
      value: formatCount(pendingOrders),
      change: shippedDelta,
      changeLabel: "Shipped",
      preset: "inventory",
    }
  ];
};