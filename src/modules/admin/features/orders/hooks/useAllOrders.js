import { useState, useEffect } from "react";
import { getAllOrders } from "../service/allOrders.service";

/**
 * Custom hook to fetch and manage all orders from the API.
 * 
 * Transforms API response data to match component structure:
 * - orderId → id
 * - productName → product
 * - customerEmail → email
 * - updatedAt → date (formatted)
 * - totalAmount → amount
 * - orderStatus → status (capitalized)
 * 
 * @returns {Object} Orders state and utilities
 * @returns {Array} returns.orders - Normalized orders array
 * @returns {boolean} returns.loading - Loading state
 * @returns {Error|null} returns.error - Error object if fetch failed
 * 
 * @example
 * const { orders, loading, error } = useAllOrders();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * return <OrdersTable orders={orders} />;
 */
export const useAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiOrders = await getAllOrders();

        // Transform API data to component format
        const normalizedOrders = apiOrders.map((order) => ({
          id: `#${order.orderId}`,
          product: order.productName,
          email: order.customerEmail,
          date: formatDate(order.updatedAt),
          quantity: order.quantity,
          priceAtPurchase: order.priceAtPurchase,
          amount: order.totalAmount,
          status: capitalizeStatus(order.orderStatus),
        }));

        if (active) {
          setOrders(normalizedOrders);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch orders")
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  return { orders, loading, error };
};

/**
 * Format date to readable format (e.g., "May 16")
 * @param {Date|string} dateInput - Date object or ISO string
 * @returns {string} Formatted date
 */
function formatDate(dateInput) {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return "Unknown";
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Unknown";
  }
}

/**
 * Capitalize status string for display
 * @param {string} status - Status from API (e.g., "pending", "completed")
 * @returns {string} Capitalized status (e.g., "Pending", "Completed")
 */
function capitalizeStatus(status) {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}
