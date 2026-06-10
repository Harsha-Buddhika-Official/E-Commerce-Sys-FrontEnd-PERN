import { useState } from "react";
import { trackOrderService } from "../services/orders.service";

export const useTrackOrder = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const trackOrder = async ({ email, trackingCode }) => {
        try {
            setLoading(true);
            setError("");
            // console.log("Tracking order with:", { email, trackingCode });

            const data = await trackOrderService({ email, trackingCode });
            setOrder(data);

            return data;
        } catch (err) {
            setError(err.message || "Order not found");
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    return {
        order,
        loading,
        error,
        trackOrder,
        setOrder,
    };
};