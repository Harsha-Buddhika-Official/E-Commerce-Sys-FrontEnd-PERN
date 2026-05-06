import { useEffect, useState } from "react";
import Navbar             from "../components/Navbar";
import Sidebar            from "../components/Sidebar";
import OrderStatCard      from "../components/Orders/OrderStatCard";
import OrdersTable        from "../components/Orders/OrdersTable";
import OrderStatusChanger from "../components/Orders/OrderStatusChanger";
import { getOrders, updateOrderStatus } from "../features/orders/api/ordersService";
import { getMockOrders }                 from "../features/orders/api/ordersMockData";
import { getAdminNotifications }        from "../features/notifications/api/notificationsService";

// ─── AdminOrders ──────────────────────────────────────────────────────────────
const AdminOrders = () => {
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [activePage,    setActivePage]    = useState("orders");
  const [orders,        setOrders]        = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading,     setIsLoading]     = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadOrdersData = async () => {
      try {
        const [ordersData, notificationsData] = await Promise.all([
          getOrders(),
          getAdminNotifications(),
        ]);

        if (!isMounted) return;

        // Use mock data if API returns empty array
        const finalOrdersData = ordersData.length > 0 ? ordersData : await getMockOrders();

        setOrders(finalOrdersData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Failed to load orders data:", error);
        
        // Fallback to mock data on error
        if (isMounted) {
          const mockData = await getMockOrders();
          setOrders(mockData);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrdersData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Derive stat counts live from orders array
  const statCounts = {
    pending:   orders.filter(o => o.status === "Pending").length,
    completed: orders.filter(o => o.status === "Completed").length,
    cancelled: orders.filter(o => o.status === "Cancelled").length,
  };

  // Open status changer panel when order ID is clicked in table
  const handleViewOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order || null);
  };

  // Update status — optimistic update + API call
  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return;

    // Optimistic UI update
    setOrders(prev =>
      prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o)
    );
    setSelectedOrder(prev => ({ ...prev, status: newStatus }));

    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
    } catch (error) {
      console.error("Failed to update order status:", error);
      // Revert on failure
      setOrders(prev =>
        prev.map(o => o.id === selectedOrder.id ? { ...o, status: selectedOrder.status } : o)
      );
      setSelectedOrder(prev => ({ ...prev, status: selectedOrder.status }));
    }
  };

  const handleLogout = () => console.log("Logout");

  return (
    // Root: full viewport, flex column layout — mirrors dashboard structure
    <div className="flex flex-col h-screen overflow-hidden bg-[#f5f5f5]">

      {/* ── Navbar (full width) ── */}
      <Navbar
        title={activePage.charAt(0).toUpperCase() + activePage.slice(1)}
        onMenuClick={() => setSidebarOpen((p) => !p)}
        notifications={notifications}
      />

      {/* ── Main content area: sidebar + content side-by-side ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <Sidebar
          activeItem={activePage}
          onNavigate={setActivePage}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          adminName="Super Admin"
          adminEmail="admin@example.com"
        />

        {/* ── Scrollable content area ── */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">

          {/* ── Stat cards row — Pending | Completed | Cancelled ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <OrderStatCard
              label="Pending"
              count={isLoading ? "—" : statCounts.pending}
              preset="pending"
            />
            <OrderStatCard
              label="Completed"
              count={isLoading ? "—" : statCounts.completed}
              preset="completed"
            />
            <OrderStatCard
              label="Cancelled"
              count={isLoading ? "—" : statCounts.cancelled}
              preset="cancelled"
            />
          </div>

          {isLoading && (
            <p className="text-sm text-gray-500 mb-6">Loading orders...</p>
          )}

          {/* ── Orders table + Status changer ── */}
          <div className="flex flex-col xl:flex-row gap-5">

            {/* Orders table — takes up remaining space */}
            <div className="flex-1 min-w-0">
              <OrdersTable
                orders={orders}
                onViewOrder={handleViewOrder}
              />
            </div>

            {/* Status changer — fixed width panel, visible only when order is selected */}
            {selectedOrder && (
              <div className="w-full xl:w-[220px] flex-shrink-0">
                <OrderStatusChanger
                  currentStatus={selectedOrder.status}
                  onStatusChange={handleStatusChange}
                  orderId={selectedOrder.id}
                />
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminOrders;