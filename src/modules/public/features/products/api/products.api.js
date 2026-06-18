import API from "../../../../../api/client";

export const getAllProducts = () => {
    return API.get("/products");
};

export const getProductsByCategory = (categoryId) => {
    return API.get(`/products/category/${categoryId}`)
}

//home page
export const getBestSellers = () => {
    return API.get("/products/best-selling");
};

export const getLatestProducts = () => {
    return API.get("/products/latest");
};

// Filtering
export const getFilterOptions = (categoryId) => {
    return API.get(`/products/filter/options/${categoryId}`);
}

export const getFilteredProducts = (categoryId, filters) => {
    return API.post(`/products/filter/${categoryId}`, filters);
}

//product details
export const getProductDetails = (productId) => {
    return API.get(`/products/${productId}`);
}