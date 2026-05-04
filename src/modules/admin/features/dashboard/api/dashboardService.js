import {
  DASHBOARD_LOW_STOCK_ITEMS,
  DASHBOARD_RECENT_ORDERS,
  DASHBOARD_STATS,
} from "./dashboardMockData";

const API_DELAY_MS = 250;

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const cloneData = (data) => JSON.parse(JSON.stringify(data));

export async function getDashboardStats() {
  await wait(API_DELAY_MS);
  return cloneData(DASHBOARD_STATS);
}

export async function getRecentOrders() {
  await wait(API_DELAY_MS);
  return cloneData(DASHBOARD_RECENT_ORDERS);
}

export async function getLowStockItems() {
  await wait(API_DELAY_MS);
  return cloneData(DASHBOARD_LOW_STOCK_ITEMS);
}

export async function getDashboardData() {
  const [stats, recentOrders, lowStockItems] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(),
    getLowStockItems(),
  ]);

  return {
    stats,
    recentOrders,
    lowStockItems,
  };
}
