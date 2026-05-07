import API from "../../../../../api/client";

// export const fetchBestSellers = async () => {
//     try {
//         const response = await API.get("/products/best-selling");
//         return response.data.data || response.data || [];
//     } catch (error) {
//         throw new Error(`Failed to fetch best sellers: ${error.message}`, { cause: error });
//     }
// };

// export const fetchLatestProducts = async () => {
//     try {
//         const response = await API.get("/products/latest");
//         return response.data.data || response.data || [];
//     } catch (error) {
//         throw new Error(`Failed to fetch latest products: ${error.message}`, { cause: error });
//     }
// };

export const fetchHomepageData = async () => {
    try {
        const [bestSellers, latest] = await Promise.all([
            API.get("/products/best-selling"),
            API.get("/products/latest"),
        ]);
        latest.data.data.forEach(product => {
            product.product_tag = "LATEST";
        });
        return {
            bestSellers: bestSellers.data.data || bestSellers.data || [],
            latest: latest.data.data || latest.data || []
        };
    } catch (error) {
        throw new Error(`Failed to fetch homepage data: ${error.message}`, { cause: error });
    }
};
