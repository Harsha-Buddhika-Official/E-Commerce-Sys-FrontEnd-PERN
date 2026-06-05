import OrderStatCard from "../../components/Orders/OrderStatCard";
import OrdersTable from "../../components/Orders/OrdersTable";
import { useOrderStatus } from "../../features/orders/hooks/useOrderStatus";
import { useAllOrders } from "../../features/orders/hooks/useAllOrders";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const OrdersPage = () => {
	const { orderStatus, loading: orderStatusLoading, error: orderStatusError } = useOrderStatus();
	const { orders, loading: ordersLoading, error: ordersError } = useAllOrders();

	return (
		<main className="h-full overflow-y-auto p-5 lg:p-6 min-w-0">
			<div className="mb-6"><p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Catalogue / Orders</p><h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Orders</h1></div>
			<div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mb-6">
					<OrderStatCard label="Pending Orders" count={orderStatus?.pendingOrders} preset="pending" loading={orderStatusLoading} error={orderStatusError} />
					<OrderStatCard label="Paid Orders" count={orderStatus?.paidOrders} preset="paid" loading={orderStatusLoading} error={orderStatusError} />
					<OrderStatCard label="Processing Orders" count={orderStatus?.processingOrders} preset="processing" loading={orderStatusLoading} error={orderStatusError} />
					<OrderStatCard label="Shipped Orders" count={orderStatus?.shippedOrders} preset="shipped" loading={orderStatusLoading} error={orderStatusError} />
					<OrderStatCard label="Completed orders" count={orderStatus?.completeOrders} preset="completed" loading={orderStatusLoading} error={orderStatusError} />
					<OrderStatCard label="Cancelled orders" count={orderStatus?.cancelledOrders} preset="cancelled" loading={orderStatusLoading} error={orderStatusError} />
				</div>

			<div className="w-full">
				{ordersLoading ? (
					<div className="w-full bg-white rounded-2xl flex items-center justify-center" style={{ height: 400, border: "1px solid #f0f0f0" }}>
						<p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "#aaa" }}>
							Loading orders…
						</p>
					</div>
				) : ordersError ? (
					<div className="w-full bg-white rounded-2xl flex items-center justify-center" style={{ height: 400, border: "1px solid #f0f0f0" }}>
						<p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "#dc2626" }}>
							Error: {ordersError.message}
						</p>
					</div>
				) : (
					<OrdersTable orders={orders} />
				)}
			</div>
		</main>
	);
};

export default OrdersPage;
