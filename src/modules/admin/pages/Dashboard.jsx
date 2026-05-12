import { useEffect, useState } from "react";
import StatCard  from "../components/Dashboard/StatCard";
import RecentOrders   from "../components/Dashboard/RecentOrders";
import LowStockAlert  from "../components/Dashboard/LowStockAlert";
import { getDashboardData } from "../features/dashboard/api/dashboardService";

// ─── AdminDashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const data = await getDashboardData();

        if (!isMounted) return;

        setStats(data.stats);
        setRecentOrders(data.recentOrders);
        setLowStockItems(data.lowStockItems);
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

  const handleRestock   = (item)    => console.log("Restock:", item.name);
  const handleViewOrder = (orderId) => console.log("View order:", orderId);

  return (
    <main className="h-full overflow-y-auto p-5 lg:p-6">

          {/* ── Stat cards row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>

          {isLoading && (
            <p className="text-sm text-gray-500 mb-6">Loading dashboard data...</p>
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
            <div className="w-full lg:w-[280px] xl:w-[300px] flex-shrink-0">
              <LowStockAlert
                items={lowStockItems}
                onRestock={handleRestock}
              />
            </div>

          </div>
    </main>
  );
};

export default AdminDashboard;
