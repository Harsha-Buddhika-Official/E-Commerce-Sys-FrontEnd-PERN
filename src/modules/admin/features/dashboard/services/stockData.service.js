import { getLowAlertData } from "../api/Dashboard.api";

export const fetchLowAlertData = async () => {
    try {
        const response = await getLowAlertData();
        return response.data; // Assuming the API response has a 'data' field
    } catch (error) {
        console.error("Error fetching low stock alert data:", error);
        throw error;
    }
};