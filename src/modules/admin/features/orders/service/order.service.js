import {
  fetchRecentOrders,
  fetchAllOrders,
  fetchOrderDetail,
  fetchOrderStats,
  updateOrderStatus as apiUpdateOrderStatus,
  getOrderReceiptAPI,
} from "../api/order.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";
import { safeNumber, safeMoney, safeText, safeDate, normalizeStatus } from "../../../../../utils/normalizers.js";
import { extractArrayPayload, extractObjectPayload } from "../../../../../utils/payloadExtractors.js";

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
      paidOrders: safeNumber(data.paidOrders) ?? 0,
      processingOrders: safeNumber(data.processingOrders) ?? 0,
      shippedOrders: safeNumber(data.shippedOrders) ?? 0,
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

// for the get all details about one order in order details page
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
      full_name: safeText(data.full_name ?? data.fullName),
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

// for the change order status action in order details page
export const changeOrderStatus = async (orderId, newStatus) => {
  if (orderId === undefined || orderId === null) throw new Error("orderId is required");
  const id = safeNumber(orderId);
  if (id === null) throw new Error("orderId must be a valid number");

  const rawStatus = safeText(newStatus);
  if (!rawStatus) throw new Error("newStatus is required");
  const normStatus = normalizeStatus(rawStatus);

  const ALLOWED_STATUSES = [
    "pending_payment",
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!ALLOWED_STATUSES.includes(normStatus)) {
    throw new Error(`newStatus must be one of: ${ALLOWED_STATUSES.join(", ")}`);
  }

  try {
    const payload = await apiUpdateOrderStatus(id, normStatus);
    const data = extractObjectPayload(payload);
    return data;
  } catch (err) {
    throw handleServiceError(err, "Failed to change order status", {
      service: "orders",
      operation: "changeOrderStatus",
      details: { orderId: id, newStatus: normStatus },
    });
  }
};


export const getOrderReceiptService = async (orderId) => {
    try {
        const response = await getOrderReceiptAPI(orderId);
        return extractObjectPayload(response);
    } catch (error) {
        // A missing receipt (404) is a normal state, not an error to surface.
        if (error?.response?.status === 404) return null;
        throw handleServiceError(error, "Failed to fetch order receipt", {
            service: "OrderService",
            operation: "getOrderReceipt",
        });
    }
};