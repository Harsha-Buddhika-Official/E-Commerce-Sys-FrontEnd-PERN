import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAllCategories } from '../../categories/services/categories.service';
import {
  fetchFilterOptions,
  fetchProductsWithFilters,
} from '../services/products.service';

const INITIAL_FILTERS = {
  attributeFilters: [],
  priceMin: '',
  priceMax: '',
};

export function useProductFilter() {
  const [searchParams]    = useSearchParams();
  const categoryName      = decodeURIComponent(searchParams.get('category') || '');

  const [allCategories,    setAllCategories]    = useState([]);
  const [selectedCat,      setSelectedCat]      = useState(null);
  const [filterOptions,    setFilterOptions]    = useState([]);
  const [filters,          setFilters]          = useState(INITIAL_FILTERS);
  const [products,         setProducts]         = useState([]);
  const [loadingOptions,   setLoadingOptions]   = useState(false);
  const [loadingProducts,  setLoadingProducts]  = useState(false);
  const [error,            setError]            = useState(null);

  // ── 1. load all categories once, match URL → category object ──
  useEffect(() => {
    fetchAllCategories()
      .then(({ products, accessories }) => {
        const flat = [...products, ...accessories];
        setAllCategories(flat);

        const matched = flat.find(c => c.name === categoryName);
        setSelectedCat(matched ?? flat[0] ?? null);
      })
      .catch(err => setError(err.message));
  }, []);

  // ── 2. URL param changes → update selectedCat ──
  useEffect(() => {
    if (!allCategories.length || !categoryName) return;
    const matched = allCategories.find(c => c.name === categoryName);
    if (matched && matched.category_id !== selectedCat?.category_id) {
      setSelectedCat(matched);
      setFilters(INITIAL_FILTERS);
    }
  }, [categoryName]);

  // ── 3. category changes → fetch filter options ──
  useEffect(() => {
    if (!selectedCat) return;

    setFilterOptions([]);
    setProducts([]);
    setLoadingOptions(true);
    setError(null);

    fetchFilterOptions(selectedCat.category_id)
      .then(opts => setFilterOptions(opts))
      .catch(() => setFilterOptions([]))
      .finally(() => setLoadingOptions(false));
  }, [selectedCat?.category_id]);

  // ── 4. category or filters change → fetch products ──
  useEffect(() => {
    if (!selectedCat) return;

    const controller = new AbortController();
    setLoadingProducts(true);
    setError(null);

    fetchProductsWithFilters(selectedCat.category_id, filters)
      .then(data => {
        if (!controller.signal.aborted) setProducts(data);
      })
      .catch(err => {
        if (controller.signal.aborted) return;
        setProducts([]);
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingProducts(false);
      });

    return () => controller.abort();
  }, [selectedCat?.category_id, filters]);

  // ── filter action helpers ──────────────────────────────
  const toggleAttributeValue = useCallback((attributeId, value) => {
    setFilters(prev => {
      const existing = prev.attributeFilters.find(f => f.attributeId === attributeId);
      let updated;

      if (!existing) {
        updated = [...prev.attributeFilters, { attributeId, values: [value] }];
      } else {
        const newValues = existing.values.includes(value)
          ? existing.values.filter(v => v !== value)
          : [...existing.values, value];

        updated = newValues.length === 0
          ? prev.attributeFilters.filter(f => f.attributeId !== attributeId)
          : prev.attributeFilters.map(f =>
              f.attributeId === attributeId ? { ...f, values: newValues } : f
            );
      }
      return { ...prev, attributeFilters: updated };
    });
  }, []);

  const setPriceRange = useCallback((priceMin, priceMax) => {
    setFilters(prev => ({ ...prev, priceMin, priceMax }));
  }, []);

  const clearFilters = useCallback(() => setFilters(INITIAL_FILTERS), []);

  const isValueChecked = useCallback((attributeId, value) =>
    filters.attributeFilters
      .find(f => f.attributeId === attributeId)
      ?.values.includes(value) ?? false,
  [filters.attributeFilters]);

  const activeFilterCount =
    filters.attributeFilters.reduce((acc, f) => acc + f.values.length, 0) +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0);

  return {
    selectedCat,
    filterOptions,
    filters,
    products,
    loadingOptions,
    loadingProducts,
    error,
    toggleAttributeValue,
    setPriceRange,
    clearFilters,
    isValueChecked,
    activeFilterCount,
  };
}