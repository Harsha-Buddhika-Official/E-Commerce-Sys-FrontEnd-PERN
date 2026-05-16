import { fetchOrderStats } from "../api/order.api";

export const getOrderStatusCounts = async () => {
    try {
        const response = await fetchOrderStats();
        const payload = response && typeof response === "object" && "data" in response
            ? response.data
            : response;
        return payload;
    } catch (error) {
        console.error("Error fetching order status counts:", error);
        throw error;
    }
}