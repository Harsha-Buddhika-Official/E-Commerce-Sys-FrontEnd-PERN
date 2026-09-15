import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductDetails } from '../services/products.service';
import { getCache, setCache } from "../../../../../utils/cache.js";

const INITIAL_STATE = {
  product: null,
  loading: true,
  error: null,
};

export const useProductDetail = () => {
  const { id } = useParams();
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const cacheKey = `product_detail_${id}`;

    const load = async () => {
      const cached = getCache(cacheKey);
      if (cached) {
        if (!cancelled) {
          setState({ product: cached, loading: false, error: null });
        }
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const product = await fetchProductDetails(id);

        if (!cancelled) {
          setState({ product, loading: false, error: null });
          setCache(cacheKey, product);
        }
      } catch (err) {
        if (!cancelled) {
          setState({ product: null, loading: false, error: err.message });
        }
      }
    };

    load();

    return () => { cancelled = true; };
  }, [id]);

  return state;
};