import { trackOrderAPI, createOrderApi } from "../api/order.api";
import { extractObjectPayload } from "../../../../../utils/payloadExtractors.js";
import { handleServiceError } from "../../../../../utils/serviceError.js";

export const trackOrderService = async ({ email, trackingCode }) => {
    // console.log("Tracking order with:", { email, trackingCode });
    const response = await trackOrderAPI({ email, trackingCode });

    if (!response?.success) {
        throw new Error("Failed to fetch order");
    }

    return response.data;
};



export const createOrder = async (payload) => {
  try {
    const response = await createOrderApi(payload);

    return extractObjectPayload(response.data);
  } catch (error) {
    throw handleServiceError(
      error,
      "Failed to create order",
      {
        service: "OrderService",
        operation: "createOrder",
      }
    );
  }
};