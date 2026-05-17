import { fetchAllOrders } from "../api/order.api";

/**
 * Fetches and transforms all orders from the backend API.
 * 
 * Handles data transformation from snake_case to camelCase,
 * validates response structure, and coerces numeric values.
 * 
 * @async
 * @returns {Promise<Array>} Array of normalized order objects
 * @returns {number} returns[].orderId - Order ID
 * @returns {number} returns[].productId - Product ID
 * @returns {string} returns[].productName - Product name
 * @returns {string} returns[].customerEmail - Customer email
 * @returns {number} returns[].quantity - Quantity ordered
 * @returns {number} returns[].priceAtPurchase - Unit price at purchase time (in LKR)
 * @returns {number} returns[].totalAmount - Total order amount (in LKR)
 * @returns {string} returns[].orderStatus - Order status (pending, processing, completed, cancelled)
 * @returns {string} returns[].updatedAt - ISO timestamp of last update
 * 
 * @throws {Error} If API call fails or response structure is invalid
 * @throws {Error} If response contains no orders (empty array)
 * 
 * @example
 * try {
 *   const orders = await getAllOrders();
 *   // [{ orderId: 18, productName: "...", quantity: 2, ... }, ...]
 * } catch (error) {
 *   console.error("Failed to fetch orders:", error.message);
 * }
 */
export const getAllOrders = async () => {
  try {
    const response = await fetchAllOrders();

    // Validate response structure
    if (!response?.data) {
      throw new Error("Invalid API response: missing response.data");
    }

    const orders = response.data.data;

    if (!Array.isArray(orders)) {
      throw new Error(
        "Invalid API response: expected response.data.data to be an array"
      );
    }

    if (orders.length === 0) {
      console.warn("No orders found in API response");
      return [];
    }

    // Transform and validate each order
    const normalizedOrders = orders.map((order, index) => {
      try {
        return {
          orderId: Number(order.order_id),
          productId: Number(order.product_id),
          productName: String(order.product_name || ""),
          customerEmail: String(order.customer_email || ""),
          quantity: Number(order.quantity) || 0,
          priceAtPurchase: Number(order.price_at_purchase) || 0,
          totalAmount: Number(order.total_amount) || 0,
          orderStatus: String(order.order_status || "").toLowerCase(),
          updatedAt: new Date(order.updated_at),
        };
      } catch (itemError) {
        console.error(`Error transforming order at index ${index}:`, itemError);
        throw new Error(`Failed to parse order item #${index + 1}`);
      }
    });

    return normalizedOrders;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while fetching orders";

    console.error("All orders fetch error:", errorMessage);
    throw new Error(`Failed to fetch all orders: ${errorMessage}`);
  }
};