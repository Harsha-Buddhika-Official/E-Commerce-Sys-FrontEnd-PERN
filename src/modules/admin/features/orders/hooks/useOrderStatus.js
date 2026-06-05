import { getOrderStatusCounts } from "../service/order.service.js";
import { useEffect,useState } from "react";

export  const useOrderStatus = () => {
    const [orderStatus, setOrderStatus] = useState({
        pendingOrders: 0,
        paidOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        completeOrders: 0,
        cancelledOrders: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedData = await getOrderStatusCounts();
                setOrderStatus(fetchedData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return { orderStatus, loading, error };
}