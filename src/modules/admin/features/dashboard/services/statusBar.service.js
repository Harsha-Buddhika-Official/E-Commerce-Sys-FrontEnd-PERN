import {getStatusBarData} from "../api/Dashboard.api";

export const fetchStatusBarData = async () => {
  try {
    const response = await getStatusBarData();
    return response.data?.data ?? {};
  } catch (error) {
    console.error("Error fetching status bar data:", error);
    throw error; 
  }
};