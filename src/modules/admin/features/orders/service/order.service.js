import {
  fetchRecentOrders,
  fetchAllOrders,
  fetchOrderDetail,
  fetchOrderStats,
  updateOrderStatus as apiUpdateOrderStatus,
} from "../api/order.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";

// Helpers to normalize various API payload shapes into expected JS values
function extractArrayPayload(payload) {
  if (payload?.success !== undefined) {
    if (!payload.success) throw new Error(payload.message || "API request failed");
    return payload.data;
  }
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  throw new Error(`Expected array payload from API, got ${typeof payload}`);
}

function extractObjectPayload(payload) {
  if (payload?.success !== undefined) {
    if (!payload.success) throw new Error(payload.message || "API request failed");
    return payload.data;
  }
  if (payload && typeof payload === "object") return payload;
  throw new Error(`Expected object payload from API, got ${typeof payload}`);
}

function safeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function safeMoney(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function safeText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function safeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizeStatus(value) {
  const status = safeText(value);
  return status ? status.toLowerCase() : null;
}

// for dashboard recent orders widget
export const getRecentOrders = async () => {
  try {
    const payload = await fetchRecentOrders();
    const data = extractArrayPayload(payload);

    const orders = data.map((order) => ({
      id: safeNumber(order.order_id),
      totalAmount: safeMoney(order.total_amount),
      status: normalizeStatus(order.order_status) ?? "pending",
      product: safeText(order.product_name) ?? "",
      quantity: safeNumber(order.quantity) ?? 0,
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
    const payload = await fetchOrderStats();
    const data = extractObjectPayload(payload);

    const counts = {
      pendingOrders: safeNumber(data.pendingOrders) ?? 0,
      completeOrders: safeNumber(data.completedOrders) ?? 0,
      cancelledOrders: safeNumber(data.cancelledOrders) ?? 0,
    };

    return counts;
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch order status counts", {
      service: "orders",
      operation: "getOrderStatusCounts",
    });
  }
};

// for order page order details
export const getAllOrders = async () => {
  try {
    const payload = await fetchAllOrders();
    const data = extractArrayPayload(payload);

    const orderDetails = data.map((orders) => ({
      orderId: safeNumber(orders.order_id),
      productName: safeText(orders.product_name) ?? "",
      customerEmail: safeText(orders.customer_email) ?? "",
      quantity: safeNumber(orders.quantity) ?? 0,
      priceAtPurchase: safeMoney(orders.price_at_purchase),
      totalAmount: safeMoney(orders.total_amount),
      orderStatus: normalizeStatus(orders.order_status) ?? "pending",
      updatedAt: safeDate(orders.updated_at ?? orders.date),
    }));

    return orderDetails;
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch all orders", {
      service: "orders",
      operation: "getAllOrders",
    });
  }
};

export const getOrderDetail = async (orderId) => {
  if (orderId === undefined || orderId === null) {
    throw new Error("orderId is required");
  }

  try {
    const payload = await fetchOrderDetail(orderId);
    const data = extractObjectPayload(payload);

    const orderItems = Array.isArray(data.order_items) ? data.order_items : [];
    const itemsSource = orderItems.length > 0
      ? orderItems
      : data.product_id || data.productId
        ? [data]
        : [];

    const items = itemsSource.map((item) => ({
      order_item_id: item.order_item_id ?? item.orderItemId ?? null,
      product_id: item.product_id ?? item.productId ?? null,
      product_name: item.product_name ?? item.productName ?? null,
      product_slug: item.product_slug ?? item.productSlug ?? null,
      brand_id: item.brand_id ?? item.brandId ?? null,
      brand_name: item.brand_name ?? item.brandName ?? null,
      category_id: item.category_id ?? item.categoryId ?? null,
      category_name: item.category_name ?? item.categoryName ?? null,
      quantity: Number(item.quantity) || 0,
      price_at_purchase: safeNumber(item.price_at_purchase ?? item.priceAtPurchase),
      selling_price: safeNumber(item.selling_price ?? item.sellingPrice),
      stock_quantity: safeNumber(item.stock_quantity ?? item.stockQuantity),
      warranty_months: safeNumber(item.warranty_months ?? item.warrantyMonths),
      image: typeof item.image === "string" ? item.image : null,
    }));

    return {
      order_id: safeNumber(data.order_id ?? data.orderId ?? data.id),
      tracking_code: safeText(data.tracking_code ?? data.trackingCode),
      customer_email: safeText(data.customer_email ?? data.customerEmail),
      phone_number: safeText(data.phone_number ?? data.phoneNumber),
      total_amount: safeMoney(data.total_amount ?? data.totalAmount),
      order_status: normalizeStatus(data.order_status ?? data.orderStatus),
      shipping_address: safeText(data.shipping_address ?? data.shippingAddress),
      city: safeText(data.city),
      postal_code: safeText(data.postal_code ?? data.postalCode),
      created_at: safeDate(data.created_at ?? data.createdAt),
      updated_at: safeDate(data.updated_at ?? data.updatedAt),
      items,
    };
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch order detail", {
      service: "orders",
      operation: "getOrderDetail",
      details: { orderId },
    });
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
    throw handleServiceError(err, "Failed to change order status", {
      service: "orders",
      operation: "changeOrderStatus",
      details: { orderId: id, newStatus: String(newStatus) },
    });
  }
};