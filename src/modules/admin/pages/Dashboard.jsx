import { useEffect, useState } from "react";
import StatCard  from "../components/Dashboard/StatCard";
import RecentOrders   from "../components/Dashboard/RecentOrders";
import LowStockAlert  from "../components/Dashboard/LowStockAlert";
import { getDashboardData } from "../features/dashboard/api/dashboardService";
import { useStatusBar } from "../features/dashboard/hooks/useStatusBar";
import { buildDashboardStats } from "../features/dashboard/utils/dashboardStats";
import { useStock } from "../features/dashboard/hooks/useStock";

// ─── AdminDashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const data = await getDashboardData();
        if (!isMounted) return;

        setRecentOrders(data.recentOrders);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleViewOrder = (orderId) => console.log("View order:", orderId);

  return (
    <main className="h-full overflow-y-auto p-5 lg:p-6">

      {/* ── Stat cards row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {(isLoading || statusLoading || lowStockLoading) && (
        <p className="text-sm text-gray-500 mb-6">Loading dashboard data...</p>
      )}

      {dashboardError && (
        <p className="text-sm text-red-500 mb-6">{dashboardError}</p>
      )}

      {/* ── Recent Orders + Low Stock ── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Recent Orders — takes up 2/3 of the row */}
        <div className="flex-1 min-w-0">
          <RecentOrders
            orders={recentOrders}
            onViewOrder={handleViewOrder}
          />
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
