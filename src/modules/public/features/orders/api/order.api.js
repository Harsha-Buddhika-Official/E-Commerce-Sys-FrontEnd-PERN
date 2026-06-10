import API from "../../../../../api/client";

export const trackOrderAPI = async (payload) => {
    // console.log("API call - Tracking order with:", payload); // Debug log
    const response = await API.post("/orders/tracking", payload);
    return response.data;
};


// Create Order (Direct or Cart)
export const createOrderApi = (payload) =>{
    console.log("API call - Creating order with payload:", payload); // Debug log
    return API.post("/orders/create", payload);
}