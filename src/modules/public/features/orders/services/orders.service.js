import { trackOrderAPI } from "../api/order.api";

export const trackOrderService = async ({ email, trackingCode }) => {
    // console.log("Tracking order with:", { email, trackingCode });
    const response = await trackOrderAPI({ email, trackingCode });

    if (!response?.success) {
        throw new Error("Failed to fetch order");
    }

    return response.data;
};