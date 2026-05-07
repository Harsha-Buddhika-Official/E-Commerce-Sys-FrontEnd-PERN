<!-- BACKEND_CONNECTION_SETUP.md -->
# Backend Connection Setup Guide

## Quick Start (3 Steps)

### Step 1: Create `.env` File

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For **production**, update to your actual backend URL:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Step 2: Update Components

Replace old imports with new services:

**Before (with mock data):**
```javascript
import { fetchProductsBySection } from "@/features/products/api/productService";
```

**After (production ready):**
```javascript
import { getProductsBySection, searchProducts } from "@/features/products/api/productService";
```

### Step 3: Test the Connection

Add this test component temporarily to verify connections:

```javascript
// src/components/APIConnectionTest.jsx
import { useEffect } from "react";
import { getProductsBySection } from "@/features/products/api/productService";
import { getProductCategories } from "@/features/products/api/categoriesService";

export default function APIConnectionTest() {
  useEffect(() => {
    const test = async () => {
      try {
        console.log("Testing API Connection...");
        
        const categories = await getProductCategories();
        console.log("✅ Categories:", categories);
        
        const products = await getProductsBySection("best-sellers");
        console.log("✅ Products:", products);
        
      } catch (error) {
        console.error("❌ API Connection Failed:", error.message);
      }
    };
    
    test();
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f0f0", margin: "20px" }}>
      <h3>API Connection Test</h3>
      <p>Check browser console for results</p>
    </div>
  );
}
```

---

## Backend Endpoints Your API Must Provide

### Categories Endpoints
```
GET /api/categories
Response: Array of {id, name, color}

GET /api/categories/subcategories  
Response: Array of {id, name, color}
```

### Filter Endpoints
```
GET /api/filters
Response: {category: {filters: Array}}

GET /api/filters/category/:categoryName
Response: {filters: Array of {id, label, type, options, ...}}
```

### Product Endpoints
```
GET /api/products/section/:section
Params: section (best-sellers|latest|featured|trending)
Response: {data: Array, section: string, total: number}

GET /api/products?page=1&limit=20
Response: {data: Array, total: number, page: number, limit: number}

GET /api/products/:productId
Response: {id, title, price, image, specs, ...}

GET /api/products/search?q=query&page=1&limit=20
Response: {data: Array, total: number, query: string}

GET /api/products/featured?limit=8
Response: {data: Array, limit: number}
```

### Category Products Endpoints
```
GET /api/categories/:categoryName/products
Response: {data: Array, total: number}

GET /api/categories/:categoryName/products?page=1&limit=20
Response: {data: Array, total: number, page: number, pageSize: number}

GET /api/categories/:categoryName/products/filtered?filters={...}&sort=relevance
Response: {data: Array, total: number, filters: object}
```

---

## Common Integration Issues & Solutions

### Issue 1: "API_BASE is undefined"
**Cause:** Missing `.env` file
**Solution:** Create `.env` in project root with `VITE_API_BASE_URL=...`

### Issue 2: CORS Errors
**Cause:** Backend not configured for CORS
**Solution:** Add CORS headers in your backend:
```javascript
// Express example
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
```

### Issue 3: 404 Errors on API Calls
**Cause:** Endpoint paths don't match
**Solution:** Verify your backend endpoints match the exact paths in the guide

### Issue 4: Authentication Issues
**Cause:** Session tokens not being sent
**Solution:** All services already use `credentials: "include"` - ensure backend validates cookies

---

## Example: Complete Component Migration

### Before (with mock data):
```javascript
import { useState, useEffect } from "react";
import { fetchProductsBySection } from "@/features/products/api/productService";

export function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This was returning mock data!
    const load = async () => {
      const data = await fetchProductsBySection("best-sellers");
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div>
      {loading ? <p>Loading...</p> : <ProductGrid products={products} />}
    </div>
  );
}
```

### After (production ready):
```javascript
import { useState, useEffect } from "react";
import { getProductsBySection } from "@/features/products/api/productService";

export function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const result = await getProductsBySection("best-sellers");
        setProducts(result.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;
  if (products.length === 0) return <p>No products found</p>;

  return <ProductGrid products={products} />;
}
```

---

## Testing with cURL

Test your backend endpoints before integration:

```bash
# Test categories
curl http://localhost:5000/api/categories

# Test product by section
curl "http://localhost:5000/api/products/section/best-sellers"

# Test paginated products
curl "http://localhost:5000/api/products?page=1&limit=20"

# Test search
curl "http://localhost:5000/api/products/search?q=laptop"

# Test filters by category
curl "http://localhost:5000/api/filters/category/processors"
```

---

## Deployment Checklist

- [ ] Update `.env` with production API URL
- [ ] Test all API endpoints with real backend
- [ ] Verify CORS is configured on backend
- [ ] Test error handling with various error states
- [ ] Verify pagination works correctly
- [ ] Test search and filter functionality
- [ ] Monitor API response times
- [ ] Setup error logging/monitoring
- [ ] Remove APIConnectionTest component before deploy

---

## Additional Resources

### Service Function Reference

#### categoriesService.js
```javascript
await getProductCategories()           // Get product categories
await getAccessoryCategories()         // Get accessory categories  
await getAllCategories()               // Get both types
```

#### filterService.js
```javascript
await getFiltersByCategory("processors")  // Get specific category filters
await getAllFilters()                     // Get all filters
```

#### productService.js
```javascript
await getProductsBySection("best-sellers")     // By section
await getAllProducts(page, limit)              // All products
await getProductDetail(productId)              // Single product
await searchProducts(query, options)           // Search with filters
await getFeaturedProducts(limit)               // Featured products
```

#### productsByCategoryService.js
```javascript
await getProductsByCategory("processors")                    // All products
await getProductsByCategoryPaginated("processors", 1, 20)   // Paginated
await getFilteredProductsByCategory(category, filters, opts) // Filtered
```

---

## Support

For issues:
1. Check browser console for error messages
2. Verify API endpoint URLs match backend
3. Test endpoints with cURL first
4. Check network tab in DevTools
5. Ensure `.env` file exists with correct URL

---

**Status:** Ready for Production Integration ✅
