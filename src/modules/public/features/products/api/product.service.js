import API from "../../../../../api/client";

export const fetchAllProducts = async () => {
    try {
        const response = await API.get("/");
        return response.data.data || response.data || [];
    } catch (error) {
        throw new Error(`Failed to fetch products: ${error.message}`, { cause: error });
    }
};