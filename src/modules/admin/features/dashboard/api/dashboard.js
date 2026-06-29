import API from "../../../../../api/client.js";
import { handleApiError } from "../../../../../utils/apiError.js";

export const getStatusBarDataApi = async () => {
  try {
    const response = await API.get("/orders/admin/statuses");
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch dashboard stats");
  }
};

export const getLowAlertDataApi = async () => {
  try {
    const response = await API.get("/orders/admin/low-stock-alert");
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch low stock products");
  }
};