import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductDetail } from "../service/productDetail.service";

const INITIAL_STATE = {
  product: null,
  loading: true,
  error: null,
};

/**
 * Hook for loading a single product detail record.
 * Accepts an explicit productId or falls back to the route param.
 */
export const useProductDetail = (productIdFromArg) => {
  const params = useParams();
  const productId = productIdFromArg ?? params.id;
  const [state, setState] = useState(() => (
    productId
      ? INITIAL_STATE
      : { product: null, loading: false, error: "Product ID is required" }
  ));

  useEffect(() => {
    if (!productId) {
      return;
    }

    let cancelled = false;

    getProductDetail(productId)
      .then((product) => {
        if (!cancelled) {
          setState({ product, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ product: null, loading: false, error: err.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return {
    ...state,
    refresh: () => {
      if (productId) {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        getProductDetail(productId)
          .then((product) => setState({ product, loading: false, error: null }))
          .catch((err) => setState({ product: null, loading: false, error: err.message }));
      }
    },
  };
};