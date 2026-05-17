import { fetchOrderStats } from "../api/order.api";

export const getOrderStatusCounts = async () => {
  try {
    const response = await fetchOrderStats();
    
    // Validate response structure before accessing nested properties
    if (!response?.data?.data) {
      throw new Error(
        "Invalid API response structure: expected response.data.data"
      );
    }

    const { pendingOrders, completedOrders, cancelledOrders } = response.data.data;

    // Transform and validate API data
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
  }
};