import API from "../../../../../api/client";

export const fetchProductsByCategory = async (category) => {
    try {
        const response = await API.get(`/products/category/${category}`);
        return response.data.data || response.data || [];
    } catch (error) {
        throw new Error(`Failed to fetch products for category ${category}: ${error.message}`, { cause: error });
    }
};