<!-- API_INTEGRATION_GUIDE.md -->
# Production-Ready API Services Integration Guide

## Overview

All 4 product-related service files have been refactored to **production-level** code with no mock data. They are ready to connect to your backend API.

---

## File Structure & Services

### 1. **categoriesService.js**
📍 `src/modules/public/features/products/api/categoriesService.js`

**Functions:**
- `getProductCategories()` - Fetch product categories
- `getAccessoryCategories()` - Fetch accessory/subcategories  
- `getAllCategories()` - Fetch both product and accessory categories

**Expected Backend Endpoints:**
```
GET /api/categories
GET /api/categories/subcategories
```

**Response Format:**
```json
{
  "id": 1,
  "name": "Processors",
  "color": "from-blue-600 to-blue-800"
}
```

---

### 2. **filterService.js**
📍 `src/modules/public/features/products/api/filterService.js`

**Functions:**
- `getFiltersByCategory(category)` - Get filters for a specific category
- `getAllFilters()` - Get all available filters
- `fetchCategoryFilters(category)` - Alias for backwards compatibility

**Expected Backend Endpoints:**
```
GET /api/filters
GET /api/filters/category/:category
```

**Response Format:**
```json
{
  "filters": [
    {
      "id": "brand",
      "label": "Brand",
      "type": "radio",
      "options": ["INTEL", "AMD"],
      "columnLayout": 2,
      "maxShowInitial": 6
    }
  ]
}
```

---

### 3. **productsByCategoryService.js**
📍 `src/modules/public/features/products/api/productsByCategoryService.js`

**Functions:**
- `getProductsByCategory(category)` - Get all products in a category
- `getProductsByCategoryPaginated(category, page, pageSize)` - Get paginated products
- `getFilteredProductsByCategory(category, filterCriteria, options)` - Get filtered products

**Expected Backend Endpoints:**
```
GET /api/categories/:category/products
GET /api/categories/:category/products?page=1&limit=20
GET /api/categories/:category/products/filtered?sort=relevance&page=1&limit=20&filters={...}
```

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Product Name",
      "price": "Rs. 50,000.00",
      "image": "https://example.com/image.jpg",
      "specs": ["Spec 1", "Spec 2"],
      "inStock": true,
      "badge": "In Stock"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

---

### 4. **productService.js**
📍 `src/modules/public/features/products/api/productService.js`

**Functions:**
- `getProductsBySection(section)` - Get products by section (best-sellers, latest, featured, trending)
- `getAllProducts(page, limit)` - Get all products with pagination
- `getProductDetail(productId)` - Get detailed info for a single product
- `searchProducts(query, options)` - Search products
- `getFeaturedProducts(limit)` - Get featured products for homepage
- `fetchProductsBySection(section)` - Alias for backwards compatibility

**Expected Backend Endpoints:**
```
GET /api/products/section/:section
GET /api/products?page=1&limit=20
GET /api/products/:productId
GET /api/products/search?q=laptop&page=1&limit=20&filters={...}
GET /api/products/featured?limit=8
```

**Response Format:**
```json
{
  "data": [...products],
  "total": 100,
  "page": 1,
  "limit": 20,
  "section": "best-sellers"
}
```

---

## Error Handling

All services use a custom `APIError` class with:
- **message** - Human readable error message
- **status** - HTTP status code
- **originalError** - Original error object for debugging

### Error Usage:
```javascript
try {
  const products = await getProductsBySection("best-sellers");
} catch (error) {
  if (error.status === 404) {
    console.log("Products not found");
  } else if (error.status === 500) {
    console.log("Server error");
  }
  console.error(error.message);
}
```

---

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

or for production:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

The services will automatically use `http://localhost:5000/api` as fallback if not configured.

---

## Usage Examples

### Example 1: Fetch Categories
```javascript
import { getAllCategories } from "@/features/products/api/categoriesService";

const loadCategories = async () => {
  try {
    const { products, accessories } = await getAllCategories();
    console.log("Products:", products);
    console.log("Accessories:", accessories);
  } catch (error) {
    console.error("Failed to load categories:", error.message);
  }
};
```

### Example 2: Get Paginated Products by Category
```javascript
import { getProductsByCategoryPaginated } from "@/features/products/api/productsByCategoryService";

const loadProducts = async () => {
  try {
    const result = await getProductsByCategoryPaginated("processors", 1, 20);
    console.log("Products:", result.data);
    console.log("Total:", result.total);
  } catch (error) {
    console.error("Error:", error.message);
  }
};
```

### Example 3: Search Products with Filters
```javascript
import { searchProducts } from "@/features/products/api/productService";

const searchLaptops = async () => {
  try {
    const results = await searchProducts("gaming laptop", {
      page: 1,
      limit: 20,
      filters: { brand: "ASUS", priceRange: "50000-100000" }
    });
    console.log("Search results:", results.data);
  } catch (error) {
    console.error("Search failed:", error.message);
  }
};
```

### Example 4: Get Filtered Products by Category
```javascript
import { getFilteredProductsByCategory } from "@/features/products/api/productsByCategoryService";

const filterProducts = async () => {
  try {
    const results = await getFilteredProductsByCategory(
      "monitors",
      { brand: "LG", resolution: "4K" },
      { sort: "price-asc", page: 1, pageSize: 20 }
    );
    console.log("Filtered products:", results.data);
  } catch (error) {
    console.error("Filter failed:", error.message);
  }
};
```

---

## Integration Checklist

- [ ] Update `.env` with your backend API URL
- [ ] Verify backend endpoints are created and running
- [ ] Test each service function with proper error handling
- [ ] Update React components to use the new services
- [ ] Remove any remaining references to old mock data files
- [ ] Add loading states and error boundaries in components
- [ ] Test pagination and filtering functionality
- [ ] Validate response data structures match your backend

---

## Production Considerations

### Security
- ✅ Uses `credentials: "include"` for cookie/session management
- ✅ Validates input parameters
- ✅ Proper error handling without exposing sensitive data
- ✅ All API calls use secure HTTPS in production

### Performance
- ✅ Supports pagination to handle large datasets
- ✅ Allows filtering to reduce data transfer
- ✅ Implements query parameter encoding
- ✅ Includes sort options for better UX

### Maintainability
- ✅ Clean, readable code structure
- ✅ Comprehensive JSDoc comments
- ✅ Consistent error handling pattern
- ✅ Easy to extend with new endpoints

---

## Backend API Requirements Summary

| Endpoint | Method | Parameters | Description |
|----------|--------|------------|-------------|
| `/categories` | GET | - | Get all product categories |
| `/categories/subcategories` | GET | - | Get accessory categories |
| `/filters` | GET | - | Get all filters |
| `/filters/category/:category` | GET | category | Get filters for category |
| `/categories/:category/products` | GET | category | Get products by category |
| `/categories/:category/products/filtered` | GET | category, filters, sort, page, limit | Get filtered products |
| `/products/section/:section` | GET | section | Get products by section |
| `/products` | GET | page, limit | Get all products (paginated) |
| `/products/:productId` | GET | productId | Get product details |
| `/products/search` | GET | q, page, limit, filters | Search products |
| `/products/featured` | GET | limit | Get featured products |

---

## Support & Debugging

- All functions log errors to browser console with `[FunctionName]` prefix
- Use Network tab in DevTools to monitor API calls
- Check response status codes and messages for debugging
- Ensure CORS is properly configured on your backend
- Test with Postman or similar tools before integration

---

**Last Updated:** May 2026
**Status:** Production Ready ✅
