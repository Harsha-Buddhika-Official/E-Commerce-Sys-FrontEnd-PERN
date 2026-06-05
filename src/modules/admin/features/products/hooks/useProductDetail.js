import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductDetail } from "../service/products.service.js";

const INITIAL_STATE = {
  product: null,
  loading: true,
  error: null,
};

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