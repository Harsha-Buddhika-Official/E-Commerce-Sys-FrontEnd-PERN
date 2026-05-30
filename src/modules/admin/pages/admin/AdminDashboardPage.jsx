import StatCard  from "../../components/Dashboard/StatCard";
import RecentOrders   from "../../components/Dashboard/RecentOrders";
import LowStockAlert  from "../../components/Dashboard/LowStockAlert";
import { useStatusBar } from "../../features/dashboard/hooks/useStatusBar";
import { buildDashboardStats } from "../../features/dashboard/utils/dashboardStats";
import { useStock } from "../../features/dashboard/hooks/useStock";

const AdminDashboard = () => {
	const {
		revenue,
		revenueGrowth,
		totalOrders,
		orderGrowth,
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
		revenue,
		revenueGrowth,
		totalOrders,
		orderGrowth,
		activeProducts,
		lowStockProducts,
		pendingOrders,
		shippedOrders,
	});

	const handleViewOrder = (orderId) => {};

	return (
		<main className="h-full overflow-y-auto p-5 lg:p-6">
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

			<div className="flex flex-col lg:flex-row gap-5">
				<div className="flex-1 min-w-0">
					<RecentOrders onViewOrder={handleViewOrder} />
				</div>

				<div className="w-full lg:w-70 xl:w-75 shrink-0">
					<LowStockAlert items={lowStockItems} />
				</div>
			</div>
		</main>
	);
};

export default AdminDashboard;
