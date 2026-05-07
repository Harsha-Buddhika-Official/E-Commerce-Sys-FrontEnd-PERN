import API from "../../../../../api/client";

export const fetchBestSellers = async () => {
    try {
        const response = await API.get("/products/best-selling");
        return response.data.data || response.data || [];
    } catch (error) {
        throw new Error(`Failed to fetch best sellers: ${error.message}`, { cause: error });
    }
};

export const fetchLatestProducts = async () => {
    try {
        const response = await API.get("/products/latest");
        return response.data.data || response.data || [];
    } catch (error) {
        throw new Error(`Failed to fetch latest products: ${error.message}`, { cause: error });
    }
};

export const fetchHomepageData = async () => {
    try {
        const [bestSellers, latest] = await Promise.all([
            fetchBestSellers(),
            fetchLatestProducts(),
        ]);
        return { bestSellers, latest };
    } catch (error) {
        throw new Error(`Failed to fetch homepage data: ${error.message}`, { cause: error });
    }
};
