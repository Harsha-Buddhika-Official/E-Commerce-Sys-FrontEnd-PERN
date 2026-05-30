import {getStatusBarDataApi,getLowAlertDataApi} from "../api/dashboard.api";

export const fetchStatusBarData = async () => {

    try {
        const response = await getStatusBarDataApi();
        const data = response.data;
        return {
            revenue:Number(data.totalRevenueThisMonth),
            revenueGrowth:Number(data.comparedRevenuePercentage),
            totalOrders:Number(data.totalOrdersThisMonth),
            orderGrowth:Number(data.comparedOrdersPercentage),
            activeProducts:Number(data.activeProducts),
            lowStockProducts:Number(data.lowStockProducts),
            pendingOrders:Number(data.pendingOrders),
            shippedOrders:Number(data.shippedOrders)
        };
        

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
};

export const fetchLowAlertData = async () => {
    try {
        const response =await getLowAlertDataApi();

        return response.data.map(product => ({
            id: product.product_id,
            name: product.name,
            stock: product.stock_quantity,
            image: product.image_url,
            category: product.category_name,
            price: Number(product.selling_price)
        }));
    } catch (error) {
        console.error("Error fetching low stock products:", error);
        throw error;
    }
};