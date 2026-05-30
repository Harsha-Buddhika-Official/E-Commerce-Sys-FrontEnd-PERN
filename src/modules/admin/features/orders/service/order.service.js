import {
  fetchRecentOrders,
  fetchAllOrders,
  fetchOrderDetail,
  fetchOrderStats,
  updateOrderStatus as apiUpdateOrderStatus,
} from "../api/order.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";

// for dashboard recent orders widget
export const getRecentOrders = async () => {
  try {
    const res = await fetchRecentOrders();
    const orders = res.data.map(order => ({
      id: Number(order.order_id),
      totalAmount: Number(order.total_amount) || 0,
      status: String(order.order_status || "")
        ? String(order.order_status).charAt(0).toUpperCase() + String(order.order_status).slice(1).toLowerCase()
        : "Pending",
      product: String(order.product_name),
      quantity: Number(order.quantity),
    }));
    return orders;
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch recent orders", {
      service: "orders",
      operation: "getRecentOrders",
    });
  }
}

// for order page order details and status update
export const getOrderStatusCounts = async () => {
  try {
    const res = await fetchOrderStats();
    const data = res.data;
    const counts = {
      pendingOrders: Number(data.pendingOrders) || 0,
      completeOrders: Number(data.completedOrders) || 0,
      cancelledOrders: Number(data.cancelledOrders) || 0,
    };
    return counts;
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch order status counts", {
      service: "orders",
      operation: "getOrderStatusCounts",
    });
  }
};

export const getAllOrders = async () => {
  try {
    const response = await fetchAllOrders();
    const data = response?.data;

    const orderDetails = data.map(orders => ({
      orderId: Number(orders.order_id),
      productName: String(orders.product_name || ""),
      customerEmail: String(orders.customer_email || ""),
      quantity: Number(orders.quantity) || 0,
      priceAtPurchase: Number(orders.price_at_purchase) || 0,
      totalAmount: Number(orders.total_amount) || 0,
      orderStatus: String(orders.order_status).toLowerCase(),
      updatedAt: new Date(orders.date),
    }))

    return orderDetails;
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch all orders", {
      service: "orders",
      operation: "getAllOrders",
    });
  }
};

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
    throw handleServiceError(error, "Failed to fetch orders", {
      service: "orders",
      operation: "getOrderDetails",
    });
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
    throw handleServiceError(err, "Failed to change order status", {
      service: "orders",
      operation: "changeOrderStatus",
      details: { orderId: id, newStatus: String(newStatus) },
    });
  }
};