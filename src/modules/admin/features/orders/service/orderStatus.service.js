import { fetchOrderStats } from "../api/order.api";

export const getOrderStatusCounts = async () => {
  try {
    const response = await fetchOrderStats();

    // `fetchOrderStats` returns `res.data` from Axios. Normalize to the inner payload.
    const stats = response?.data ?? response;

    if (!stats || typeof stats !== "object") {
      throw new Error("Invalid API response structure: expected stats object");
    }

    const { pendingOrders, completedOrders, cancelledOrders } = stats;

    return {
      pendingOrders: Number(pendingOrders) || 0,
      completeOrders: Number(completedOrders) || 0,
      cancelledOrders: Number(cancelledOrders) || 0,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while fetching order status counts";

    console.error("Order status fetch error:", errorMessage);
    // Propagate error so callers can react (don't swallow)
    throw new Error(`Failed to fetch order status counts: ${errorMessage}`);
  }
};