import { useState } from "react";
import { uploadReceiptService } from "../services/orders.service.js";

export const useUploadReceipt = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uploadReceipt = async (orderId, file) => {
        console.log("File data in Hook layer: ", file); // Debug log
        try {
            setLoading(true);
            setError(null);

            return await uploadReceiptService(orderId, file);
        } catch (err) {
            const message = err.message || "Failed to upload receipt";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { uploadReceipt, loading, error };
};