import {
  addCartItem,
  clearCart as clearCartRequest,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cart.api.js";

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const normalizeCartItem = (item) => ({
  id: item.cart_item_id ?? item.item_id ?? item.id,
  productId: item.product_id ?? item.productId ?? null,
  product_id: item.product_id ?? item.productId ?? null,
  name: item.product_name ?? item.name ?? "",
  price: toNumber( item.price_at_add ?? item.current_price ?? item.price),
  quantity: Math.max(1, Math.trunc(toNumber(item.quantity) || 1)),
  image: item.image_url ?? item.image ?? "",
  slug: item.product_slug ?? item.slug ?? "",
  stockQuantity: Math.max(0, Math.trunc(toNumber(item.stock_quantity))),
  isActive: item.is_active ?? item.isActive ?? true,
  lineTotal: toNumber(item.line_total),
  addedAt: item.added_at ?? item.addedAt ?? null,
  updatedAt: item.updated_at ?? item.updatedAt ?? null,
});

const normalizeCart = (payload) => {
  const items = Array.isArray(payload?.items) ? payload.items.map(normalizeCartItem) : [];
  const total = toNumber(payload?.total ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const itemCount = Math.max(
    0,
    Math.trunc(
      toNumber(
        payload?.item_count ??
          payload?.itemCount ??
          items.reduce((sum, item) => sum + item.quantity, 0)
      )
    )
  );

  return {
    items,
    total,
    itemCount,
    message: payload?.message ?? null,
  };
};

const unwrapResponse = (response) => {
  const payload = response?.data ?? response;

  if (payload?.success === false) {
    throw new Error(payload.message || "Cart request failed");
  }

  return payload?.data ?? payload;
};

const findItemByIdentifier = (items, identifier) => {
  const numericIdentifier = Number(identifier);

  return items.find((item) => {
    if (item.id === identifier || item.product_id === identifier || item.productId === identifier) {
      return true;
    }

    if (Number.isFinite(numericIdentifier)) {
      return item.id === numericIdentifier || item.product_id === numericIdentifier || item.productId === numericIdentifier;
    }

    return false;
  });
};

const emitUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cart:updated"));
  }
};

const emitAddSuccess = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("cart:item-added", {
        detail: {
          message: "Product added to your cart",
        },
      })
    );
  }
};

export const fetchCart = async () => {
  const response = await getCart();
  console.log(response);
  return normalizeCart(unwrapResponse(response));
};

export const addProductToServer = async (productId, quantity = 1) => {
  if (!productId) return null;

  const response = await addCartItem({
    product_id: Number(productId),
    quantity: Math.max(1, Math.trunc(toNumber(quantity) || 1)),
  });

  const cart = normalizeCart(unwrapResponse(response));
  emitAddSuccess();
  emitUpdate();
  return cart;
};

export const updateCartQuantity = async (itemId, quantity) => {
  if (!itemId) return null;

  const response = await updateCartItem(itemId, Math.max(1, Math.trunc(toNumber(quantity) || 1)));
  const cart = normalizeCart(unwrapResponse(response));
  emitUpdate();
  return cart;
};

export const removeFromCart = async (identifier) => {
  if (!identifier) return null;

  const cart = await fetchCart();
  const item = findItemByIdentifier(cart.items, identifier);

  if (!item?.id) {
    return cart;
  }

  const response = await removeCartItem(item.id);
  const nextCart = normalizeCart(unwrapResponse(response));
  emitUpdate();
  return nextCart;
};

export const clearCart = async () => {
  const response = await clearCartRequest();
  const result = unwrapResponse(response);
  emitUpdate();
  return result;
};

export const resolveCartItemByIdentifier = (items, identifier) => findItemByIdentifier(items, identifier);