import {getStatusBarData} from "../api/statusBar.api";

export const fetchStatusBarData = async () => {
  try {
    const response = await getStatusBarData();
    return response.data?.data ?? {};
  } catch (error) {
    console.error("Error fetching status bar data:", error);
    throw error; 
  }
};