import API from "../../../../../api/client";

export const trackOrderAPI = async (payload) => {
    // console.log("API call - Tracking order with:", payload); // Debug log
    const response = await API.post("/orders/tracking", payload);
    return response.data;
};


// Create Order (Direct or Cart)
export const createOrderApi = (payload) =>{
    // console.log("API call - Creating order with payload:", payload); // Debug log
    return API.post("/orders/create", payload,{
        timeout: 100000, // Set timeout to 100 seconds
    });
}

export const uploadReceiptAPI = async (orderId, formData) => {
    // console.log("API call - Uploading receipt for orderId:", orderId, "with formData:", formData); // Debug log
    const { data } = await API.post(
        `/orders/upload-receipt/${orderId}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 100000,
        }
    );

    return data;
};

