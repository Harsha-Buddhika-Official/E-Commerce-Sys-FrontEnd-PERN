import OrderStatCard from "../components/Orders/OrderStatCard";
import OrdersTable from "../components/Orders/OrdersTable";
import { useOrderStatus } from "../features/orders/hooks/useOrderStatus";
import { useAllOrders } from "../features/orders/hooks/useAllOrders";

// ─── OrdersPage ───────────────────────────────────────────────────────────────
const Orders = () => {
  const { orderStatus } = useOrderStatus();
  const { orders, loading: ordersLoading, error: ordersError } = useAllOrders();

  return (
    <main className="h-full overflow-y-auto p-5 lg:p-6 min-w-0">

          {/* ── Stat cards row — Pending / Completed / Cancelled ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <OrderStatCard
              label="Pending Orders"
              count={orderStatus?.pendingOrders}
              preset="pending"
            />
            <OrderStatCard
              label="Completed orders"
              count={orderStatus?.completeOrders}
              preset="completed"
            />
            <OrderStatCard
              label="Cancelled orders"
              count={orderStatus?.cancelledOrders}
              preset="cancelled"
            />
          </div>

          {/* ── Orders table ── */}
          <div className="w-full">
            {ordersLoading ? (
              <div
                className="w-full bg-white rounded-2xl flex items-center justify-center"
                style={{ height: 400, border: "1px solid #f0f0f0" }}
              >
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "#aaa" }}>
                  Loading orders…
                </p>
              </div>
            ) : ordersError ? (
              <div
                className="w-full bg-white rounded-2xl flex items-center justify-center"
                style={{ height: 400, border: "1px solid #f0f0f0" }}
              >
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "#dc2626" }}>
                  Error: {ordersError.message}
                </p>
              </div>
            ) : (
              <OrdersTable
                orders={orders}
              />
            )}
          </div>
    </main>
  );
};

export default Orders;