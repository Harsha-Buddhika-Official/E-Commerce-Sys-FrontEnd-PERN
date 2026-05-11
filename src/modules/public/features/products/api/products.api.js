import API from "../../../../../api/client";

export const getAllProducts = () => 
    API.get("/products")

export const getProductsByCategory = (categoryId) =>  
    API.get(`/products/category/${categoryId}`)

//home page
export const getBestSellers = () => 
    API.get("/products/best-selling");

export const getLatestProducts = () => 
    API.get("/products/latest");

// Filtering
export const getFilterOptions = (categoryId) =>
  API.get(`/products/filter/options/${categoryId}`);

export const getFilteredProducts = (categoryId, filters) =>
  API.post(`/products/filter/${categoryId}`, filters);

//product details
export const getProductDetails = (productId) =>
  API.get(`/products/${productId}`);