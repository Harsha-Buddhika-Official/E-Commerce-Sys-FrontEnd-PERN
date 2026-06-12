import { trackOrderAPI, createOrderApi, uploadReceiptAPI } from "../api/order.api";
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

export const uploadReceiptService = async (orderId, file) => {
    // console.log("File data in Service layer: ", file); // Debug log
    try {
        const formData = new FormData();
        formData.append("media", file);
        // console.log("FormData prepared for upload:", formData.get("media")); // Debug log
        const response = await uploadReceiptAPI(orderId, formData);

        return extractObjectPayload(response);
    } catch (error) {
        throw handleServiceError(error, "Failed to upload receipt", {
            service: "OrderService",
            operation: "uploadReceipt",
        });
    }
};