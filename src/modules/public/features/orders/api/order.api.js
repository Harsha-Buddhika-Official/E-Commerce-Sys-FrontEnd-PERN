import API from "../../../../../api/client";

export const trackOrderAPI = async (payload) => {
    // console.log("API call - Tracking order with:", payload); // Debug log
    const response = await API.post("/orders/tracking", payload);
    return response.data;
};