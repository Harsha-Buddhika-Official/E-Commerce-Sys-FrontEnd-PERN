import { getStatusBarData, getLowAlertData } from "../api/Dashboard.api";

export const fetchStatusBarData = async () => {
  try {
    const response = await getStatusBarData();
    return response.data?.data ?? {};
  } catch (error) {
    console.error("Error fetching status bar data:", error);
    throw error;
  }
};

export const fetchLowAlertData = async () => {
  try {
    const response = await getLowAlertData();
    return response.data ?? {};
  } catch (error) {
    console.error("Error fetching low stock alert data:", error);
    throw error;
  }
};
