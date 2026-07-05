import API from "../../../../../api/client";

export const trackOrderAPI = async (payload) => {
    const response = await API.post("/orders/tracking", payload);
    return response.data;
};


// Create Order (Direct or Cart)
export const createOrderApi = (payload) =>{
    return API.post("/orders/create", payload,{
        timeout: 100000, // Set timeout to 100 seconds
    });
}

export const uploadReceiptAPI = async (orderId, formData) => {
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

