import { useState, useEffect } from "react";
import Navbar              from "../components/Navbar";
import Sidebar             from "../components/Sidebar";
import OrderStatCard       from "../components/Orders/OrderStatCard";
import OrdersTable         from "../components/Orders/OrdersTable";
import OrderStatusChanger  from "../components/Orders/OrderStatusChanger";

// ─── Mock service (replace with real API imports) ─────────────────────────────
// import { getOrders, getOrderStats, updateOrderStatus } from "../features/orders/api/ordersService";
// import { getAdminNotifications } from "../features/notifications/api/notificationsService";

const MOCK_ORDERS = Array.from({ length: 48 }, (_, i) => ({
  id:      `#${4231 + i}`,
  product: ["RTX 4080 Super 16GB", "Intel Core i9-14900K", "Samsung 990 Pro 2TB", "G.Skill Trident Z5 32GB", "ASUS ROG B650-E"][i % 5],
  email:   ["customer@example.com", "john.doe@gmail.com", "alice@company.lk", "buyer@email.com"][i % 4],
  date:    ["May 1", "May 2", "May 3", "Apr 30", "Apr 28"][i % 5],
  amount:  [351000, 189900, 62900, 38900, 99900][i % 5],
  status:  ["Paid", "Paid", "Pending", "Completed", "Paid", "Cancelled", "Paid", "Paid"][i % 8],
}));

// ─── OrdersPage ───────────────────────────────────────────────────────────────
const Orders = () => {
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [orders,        setOrders]        = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // full order object
  const [isLoading,     setIsLoading]     = useState(true);

  /* Load data */
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        // Replace with:
        // const [ordersData, notifsData] = await Promise.all([getOrders(), getAdminNotifications()]);
        await new Promise((r) => setTimeout(r, 400)); // simulate network
        if (!active) return;
        setOrders(MOCK_ORDERS);
        setNotifications([]);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  /* Derived stat counts */
  const counts = {
    pending:   orders.filter(o => o.status === "Pending").length,
    completed: orders.filter(o => o.status === "Completed").length,
    cancelled: orders.filter(o => o.status === "Cancelled").length,
  };

  /* Handle status change from OrderStatusChanger */
  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return;
    // Replace with: await updateOrderStatus(selectedOrder.id, newStatus);
    setOrders((prev) =>
      prev.map((o) => o.id === selectedOrder.id ? { ...o, status: newStatus } : o)
    );
    setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
  };

  /* Handle row click from OrdersTable */
  const handleViewOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    setSelectedOrder(order || null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f5f5f5]">

      {/* ── Navbar (full width top bar) ── */}
      <Navbar
        title="Orders"
        onMenuClick={() => setSidebarOpen((p) => !p)}
        notifications={notifications}
      />

      {/* ── Body row: sidebar + main content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          activeItem="orders"
          onNavigate={(page) => console.log("Navigate to:", page)}
          onLogout={() => console.log("Logout")}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          adminName="Super Admin"
          adminEmail="admin@example.com"
        />

        {/* ── Main scrollable content ── */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6 min-w-0">

          {/* ── Stat cards row — Pending / Completed / Cancelled ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <OrderStatCard
              label="Pending"
              count={counts.pending}
              preset="pending"
            />
            <OrderStatCard
              label="Completed"
              count={counts.completed}
              preset="completed"
            />
            <OrderStatCard
              label="Cancelled"
              count={counts.cancelled}
              preset="cancelled"
            />
          </div>

          {/* ── Orders table + status changer row ── */}
          <div className="flex flex-col xl:flex-row gap-5">

            {/* Orders table — takes all available width */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div
                  className="w-full bg-white rounded-2xl flex items-center justify-center"
                  style={{ height: 400, border: "1px solid #f0f0f0" }}
                >
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "#aaa" }}>
                    Loading orders…
                  </p>
                </div>
              ) : (
                <OrdersTable
                  orders={orders}
                  onViewOrder={handleViewOrder}
                />
              )}
            </div>

            {/* Status changer — appears when a row is selected, fixed width on xl+ */}
            <div
              className={`flex-shrink-0 transition-all duration-200
                ${selectedOrder
                  ? "w-full xl:w-[220px] opacity-100"
                  : "w-full xl:w-[220px] opacity-40 pointer-events-none"
                }`}
            >
              <OrderStatusChanger
                currentStatus={selectedOrder?.status || "Paid"}
                onStatusChange={handleStatusChange}
                orderId={selectedOrder?.id}
              />

              {/* Hint when nothing selected */}
              {!selectedOrder && (
                <p
                  className="text-center mt-3 text-gray-400"
                  style={{ fontFamily: "'Inter',sans-serif", fontSize: 12 }}
                >
                  Select an order to change its status
                </p>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Orders;