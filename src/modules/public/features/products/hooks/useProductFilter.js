import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAllCategories } from '../../categories/services/categories.service';
import {
  fetchFilterOptions,
  fetchProductsWithFilters,
} from '../services/products.service';
import { getCache, setCache } from "../../../../../utils/cache.js";
import { getMemoryCache, setMemoryCache } from "../../../../../utils/memoryCache.js";

const INITIAL_FILTERS = {
  attributeFilters: [],
  priceMin: '',
  priceMax: '',
};

const CATEGORIES_CACHE_KEY = 'public_categories_all';
const FILTERED_PRODUCTS_TTL = 1000 * 60 * 5; // 5 minutes

export function useProductFilter() {
  const [searchParams]    = useSearchParams();
  const categoryName      = decodeURIComponent(searchParams.get('category') || '');

  const [allCategories,   setAllCategories]   = useState([]);
  const [selectedCat,     setSelectedCat]     = useState(null);
  const [filterOptions,   setFilterOptions]   = useState([]);
  const [filters,         setFilters]         = useState(INITIAL_FILTERS);
  const [productList,     setProductList]     = useState([]);
  const [loadingOptions,  setLoadingOptions]  = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error,           setError]           = useState(null);

  const categoryNameRef = useRef(categoryName);
  useEffect(() => { categoryNameRef.current = categoryName; }, [categoryName]);

  // 1 — load categories once (cached, 24h)
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const cached = getCache(CATEGORIES_CACHE_KEY);
      if (cached) {
        if (cancelled) return;
        setAllCategories(cached);
        const matched = cached.find(c => c.name === categoryNameRef.current);
        setSelectedCat(matched || cached[0] || null);
        return;
      }

      try {
        const { products: prodCats, accessories } = await fetchAllCategories();
        if (cancelled) return;

        const flat = [...prodCats, ...accessories];
        setAllCategories(flat);
        setCache(CATEGORIES_CACHE_KEY, flat);

        const matched = flat.find(c => c.name === categoryNameRef.current);
        setSelectedCat(matched || flat[0] || null);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  // 2 — URL category param changes
  useEffect(() => {
    if (!allCategories.length || !categoryName) return;
    const matched = allCategories.find(c => c.name === categoryName);
    if (matched && matched.category_id !== selectedCat?.category_id) {
      setSelectedCat(matched);
      setFilters(INITIAL_FILTERS);
    }
  }, [categoryName, allCategories, selectedCat]);

  // 3 — fetch filter options when category changes (cached, 24h, per category)
  useEffect(() => {
    if (!selectedCat) return;
    let cancelled = false;

    const cacheKey = `public_filter_options_${selectedCat.category_id}`;

    setProductList([]);
    setError(null);
    setFilterOptions([]);

    const load = async () => {
      const cached = getCache(cacheKey);
      if (cached) {
        if (!cancelled) setFilterOptions(cached);
        return;
      }

      setLoadingOptions(true);
      try {
        const opts = await fetchFilterOptions(selectedCat.category_id);
        if (!cancelled) {
          const safeOpts = Array.isArray(opts) ? opts : [];
          setFilterOptions(safeOpts);
          setCache(cacheKey, safeOpts);
        }
      } catch {
        if (!cancelled) setFilterOptions([]);
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [selectedCat]);

  // 4 — fetch products when category or filters change (short-lived memory cache, 5 min)
  useEffect(() => {
    if (!selectedCat) return;
    let cancelled = false;

    const cacheKey = `public_products_${selectedCat.category_id}_${JSON.stringify(filters)}`;

    const cached = getMemoryCache(cacheKey, FILTERED_PRODUCTS_TTL);
    if (cached) {
      setProductList(cached);
      setError(null);
      setLoadingProducts(false);
      return;
    }

    setLoadingProducts(true);
    setError(null);

    fetchProductsWithFilters(selectedCat.category_id, filters)
      .then(data => {
        if (!cancelled) {
          const safeData = Array.isArray(data) ? data : [];
          setProductList(safeData);
          setMemoryCache(cacheKey, safeData);
        }
      })
      .catch(err => {
        if (cancelled) return;
        setProductList([]);
        const status = err.response ? err.response.status : null;
        const message = err.response ? err.response.data.message : err.message;
        if (status !== 404) setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });

    return () => { cancelled = true; };
  }, [selectedCat, filters]);

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

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const isValueChecked = useCallback((attributeId, value) => {
    const found = filters.attributeFilters.find(f => f.attributeId === attributeId);
    return found ? found.values.includes(value) : false;
  }, [filters.attributeFilters]);

  const activeFilterCount =
    filters.attributeFilters.reduce((acc, f) => acc + f.values.length, 0) +
    (filters.priceMin !== '' ? 1 : 0) +
    (filters.priceMax !== '' ? 1 : 0);

  return {
    selectedCat,
    filterOptions,
    filters,
    products: productList,
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