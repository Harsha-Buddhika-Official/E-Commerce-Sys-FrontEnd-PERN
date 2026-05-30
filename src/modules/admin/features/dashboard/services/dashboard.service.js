import { getStatusBarDataApi, getLowAlertDataApi } from "../api/dashboard.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";

export const fetchStatusBarData = async () => {

    try {
        const res = await getStatusBarDataApi();
        const data = res.data;
        const dashboardStats = {
            revenue: Number(data.totalRevenueThisMonth),
            revenueGrowth: Number(data.comparedRevenuePercentage),
            totalOrders: Number(data.totalOrdersThisMonth),
            orderGrowth: Number(data.comparedOrdersPercentage),
            activeProducts: Number(data.activeProducts),
            lowStockProducts: Number(data.lowStockProducts),
            pendingOrders: Number(data.pendingOrders),
            shippedOrders: Number(data.shippedOrders)
        };
        return dashboardStats;
    } catch (error) {
        throw handleServiceError(error, "Failed to fetch dashboard stats", {
            service: "dashboard",
            operation: "fetchStatusBarData",
        });
    }
};

export const fetchLowAlertData = async () => {
    try {
        const res = await getLowAlertDataApi();

        const lowStockItems = res.data.map(product => ({
            id: Number(product.product_id),
            name: String(product.name),
            stock: Number(product.stock_quantity)
        }));
        return lowStockItems;
    } catch (error) {
        throw handleServiceError(error, "Failed to fetch low stock products", {
            service: "dashboard",
            operation: "fetchLowAlertData",
        });
    }
};