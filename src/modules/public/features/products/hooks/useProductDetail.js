import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductDetails } from '../services/products.service';

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

    setState(prev => ({ ...prev, loading: true, error: null }));

    fetchProductDetails(id)
      .then(product => {
        if (!cancelled) {
          setState({ product, loading: false, error: null });
        }
      })
      .catch(err => {
        if (!cancelled) {
          setState({ product: null, loading: false, error: err.message });
        }
      });

    return () => { cancelled = true; };
  }, [id]);

  return state;
};