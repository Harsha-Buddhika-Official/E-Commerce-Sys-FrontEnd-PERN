import {getStatusBarDataApi,getLowAlertDataApi,} from "../api/dashboard.api";
import { handleServiceError } from "../../../../../utils/serviceError.js";
import {safeNumber,safeMoney,safeText,} from "../../../../../utils/normalizers.js";

export const fetchStatusBarData = async () => {
  try {
    const response = await getStatusBarDataApi();

    if (!response || typeof response !== "object") {
      throw new Error("Invalid dashboard stats response");
    }

    const data = response.data;

    if (!data || typeof data !== "object") {
      throw new Error("Dashboard data is missing");
    }

    return {
      revenue: safeMoney(data.totalRevenueThisMonth),
      revenueGrowth:
        safeNumber(data.comparedRevenuePercentage) ?? 0,
      totalOrders:
        safeNumber(data.totalOrdersThisMonth) ?? 0,
      orderGrowth:
        safeNumber(data.comparedOrdersPercentage) ?? 0,
      activeProducts:
        safeNumber(data.activeProducts) ?? 0,
      lowStockProducts:
        safeNumber(data.lowStockProducts) ?? 0,
      pendingOrders:
        safeNumber(data.pendingOrders) ?? 0,
      shippedOrders:
        safeNumber(data.shippedOrders) ?? 0,
    };
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch dashboard stats", {
      service: "dashboard",
      operation: "fetchStatusBarData",
    });
  }
};

export const fetchLowAlertData = async () => {
  try {
    const response = await getLowAlertDataApi();

    if (!response || typeof response !== "object") {
      throw new Error("Invalid low stock response");
    }

    const products = Array.isArray(response.data)
      ? response.data
      : [];

    return products
      .filter((product) => product && typeof product === "object")
      .map((product) => ({
        id: safeNumber(product.product_id) ?? 0,
        name: safeText(product.name) ?? "",
        stock: safeNumber(product.stock_quantity) ?? 0,
      }));
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch low stock products", {
      service: "dashboard",
      operation: "fetchLowAlertData",
    });
  }
};