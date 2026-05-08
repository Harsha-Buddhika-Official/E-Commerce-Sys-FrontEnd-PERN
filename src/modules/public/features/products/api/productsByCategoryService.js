import API from "../../../../../api/client";

export const fetchProducts = async (category = null) => {
    try {
        let endpoint = "/products";
        if (category) {
            endpoint = `/products/category/${category}`;
        }
        const response = await API.get(endpoint);
        return response.data.data || response.data || [];
    } catch (error) {
        throw new Error(`Failed to fetch products for category ${category}: ${error.message}`, { cause: error });
    }
};

export const fetchProductsByCategory = async (category) => {
    return fetchProducts(category);
}