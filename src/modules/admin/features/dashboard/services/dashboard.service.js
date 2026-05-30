import {getStatusBarDataApi,getLowAlertDataApi} from "../api/dashboard.api";

export const fetchStatusBarData = async () => {

    try {
        const res = await getStatusBarDataApi();
        const data = res.data;
        const dashboardStats = {
            revenue:Number(data.totalRevenueThisMonth),
            revenueGrowth:Number(data.comparedRevenuePercentage),
            totalOrders:Number(data.totalOrdersThisMonth),
            orderGrowth:Number(data.comparedOrdersPercentage),
            activeProducts:Number(data.activeProducts),
            lowStockProducts:Number(data.lowStockProducts),
            pendingOrders:Number(data.pendingOrders),
            shippedOrders:Number(data.shippedOrders)
        };
        return dashboardStats;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
};

export const fetchLowAlertData = async () => {
    try {
        const res =await getLowAlertDataApi();

        const lowStockItems = res.data.map(product => ({
            id: Number(product.product_id),
            name: String(product.name),
            stock: Number(product.stock_quantity)
        }));
        return lowStockItems;
    } catch (error) {
        console.error("Error fetching low stock products:", error);
        throw error;
    }
};