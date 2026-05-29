import {
  fetchAllOrders,
  fetchOrderDetail,
  fetchOrderStats,
  updateOrderStatus as apiUpdateOrderStatus,
} from "../api/order.api";
import { handleApiError } from "../../../../../utils/apiError";

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
    const response = await fetchAllOrders();
    // If this is an Axios response, the real payload lives at response.data
    const payload = response && typeof response === "object" && "data" in response
      ? response.data
      : response;

    // Debug: Log the resolved payload


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

export const getAllOrders = async () => {
  try {
    const response = await fetchAllOrders();
    const payload = response?.data ?? response;

    let orders;
    if (Array.isArray(payload)) {
      orders = payload;
    } else if (payload?.success !== undefined) {
      if (!payload.success) throw new Error(payload.message || "API request failed");
      orders = payload.data;
    } else if (payload?.data && Array.isArray(payload.data)) {
      orders = payload.data;
    } else {
      console.error("Unexpected orders payload:", payload);
      throw new Error("Invalid API response: expected an array of orders");
    }

    if (!Array.isArray(orders) || orders.length === 0) {
      console.warn("No orders found in API response");
      return [];
    }

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
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while fetching orders";
    console.error("All orders fetch error:", errorMessage);
    throw new Error(`Failed to fetch all orders: ${errorMessage}`);
  }
};

export const getOrderDetail = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");

  const res = await fetchOrderDetail(orderId);
  if (!res || typeof res !== "object") throw new Error("Invalid API response");
  if (res.success !== true) throw new Error(res.message || "API returned failure");

  const data = res.data;
  if (!data || typeof data !== "object") return null;

  const orderItems = Array.isArray(data.order_items) ? data.order_items : [];

  const fallbackItems = orderItems.length > 0
    ? orderItems
    : (data.product_id || data.productId
      ? [data]
      : []);

  const normalizedItems = fallbackItems.map((item) => ({
    order_item_id: item.order_item_id ?? item.orderItemId ?? null,
    product_id: item.product_id ?? item.productId ?? null,
    product_name: item.product_name ?? item.productName ?? null,
    product_slug: item.product_slug ?? item.productSlug ?? null,
    brand_id: item.brand_id ?? item.brandId ?? null,
    brand_name: item.brand_name ?? item.brandName ?? null,
    category_id: item.category_id ?? item.categoryId ?? null,
    category_name: item.category_name ?? item.categoryName ?? null,
    quantity: Number(item.quantity) || 0,
    price_at_purchase: item.price_at_purchase ?? item.priceAtPurchase ?? null,
    selling_price: item.selling_price ?? item.sellingPrice ?? null,
    stock_quantity: item.stock_quantity ?? item.stockQuantity ?? null,
    warranty_months: item.warranty_months ?? item.warrantyMonths ?? null,
    image: item.image ?? null,
  }));

  const normalized = {
    order_id: data.order_id ?? data.orderId ?? data.id,
    tracking_code: data.tracking_code ?? data.trackingCode ?? null,
    customer_email: data.customer_email ?? data.customerEmail ?? null,
    phone_number: data.phone_number ?? data.phoneNumber ?? null,
    total_amount: data.total_amount ?? data.totalAmount ?? null,
    order_status: data.order_status ?? data.orderStatus ?? null,
    shipping_address: data.shipping_address ?? data.shippingAddress ?? null,
    city: data.city ?? null,
    postal_code: data.postal_code ?? data.postalCode ?? null,
    created_at: data.created_at ?? data.createdAt ?? null,
    updated_at: data.updated_at ?? data.updatedAt ?? null,
    items: normalizedItems,
  };

  return normalized;
};

export const getOrderStatusCounts = async () => {
  try {
    const response = await fetchOrderStats();
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while fetching order status counts";
    console.error("Order status fetch error:", errorMessage);
    throw new Error(`Failed to fetch order status counts: ${errorMessage}`);
  }
};

export const changeOrderStatus = async (orderId, newStatus) => {
  if (orderId === undefined || orderId === null) throw new Error("orderId is required");
  if (!newStatus) throw new Error("newStatus is required");

  const id = Number(orderId);
  if (Number.isNaN(id)) throw new Error("orderId must be a number");

  const ALLOWED_STATUSES = [
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!ALLOWED_STATUSES.includes(String(newStatus))) {
    throw new Error(`newStatus must be one of: ${ALLOWED_STATUSES.join(", ")}`);
  }

  try {
    const res = await apiUpdateOrderStatus(id, String(newStatus));
    if (!res || typeof res !== "object") throw new Error("Invalid API response");
    if (res.success !== true) throw new Error(res.message || "Failed to update status");

    return res.data;
  } catch (err) {
    console.error("changeOrderStatus service error:", err instanceof Error ? err.message : err);
    throw err;
  }
};