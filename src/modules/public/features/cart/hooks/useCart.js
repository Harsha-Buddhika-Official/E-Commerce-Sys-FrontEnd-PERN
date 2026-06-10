import { useCallback, useEffect, useState } from "react";
import { addProductToServer, clearCart, fetchCart, removeFromCart, updateCartQuantity, } from "../service/cart.service.js";

const INITIAL_STATE = { items: [], total: 0, itemCount: 0, loading: true, error: null, };

export const useCart = () => {
  const [state, setState] = useState(INITIAL_STATE);

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const cart = await fetchCart();
      console.log(cart);
      setState({
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount,
        loading: false,
        error: null,
      });
      return cart;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load cart",
      }));
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const cart = await fetchCart();
        if (!cancelled) {
          setState({
            items: cart.items,
            total: cart.total,
            itemCount: cart.itemCount,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            ...INITIAL_STATE,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load cart",
          });
        }
      }
    };

    load();

    const handleUpdate = () => {
      if (!cancelled) {
        refresh();
      }
    };

    window.addEventListener("cart:updated", handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener("cart:updated", handleUpdate);
    };
  }, [refresh]);

  const increase = async (itemId) => {
    const item = state.items.find((cartItem) => cartItem.id === itemId);
    if (!item) return null;

    return updateCartQuantity(itemId, item.quantity + 1);
  };

  const decrease = async (itemId) => {
    const item = state.items.find((cartItem) => cartItem.id === itemId);
    if (!item) return null;

    const nextQuantity = Math.max(1, item.quantity - 1);
    return updateCartQuantity(itemId, nextQuantity);
  };

  const remove = async (identifier) => {
    return removeFromCart(identifier);
  };

  const clearAll = async () => {
    return clearCart();
  };

  const add = async (productId, quantity = 1) => {
    return addProductToServer(productId, quantity);
  };

  return {
    ...state,
    increase,
    decrease,
    remove,
    clearAll,
    add,
    refresh,
  };
};