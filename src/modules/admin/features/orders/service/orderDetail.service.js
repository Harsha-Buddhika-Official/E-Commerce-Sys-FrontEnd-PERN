import { fetchOrderDetail } from "../api/order.api";

/**
 * Retrieve and normalize an order detail response from the API.
 * Supports either a single-row object or an array of rows (one per product line).
 * Returns an object shaped for `OrderDetailPage` with `items` array.
 *
 * @param {string|number} orderId
 * @returns {Promise<Object>} normalized order
 */
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
