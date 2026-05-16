import { fetchOrders } from "../api/order.api";

/**
 * Transform raw API data to table format
 * Handles data normalization and formatting
 */
const transformOrderData = (rawOrders) => {
  return rawOrders.map((order) => ({
    id: `#${order.order_id}`,
    trackingCode: order.tracking_code,
    product: order.product_name,
    quantity: order.quantity,
    amount: parseFloat(order.price_at_purchase),
    totalAmount: parseFloat(order.total_amount),
    status: order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1),
    customer: {
      email: order.customer_email,
      phone: order.phone_number,
      address: order.shipping_address,
      city: order.city,
      postalCode: order.postal_code,
    },
    rawData: order,
  }));
};

export const getOrderDetails = async () => {
  try {
    const response = await fetchOrders();
    // If this is an Axios response, the real payload lives at response.data
    const payload = response && typeof response === "object" && "data" in response
      ? response.data
      : response;

    // Debug: Log the resolved payload
    console.log("API Response payload:", payload);

    // Normalize supported payload shapes:
    // - { success: true, data: [...] }
    // - { data: [...] }
    // - [...] (direct array)
    let orderData;

    if (payload?.success !== undefined) {
      if (!payload.success) throw new Error(payload.message || "API request failed");
      orderData = payload.data;
    } else if (Array.isArray(payload)) {
      orderData = payload;
    } else if (payload?.data && Array.isArray(payload.data)) {
      orderData = payload.data;
    } else {
      console.error("Response payload is not an array:", payload);
      throw new Error(`Expected array of orders, got ${typeof payload}`);
    }

    return transformOrderData(orderData);
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};