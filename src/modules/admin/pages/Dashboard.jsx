import StatCard  from "../components/Dashboard/StatCard";
import RecentOrders   from "../components/Dashboard/RecentOrders";
import LowStockAlert  from "../components/Dashboard/LowStockAlert";
import { useStatusBar } from "../features/dashboard/hooks/useStatusBar";
import { buildDashboardStats } from "../features/dashboard/utils/dashboardStats";
import { useStock } from "../features/dashboard/hooks/useStock";

// ─── AdminDashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const {
    totalRevenueThisMonth,
    comparedRevenuePercentage,
    totalOrdersThisMonth,
    comparedOrdersPercentage,
    activeProducts,
    lowStockProducts,
    pendingOrders,
    shippedOrders,
    loading: statusLoading,
    error: statusError,
  } = useStatusBar();
  const {
    lowStockItems,
    loading: lowStockLoading,
    error: lowStockError,
  } = useStock();
  const dashboardError = statusError || lowStockError;

  const stats = buildDashboardStats({
    totalRevenueThisMonth,
    comparedRevenuePercentage,
    totalOrdersThisMonth,
    comparedOrdersPercentage,
    activeProducts,
    lowStockProducts,
    pendingOrders,
    shippedOrders,
  });

  const handleViewOrder = (orderId) => console.log("View order:", orderId);

  return (
    <main className="h-full overflow-y-auto p-5 lg:p-6">

      {/* ── Stat cards row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {(statusLoading || lowStockLoading) && (
        <p className="text-sm text-gray-500 mb-6">Loading dashboard data...</p>
      )}

      {dashboardError && (
        <p className="text-sm text-red-500 mb-6">{dashboardError}</p>
      )}

      {/* ── Recent Orders + Low Stock ── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Recent Orders — takes up 2/3 of the row */}
        <div className="flex-1 min-w-0">
          <RecentOrders onViewOrder={handleViewOrder} />
        </div>

        {/* Low Stock Alert — fixed width sidebar panel */}
        <div className="w-full lg:w-70 xl:w-75 shrink-0">
          <LowStockAlert
            items={lowStockItems}
          />
        </div>

      </div>
    </main>
  );
};

export default AdminDashboard;
