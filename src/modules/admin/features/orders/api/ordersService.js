// features/orders/api/ordersService.js
// Mirrors the pattern of dashboardService.js — replace the mock
// implementations below with your real API base URL and endpoints.

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ─── getOrders ────────────────────────────────────────────────────────────────
// Returns an array of order objects:
// [{ id, product, email, date, amount, status }, ...]
export const getOrders = async () => {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // send cookies / session token
    });

    if (!res.ok) throw new Error(`getOrders failed: ${res.status}`);

    const data = await res.json();
    return data; // expects array
  } catch (error) {
    console.error("ordersService.getOrders:", error);
    return []; // safe fallback — table shows "No orders found"
  }
};

// ─── updateOrderStatus ────────────────────────────────────────────────────────
// PATCH /api/orders/:id/status  { status: "Paid" | "Pending" | "Processing" | "Cancelled" }
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) throw new Error(`updateOrderStatus failed: ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error("ordersService.updateOrderStatus:", error);
    throw error; // re-throw so AdminOrders can revert the optimistic update
  }
};
