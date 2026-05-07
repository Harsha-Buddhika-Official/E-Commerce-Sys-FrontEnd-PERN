<!-- QUICK_REFERENCE.md -->
# Service Functions Quick Reference

## Import Examples

```javascript
// Categories Service
import { 
  getProductCategories, 
  getAccessoryCategories, 
  getAllCategories 
} from "@/modules/public/features/products/api/categoriesService";

// Filter Service
import { 
  getFiltersByCategory, 
  getAllFilters, 
  fetchCategoryFilters 
} from "@/modules/public/features/products/api/filterService";

// Products By Category Service
import { 
  getProductsByCategory, 
  getProductsByCategoryPaginated, 
  getFilteredProductsByCategory 
} from "@/modules/public/features/products/api/productsByCategoryService";

// Product Service
import { 
  getProductsBySection, 
  getAllProducts, 
  getProductDetail, 
  searchProducts, 
  getFeaturedProducts, 
  fetchProductsBySection 
} from "@/modules/public/features/products/api/productService";
```

---

## Function Reference Table

### categoriesService.js

| Function | Parameters | Returns | Use Case |
|----------|-----------|---------|----------|
| `getProductCategories()` | None | `Array<Category>` | Get all product categories |
| `getAccessoryCategories()` | None | `Array<Category>` | Get all accessory categories |
| `getAllCategories()` | None | `{products: Array, accessories: Array}` | Get both category types |

### filterService.js

| Function | Parameters | Returns | Use Case |
|----------|-----------|---------|----------|
| `getFiltersByCategory(category)` | `string` | `{filters: Array}` | Get filters for specific category |
| `getAllFilters()` | None | `Object` | Get all filters for all categories |
| `fetchCategoryFilters(category)` | `string` | `{filters: Array}` | Alias (backwards compatible) |

### productsByCategoryService.js

| Function | Parameters | Returns | Use Case |
|----------|-----------|---------|----------|
| `getProductsByCategory(category)` | `string` | `{data: Array, total: number}` | All products in category |
| `getProductsByCategoryPaginated(category, page, pageSize)` | `string, number, number` | `{data: Array, total, page, pageSize}` | Paginated category products |
| `getFilteredProductsByCategory(category, filters, options)` | `string, Object, {sort, page, pageSize}` | `{data: Array, total, filters}` | Filtered category products |

### productService.js

| Function | Parameters | Returns | Use Case |
|----------|-----------|---------|----------|
| `getProductsBySection(section)` | `"best-sellers"\|"latest"\|"featured"\|"trending"` | `{data: Array, section, total}` | Products by section |
| `getAllProducts(page, limit)` | `number, number` | `{data: Array, total, page, limit}` | All products (paginated) |
| `getProductDetail(productId)` | `number\|string` | `Product` | Single product details |
| `searchProducts(query, options)` | `string, {page?, limit?, filters?}` | `{data: Array, total, query}` | Search with optional filters |
| `getFeaturedProducts(limit)` | `number` | `{data: Array, limit}` | Featured products for homepage |
| `fetchProductsBySection(section)` | `string` | `{data: Array, section, total}` | Alias (backwards compatible) |

---

## Category Object
```javascript
{
  id: number,
  name: string,
  color: string  // Tailwind gradient class
}
```

## Product Object
```javascript
{
  id: number,
  title: string,
  price: string,
  image: string,
  specs: Array<string>,
  inStock: boolean,
  badge: string,
  category?: string,
  description?: string,
  rating?: number,
  reviews?: number
}
```

## Filter Object
```javascript
{
  id: string,
  label: string,
  type: "radio" | "checkbox",
  options: Array<string>,
  columnLayout?: number,
  maxShowInitial?: number
}
```

---

## Common Usage Patterns

### Pattern 1: Fetch and Display Categories
```javascript
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  getAllCategories()
    .then(data => {
      setCategories(data.products);
      setLoading(false);
    })
    .catch(err => console.error(err));
}, []);

return (
  <div>
    {loading ? <Spinner /> : categories.map(cat => <CategoryCard {...cat} />)}
  </div>
);
```

### Pattern 2: Paginated Product List
```javascript
const [products, setProducts] = useState([]);
const [page, setPage] = useState(1);
const [total, setTotal] = useState(0);

const loadPage = async (pageNum) => {
  const result = await getProductsByCategoryPaginated("processors", pageNum, 20);
  setProducts(result.data);
  setTotal(result.total);
  setPage(pageNum);
};

return (
  <>
    <ProductGrid products={products} />
    <Pagination 
      current={page} 
      total={Math.ceil(total / 20)} 
      onPageChange={loadPage} 
    />
  </>
);
```

### Pattern 3: Search with Filters
```javascript
const [results, setResults] = useState([]);

const handleSearch = async (query, selectedFilters) => {
  const data = await searchProducts(query, {
    page: 1,
    limit: 20,
    filters: selectedFilters
  });
  setResults(data.data);
};

return (
  <>
    <SearchInput onSearch={handleSearch} />
    <ProductGrid products={results} />
  </>
);
```

### Pattern 4: Filtered Category Browse
```javascript
const [products, setProducts] = useState([]);

const applyFilters = async (filterCriteria) => {
  const data = await getFilteredProductsByCategory(
    "monitors",
    filterCriteria,
    { sort: "price-asc", page: 1, pageSize: 20 }
  );
  setProducts(data.data);
};

return (
  <>
    <FilterPanel onApply={applyFilters} />
    <ProductGrid products={products} />
  </>
);
```

### Pattern 5: Homepage with Multiple Sections
```javascript
const [bestSellers, setBestSellers] = useState([]);
const [latest, setLatest] = useState([]);
const [featured, setFeatured] = useState([]);

useEffect(() => {
  Promise.all([
    getProductsBySection("best-sellers"),
    getProductsBySection("latest"),
    getFeaturedProducts(8)
  ]).then(([bs, lt, feat]) => {
    setBestSellers(bs.data);
    setLatest(lt.data);
    setFeatured(feat.data);
  });
}, []);

return (
  <>
    <Section title="Best Sellers" products={bestSellers} />
    <Section title="Latest" products={latest} />
    <Section title="Featured" products={featured} />
  </>
);
```

### Pattern 6: Error Handling
```javascript
const [error, setError] = useState(null);

const loadProducts = async () => {
  try {
    const data = await getProductsBySection("best-sellers");
    // Use data.data for products
  } catch (err) {
    if (err.status === 404) {
      setError("Products not found");
    } else if (err.status === 500) {
      setError("Server error. Please try again later");
    } else {
      setError(err.message);
    }
  }
};

return error && <ErrorBanner message={error} />;
```

---

## Parameter Validation Rules

### Pagination
- Page: minimum 1
- Limit: 1-100 (max 100)
- Default limit: 20

### Sections
- Valid: "best-sellers", "latest", "featured", "trending"
- Case-insensitive
- Trimmed automatically

### Filters
- Can be empty object {}
- Format: {fieldName: value}
- Sent as JSON in query string

### Search
- Query required (cannot be empty)
- Minimum 1 character
- Trimmed automatically

---

## Environment Setup

```env
# Development
VITE_API_BASE_URL=http://localhost:5000/api

# Production  
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

---

## Error Handling Structure

```javascript
try {
  const result = await getProductsBySection("best-sellers");
  console.log(result.data);
} catch (error) {
  // error.name = "APIError"
  // error.message = human readable message
  // error.status = HTTP status code
  // error.originalError = original error object
  
  if (error.status === 400) {
    console.log("Bad request - invalid parameters");
  } else if (error.status === 404) {
    console.log("Not found");
  } else if (error.status === 500) {
    console.log("Server error");
  }
}
```

---

## Testing Checklist

- [ ] `.env` file created with API URL
- [ ] All 4 services import without errors
- [ ] Backend endpoints accessible
- [ ] Categories load successfully
- [ ] Filters load successfully
- [ ] Products load by section
- [ ] Pagination works
- [ ] Filtering works
- [ ] Search works
- [ ] Error messages display properly
- [ ] Production URL set before deploy

---

## Performance Tips

1. **Use Pagination** - Don't load all products at once
2. **Debounce Search** - Add delay before API call while typing
3. **Cache Results** - Store fetched data in state/context
4. **Lazy Load** - Load product sections on scroll
5. **Parallel Requests** - Use Promise.all() for multiple calls

---

## HTTP Status Codes to Handle

| Code | Meaning | Handle |
|------|---------|--------|
| 200 | Success | Use data normally |
| 400 | Bad Request | Check parameters |
| 404 | Not Found | Show "no results" message |
| 500 | Server Error | Show error banner |
| 503 | Service Unavailable | Show offline message |

---

**Last Updated:** May 2026  
**Version:** 1.0 - Production Ready ✅
